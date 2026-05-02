import { logger } from '../utils/logger';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

/**
 * Sends a single prompt to Gemini AI with system context.
 * @param {string} promptText - The user's input question or text
 * @param {string} systemInstruction - Contextual rules and persona instructions
 * @returns {Promise<string>} The AI-generated response text
 * @throws {Error} If API key is missing or request fails
 */
export const callGeminiAPI = async (promptText, systemInstruction) => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
    throw new Error('API Key missing');
  }

  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  const body = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `SYSTEM INSTRUCTION: ${systemInstruction}\n\nUSER PROMPT: ${promptText}`,
          },
        ],
      },
    ],
    generationConfig: { temperature: 0.2 },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (data.error) {
      logger.error('Gemini API Error:', data.error);
      throw new Error(data.error.message);
    }
    return data.candidates[0].content.parts[0].text;
  } catch (err) {
    logger.error('Gemini Service Error:', err);
    throw err;
  }
};

/**
 * Manages a multi-turn conversation with Gemini AI.
 * @param {Array<{role: string, parts: Array}>} chatHistory - Array of previous messages
 * @param {string} systemInstruction - Persona constraints and language rules
 * @returns {Promise<string>} The next AI response in the conversation
 * @throws {Error} If API request fails
 */
export const chatWithGemini = async (chatHistory, systemInstruction) => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
    throw new Error('API Key missing');
  }

  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  // Prepend system instruction to the first user message or as a separate user message if history exists
  const modifiedHistory = [
    {
      role: 'user',
      parts: [{ text: `[SYSTEM CONTEXT: ${systemInstruction}]` }],
    },
    ...chatHistory,
  ];

  const body = {
    contents: modifiedHistory,
    generationConfig: { temperature: 0.7 },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (data.error) {
      logger.error('Gemini Chat Error:', data.error);
      throw new Error(data.error.message);
    }
    return data.candidates[0].content.parts[0].text;
  } catch (err) {
    logger.error('Gemini Chat connectivity problem:', err);
    throw err;
  }
};
