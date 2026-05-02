import { useState, useEffect, useRef, memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useGemini } from '../hooks';
import { sanitizeInput } from '../utils/sanitize';
import {
  isFirebaseConfigured,
  db,
  ref,
  push,
} from '../services/firebaseService';
import { logger } from '../utils/logger';

/**
 * Chatbot component providing AI-powered voter assistance.
 * Features: Multilingual support, sanitization, and session logic abstraction via useGemini.
 */
const Chatbot = memo(function Chatbot({
  language: propLanguage = 'en',
  userId = null,
  isOpen: propIsOpen = false,
  onClose = () => {},
}) {
  const { t, i18n } = useTranslation();
  const { messages, loading, error, sendQuery } = useGemini();
  const [isOpen, setIsOpen] = useState(propIsOpen || false);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  const activeLanguage = propLanguage || i18n.language;

  const starterChips = [
    t('chatbot.chip_register'),
    t('chatbot.chip_nota'),
    t('chatbot.chip_evm'),
    t('chatbot.chip_cvigil'),
  ];

  // Handle global events to open chatbot from other components
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-chatbot', handleOpen);
    return () => window.removeEventListener('open-chatbot', handleOpen);
  }, []);

  // Sync propIsOpen to internal state
  useEffect(() => {
    if (propIsOpen !== undefined) {
      setIsOpen(propIsOpen);
    }
  }, [propIsOpen]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = useCallback(
    async (text = null) => {
      const rawInput = text || input.trim();
      if (!rawInput || loading) return;

      const msgText = sanitizeInput(rawInput);
      setInput('');

      try {
        await sendQuery(msgText);

        // Optional: Add to Firebase if bot responds successfully
        // Note: The actual bot response text isn't returned by sendQuery in the provided hook,
        // so we'd need to peek at the last message if we wanted to log it here.
        if (isFirebaseConfigured) {
          push(ref(db, 'chat-sessions'), {
            user: msgText,
            lang: activeLanguage,
            userId: userId || 'anonymous',
            timestamp: Date.now(),
          });
        }
      } catch (err) {
        logger.error('Chatbot Persistence Error:', err);
      }
    },
    [input, loading, sendQuery, activeLanguage, userId]
  );

  const handleToggle = useCallback(() => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (!nextState && onClose) {
      onClose();
    }
  }, [isOpen, onClose]);

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        className="fixed bottom-20 right-6 w-14 h-14 bg-saffron text-blue-main rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(244,145,31,0.5)] z-[998] hover:scale-110 active:scale-90 transition-transform border-2 border-white"
        onClick={handleToggle}
        aria-label={
          isOpen ? 'Close Chatbot' : 'Open AI Voter Coach chat assistant'
        }
      >
        <span className="material-icons text-2xl" aria-hidden="true">
          {isOpen ? 'close' : 'smart_toy'}
        </span>
      </button>

      {/* Main Chat Interface */}
      <div
        data-testid="chatbot"
        className={`fixed bottom-[145px] right-6 w-[340px] h-[calc(100vh-220px)] max-h-[520px] bg-white rounded-2xl rounded-br-none shadow-2xl z-[998] flex flex-col overflow-hidden transition-all duration-300 scale-100 origin-bottom-right ${
          isOpen ? 'opacity-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
        role="dialog"
        aria-label="Voter Assistant Chat"
      >
        {/* Header */}
        <div className="bg-saffron p-4 flex items-center gap-3 text-blue-main border-bottom-2 border-white/20">
          <div className="w-9 h-9 bg-blue-main/10 rounded-full flex items-center justify-center">
            <span className="material-icons text-xl" aria-hidden="true">
              smart_toy
            </span>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold font-dm-sans leading-none">
              {t('chatbot.title')}
            </h4>
            <p className="text-[10px] opacity-80 mt-1">
              {t('chatbot.subtitle')}
            </p>
          </div>
          <button onClick={handleToggle} aria-label="Close chat">
            <span className="material-icons text-lg" aria-hidden="true">
              close
            </span>
          </button>
        </div>

        {/* Message History */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-bg-main/30"
          ref={scrollRef}
          aria-live="polite"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 text-[13px] rounded-2xl shadow-sm ${
                  m.role === 'user'
                    ? 'bg-blue-main text-white rounded-br-none'
                    : 'bg-blue-pale text-ink rounded-bl-none'
                }`}
              >
                {m.parts[0].text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div
                className="bg-blue-pale p-3 rounded-2xl rounded-bl-none flex gap-1"
                data-testid="loading-spinner"
              >
                <div className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          {error && (
            <div className="flex justify-center p-2">
              <div className="text-[11px] text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                {error}
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-border-gray">
          {/* Quick Suggestions */}
          {messages.length === 1 && !loading && (
            <div className="flex flex-wrap gap-2 mb-3" role="list">
              {starterChips.map((chip) => (
                <button
                  key={chip}
                  role="listitem"
                  className="text-[11px] bg-border-gray px-3 py-1 rounded-full hover:bg-saffron hover:text-blue-main transition-colors font-medium"
                  onClick={() => handleSend(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 border border-border-gray rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-main focus:ring-1 focus:ring-blue-main"
              placeholder={t('chatbot.placeholder')}
              aria-label="Type your election question"
              maxLength={500}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              className="bg-blue-main text-white w-10 h-10 rounded-md flex items-center justify-center hover:brightness-110 active:scale-95 transition-all shadow-md"
              onClick={() => handleSend()}
              aria-label="Send message"
            >
              <span className="material-icons text-lg" aria-hidden="true">
                send
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
});

Chatbot.propTypes = {
  language: PropTypes.string,
  userId: PropTypes.string,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default Chatbot;
