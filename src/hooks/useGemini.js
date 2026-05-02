import { useState, useCallback } from 'react';
import { sendMessage } from '../utils/gemini';
import { logChatbotQuery } from '../utils/analytics';
import { useTranslation } from 'react-i18next';

/**
 * @fileoverview Custom hook for Gemini AI chatbot state management.
 * Abstracts loading, error, and message history from UI components.
 * @module hooks/useGemini
 */

/**
 * @typedef {Object} ChatMessage
 * @property {'user'|'model'} role - Message sender role.
 * @property {Array<{text: string}>} parts - Message parts.
 * @property {number} timestamp - Unix timestamp.
 */

/**
 * useGemini — manages AI chat state, loading, and error handling.
 * Extracts all Gemini API logic from the Chatbot UI component.
 * @returns {{
 *   messages: ChatMessage[],
 *   loading: boolean,
 *   error: string|null,
 *   sendQuery: Function,
 *   clearMessages: Function
 * }}
 */
export function useGemini() {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([
    { role: 'model', parts: [{ text: t('chatbot.welcome') }] },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendQuery = useCallback(
    async (userText) => {
      if (!userText.trim()) return;

      const userMessage = {
        role: 'user',
        parts: [{ text: userText }],
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);
      setError(null);

      try {
        logChatbotQuery(i18n.language);
        const response = await sendMessage(
          userText,
          i18n.language,
          messages.slice(0, -1) // Pass history before this message
        );
        setMessages((prev) => [
          ...prev,
          {
            role: 'model',
            parts: [{ text: response }],
            timestamp: Date.now(),
          },
        ]);
      } catch (err) {
        const errorMsg = err.message.includes('Rate limit')
          ? t('chatbot.error_rate_limit') ||
            'Rate limit reached. Please wait a moment.'
          : t('chatbot.error_message') ||
            'Unable to get a response. Please try again.';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [messages, i18n.language, t]
  );

  const clearMessages = useCallback(() => {
    setMessages([{ role: 'model', parts: [{ text: t('chatbot.welcome') }] }]);
    setError(null);
  }, [t]);

  return { messages, loading, error, sendQuery, clearMessages };
}
