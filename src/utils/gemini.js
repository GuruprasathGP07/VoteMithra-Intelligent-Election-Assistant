import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Custom Error classes for professional error handling and categorization.
 */
export class NetworkError extends Error { constructor(message) { super(message); this.name = "NetworkError"; } }
export class RateLimitError extends Error { constructor(message) { super(message); this.name = "RateLimitError"; } }
export class APIError extends Error { constructor(message) { super(message); this.name = "APIError"; } }

// Initialize Gemini AI with Environment Variable
let genAI;
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

try {
  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY") {
    console.warn("Gemini API key is missing or placeholder. Client-side AI features will be limited.");
  } else {
    genAI = new GoogleGenerativeAI(apiKey);
  }
} catch (error) {
  console.error("Failed to initialize Gemini AI:", error);
}

// ✅ Model fallback chain — if top model is overloaded, tries next
const CHAT_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-lite"];
const ANALYSIS_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-lite"];

const isOverloaded = (err) =>
  err.message?.includes('503') ||
  err.message?.includes('overloaded') ||
  err.message?.includes('high demand') ||
  err.message?.includes('Service Unavailable');

/**
 * Core function to interact with Gemini AI chatbot.
 * Tries multiple models if primary is overloaded.
 */
export const sendMessage = async (prompt, language, history = [], systemInstruction = "", retries = 3) => {
  if (!prompt || !prompt.trim()) throw new Error("Prompt cannot be empty");

  if (!genAI) {
    throw new APIError("AI Service not initialized. Please check your API key.");
  }

  // ✅ FIXED: Gemini requires history to start with a 'user' message.
  // Strip all leading model messages before passing history to the API.
  const formattedHistory = history
    .map(msg => ({
      role: msg.role === "model" ? "model" : "user",
      parts: [{ text: msg.parts[0].text }],
    }))
    .reduce((acc, msg) => {
      if (acc.length === 0 && msg.role !== "user") return acc;
      return [...acc, msg];
    }, []);

  let lastError;

  for (const modelName of CHAT_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemInstruction
          ? { role: "system", parts: [{ text: systemInstruction }] }
          : undefined
      });

      const chat = model.startChat({ history: formattedHistory });
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      return response.text();

    } catch (error) {
      lastError = error;
      console.warn(`Gemini SDK Error [${modelName}]:`, error.message);

      // If overloaded, try next model in chain
      if (isOverloaded(error) && modelName !== CHAT_MODELS[CHAT_MODELS.length - 1]) {
        console.warn(`${modelName} overloaded — trying next model...`);
        continue;
      }

      // Retry logic for transient errors
      if (retries > 0 && (
        error.message?.includes('500') ||
        error.message?.includes('fetch')
      )) {
        await new Promise(r => setTimeout(r, 1000));
        return sendMessage(prompt, language, history, systemInstruction, retries - 1);
      }

      if (error.message?.includes('429')) throw new RateLimitError("Rate limit exceeded. Please wait a moment.");
      if (error.message?.includes('Network')) throw new NetworkError("Please check your internet connection.");

      throw new APIError(error.message || "Failed to communicate with AI");
    }
  }

  throw new APIError("All AI models are currently busy. Please try again in a minute.");
};

/**
 * Fake News Detection — tries multiple models with fallback.
 */
export const detectFakeNewsCloud = async (text) => {
  if (!text || text.length < 10) throw new Error("Content too short for analysis");

  if (!genAI) throw new APIError("Security analysis service unavailable. Check your API key.");

  const prompt = `You are a fact-checking AI for Indian elections. Analyze the following text for misinformation.

Return ONLY a valid JSON object with NO markdown, NO backticks, NO extra text — just raw JSON:
{
  "score": <number 0-100 where 0=completely fake, 100=completely safe>,
  "verdict": "<SAFE, SUSPICIOUS, or FAKE>",
  "reasoning": "<one sentence explanation>"
}

Text to analyze: "${text}"`;

  for (const modelName of ANALYSIS_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;

      let analysisText = response.text().trim();
      // Strip any accidental markdown backticks
      analysisText = analysisText.replace(/```json|```/g, "").trim();

      return JSON.parse(analysisText);

    } catch (error) {
      console.warn(`Fake News Analysis Failed [${modelName}]:`, error.message);

      // If overloaded, try next model
      if (isOverloaded(error) && modelName !== ANALYSIS_MODELS[ANALYSIS_MODELS.length - 1]) {
        console.warn(`${modelName} overloaded — trying next model...`);
        continue;
      }

      // JSON parse error — return graceful fallback
      if (error instanceof SyntaxError) {
        return {
          score: 50,
          verdict: "SUSPICIOUS",
          reasoning: "Could not complete full analysis. Please verify this information from official ECI sources."
        };
      }
    }
  }

  // Final safety net — never crash, always return something useful
  return {
    score: 50,
    verdict: "SUSPICIOUS",
    reasoning: "AI models are currently busy. Please try again in a moment and verify with eci.gov.in."
  };
};
