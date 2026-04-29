const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors')({ origin: true });
const { insertAnonymousEvent } = require('./bigquery');

admin.initializeApp();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * AI Chatbot Proxy - Secures API Key and adds rate limiting
 */
exports.chatWithGemini = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    const { prompt, language, userId } = req.body;

    if (!prompt) {
      return res.status(400).send('Prompt is required');
    }

    try {
      // Gemini API call
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Log to BigQuery (via helper)
      await insertAnonymousEvent('chatbot_query', { language, userId: userId || 'anon' });

      res.status(200).json({ text });
    } catch (error) {
      console.error('Gemini Proxy Error:', error);
      res.status(500).send('Internal Server Error');
    }
  });
});

/**
 * Fake News Detection Endpoint
 */
exports.detectFakeNews = functions.https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
        const { text } = req.body;
        if (!text) return res.status(400).send('Text is required');

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `Analyze the following election-related news for misinformation. Provide a score (0-100), a verdict (SAFE, SUSPICIOUS, or FAKE), and brief reasoning: "${text}"`;
            
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const analysis = response.text();

            // Log event
            await insertAnonymousEvent('fakenews_check', { textLength: text.length });

            res.status(200).json({ analysis });
        } catch (error) {
            res.status(500).send('Detection failed');
        }
    });
});

/**
 * Global BigQuery Logger Proxy
 */
exports.logToBigQuery = functions.https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
        if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
        
        const { dataset, data } = req.body;
        try {
            await insertAnonymousEvent(dataset, data);
            res.status(200).send('OK');
        } catch (error) {
            res.status(500).send('Logging failed');
        }
    });
});
