/**
 * Rate limiter to prevent API abuse.
 * Allows max 10 calls per 60 seconds per session.
 */
export const rateLimiter = {
  calls: [],
  maxCalls: 10,
  windowMs: 60000,

  /**
   * Checks if a new API call is allowed under current rate limit.
   * @returns {boolean} True if call is permitted, false if limit exceeded.
   */
  isAllowed() {
    const now = Date.now();
    this.calls = this.calls.filter((t) => now - t < this.windowMs);
    if (this.calls.length >= this.maxCalls) return false;
    this.calls.push(now);
    return true;
  },
};

import { GoogleGenerativeAI } from '@google/generative-ai';

// ─── Custom Error Classes ────────────────────────────────────────────────────

/** Thrown when a network-level failure occurs (no internet, DNS failure). */
export class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NetworkError';
  }
}

/** Thrown when the Gemini API rate limit (429) is exceeded. */
export class RateLimitError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RateLimitError';
  }
}

/** Thrown for all other Gemini API-level failures. */
export class APIError extends Error {
  constructor(message) {
    super(message);
    this.name = 'APIError';
  }
}

// ─── Initialisation ──────────────────────────────────────────────────────────

/** @type {GoogleGenerativeAI|undefined} */
let genAI;

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

try {
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
    // eslint-disable-next-line no-console
    console.warn(
      'Gemini API key is missing or placeholder. Client-side AI features will be limited.'
    );
  } else {
    genAI = new GoogleGenerativeAI(apiKey);
  }
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('Failed to initialize Gemini AI:', error);
}

// ─── Model Fallback Chain ────────────────────────────────────────────────────

/** Ordered list of models to attempt for chat — falls back on 503. */
const CHAT_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
];

/** Ordered list of models to attempt for content analysis — falls back on 503. */
const ANALYSIS_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
];

/**
 * Returns true if the error indicates the model is overloaded/unavailable.
 * @param {Error} err
 * @returns {boolean}
 */
const isOverloaded = (err) =>
  err.message?.includes('503') ||
  err.message?.includes('overloaded') ||
  err.message?.includes('high demand') ||
  err.message?.includes('Service Unavailable');

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Sends a message to the Gemini chatbot with full conversation history.
 * Automatically retries with fallback models on 503 overload errors.
 *
 * @param {string} prompt - The user's message.
 * @param {string} language - Current UI language code (e.g. 'en', 'ta').
 * @param {Array<{role: string, parts: Array<{text: string}>}>} history - Prior conversation turns.
 * @param {string} [systemInstruction=''] - Optional system prompt for AI persona.
 * @param {number} [retries=3] - Number of retries for transient errors.
 * @returns {Promise<string>} The AI's response text.
 * @throws {APIError} If all models fail or the service is unavailable.
 * @throws {RateLimitError} If the API rate limit is exceeded.
 * @throws {NetworkError} If a network-level error occurs.
 */
export const sendMessage = async (
  prompt,
  language,
  history = [],
  systemInstruction = '',
  retries = 3
) => {
  if (!rateLimiter.isAllowed()) {
    throw new Error(
      'Rate limit exceeded. Please wait a moment before asking another question.'
    );
  }

  if (!prompt || !prompt.trim()) throw new Error('Prompt cannot be empty');

  if (!genAI) {
    throw new APIError(
      'AI Service not initialized. Please check your API key.'
    );
  }

  // Gemini requires history to start with a 'user' message —
  // strip any leading model turns from the welcome message.
  const formattedHistory = history
    .map((msg) => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.parts[0].text }],
    }))
    .reduce((acc, msg) => {
      if (acc.length === 0 && msg.role !== 'user') return acc;
      return [...acc, msg];
    }, []);

  let lastError;

  for (const modelName of CHAT_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemInstruction
          ? { role: 'system', parts: [{ text: systemInstruction }] }
          : undefined,
      });

      const chat = model.startChat({ history: formattedHistory });
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      lastError = error;
      // eslint-disable-next-line no-console
      console.warn(`Gemini SDK Error [${modelName}]:`, error.message);

      if (
        isOverloaded(error) &&
        modelName !== CHAT_MODELS[CHAT_MODELS.length - 1]
      ) {
        // eslint-disable-next-line no-console
        console.warn(`${modelName} overloaded — trying next model…`);
        continue;
      }

      if (
        retries > 0 &&
        (error.message?.includes('500') || error.message?.includes('fetch'))
      ) {
        await new Promise((r) => setTimeout(r, 1000));
        return sendMessage(
          prompt,
          language,
          history,
          systemInstruction,
          retries - 1
        );
      }

      if (error.message?.includes('429')) {
        throw new RateLimitError('Rate limit exceeded. Please wait a moment.');
      }
      if (error.message?.includes('Network')) {
        throw new NetworkError('Please check your internet connection.');
      }

      throw new APIError(error.message || 'Failed to communicate with AI');
    }
  }

  throw new APIError(
    'All AI models are currently busy. Please try again in a minute.'
  );
};

/**
 * Analyses a text snippet for election-related misinformation using Gemini AI.
 * Tries multiple models automatically if primary is overloaded.
 *
 * @param {string} text - The news text or message to analyse.
 * @returns {Promise<{score: number, verdict: string, reasoning: string}>}
 *   score: 0 (fake) – 100 (safe), verdict: 'SAFE' | 'SUSPICIOUS' | 'FAKE'.
 * @throws {APIError} If the service is unavailable.
 * @throws {Error} If the input is too short.
 */
export const detectFakeNewsCloud = async (text) => {
  if (!rateLimiter.isAllowed()) {
    throw new Error(
      'Rate limit exceeded. Please wait a moment before asking another question.'
    );
  }

  if (!text || text.length < 10) {
    throw new Error('Content too short for analysis');
  }

  if (!genAI) {
    throw new APIError(
      'Security analysis service unavailable. Check your API key.'
    );
  }

  const prompt = `You are a fact-checking AI for Indian elections. Analyse the following text for misinformation.

Return ONLY a valid JSON object with NO markdown, NO backticks, NO extra text — just raw JSON:
{
  "score": <number 0-100 where 0=completely fake, 100=completely safe>,
  "verdict": "<SAFE, SUSPICIOUS, or FAKE>",
  "reasoning": "<one sentence explanation>"
}

Text to analyse: "${text}"`;

  for (const modelName of ANALYSIS_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;

      let analysisText = response.text().trim();
      analysisText = analysisText.replace(/```json|```/g, '').trim();

      return JSON.parse(analysisText);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(`Fake News Analysis Failed [${modelName}]:`, error.message);

      if (
        isOverloaded(error) &&
        modelName !== ANALYSIS_MODELS[ANALYSIS_MODELS.length - 1]
      ) {
        // eslint-disable-next-line no-console
        console.warn(`${modelName} overloaded — trying next model…`);
        continue;
      }

      if (error instanceof SyntaxError) {
        return {
          score: 50,
          verdict: 'SUSPICIOUS',
          reasoning:
            'Could not complete full analysis. Please verify with official ECI sources.',
        };
      }
    }
  }

  // Final safety net — never crash the UI
  return {
    score: 50,
    verdict: 'SUSPICIOUS',
    reasoning:
      'AI models are currently busy. Please try again and verify with eci.gov.in.',
  };
};
