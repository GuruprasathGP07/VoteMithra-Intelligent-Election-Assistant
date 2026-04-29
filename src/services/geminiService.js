const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const callGeminiAPI = async (promptText, systemInstruction) => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
    throw new Error("API Key missing");
  }

  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  const body = {
    contents: [{ role: "user", parts: [{ text: `SYSTEM INSTRUCTION: ${systemInstruction}\n\nUSER PROMPT: ${promptText}` }] }],
    generationConfig: { temperature: 0.2 }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    if (data.error) {
      console.error("Gemini API Error:", data.error);
      throw new Error(data.error.message);
    }
    return data.candidates[0].content.parts[0].text;
  } catch (err) {
    console.error("Gemini Service Error:", err);
    throw err;
  }
};

export const chatWithGemini = async (chatHistory, systemInstruction) => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
    throw new Error("API Key missing");
  }

  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  // Prepend system instruction to the first user message or as a separate user message if history exists
  const modifiedHistory = [
    { role: "user", parts: [{ text: `[SYSTEM CONTEXT: ${systemInstruction}]` }] },
    ...chatHistory
  ];

  const body = {
    contents: modifiedHistory,
    generationConfig: { temperature: 0.7 }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    if (data.error) {
      console.error("Gemini Chat Error:", data.error);
      throw new Error(data.error.message);
    }
    return data.candidates[0].content.parts[0].text;
  } catch (err) {
    console.error("Gemini Chat connectivity problem:", err);
    throw err;
  }
};
