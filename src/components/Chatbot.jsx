import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { sendMessage } from '../utils/gemini';
import { sanitizeInput } from '../utils/sanitize';
import {
  isFirebaseConfigured,
  db,
  ref,
  push,
} from '../services/firebaseService';
import { logChatbotQuery } from '../utils/analytics';

/**
 * Chatbot component providing AI-powered voter assistance.
 * Features: Multilingual support, sanitization, and session logging.
 */
const Chatbot = ({
  language: propLanguage,
  userId,
  isOpen: propIsOpen,
  onClose,
}) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(propIsOpen || false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'model', parts: [{ text: t('chatbot.welcome') }] },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  const activeLanguage = propLanguage || i18n.language;

  // Suggested questions for first-time users
  const starterChips = [
    t('chatbot.chip_register'),
    t('chatbot.chip_nota'),
    t('chatbot.chip_evm'),
    t('chatbot.chip_cvigil'),
  ];

  /**
   * Maps language codes to full names for AI context.
   */
  const getLanguageName = (code) => {
    const langs = {
      en: 'English',
      ta: 'Tamil',
      hi: 'Hindi',
      te: 'Telugu',
      kn: 'Kannada',
      ml: 'Malayalam',
    };
    return langs[code] || 'English';
  };

  /**
   * Defines AI persona and constraints.
   */
  const systemPrompt = `You are VoteMitra, a friendly and authoritative election assistant for Indian voters. You only answer questions about voting, elections, voter rights, ECI rules, election laws, and civic duties in India. Keep every answer under 5 sentences. Always cite the specific law or ECI rule when relevant. Never discuss political parties by name, never recommend any candidate, never give opinions on election outcomes. If asked about anything unrelated to elections, politely redirect. 
  
  CRITICAL: The user interface is currently set to ${getLanguageName(activeLanguage)}. 
  YOU MUST RESPOND ENTIRELY IN ${getLanguageName(activeLanguage)}. 
  IGNORE the language of any previous messages in this history if they are different. 
  If the user asks a question in a different language, answer it IN ${getLanguageName(activeLanguage)} anyway. 
  Do not explain why you are switching, just switch immediately to ${getLanguageName(activeLanguage)}.`;

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

  // Synchronize welcome message when language changes
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'model') {
      setMessages([{ role: 'model', parts: [{ text: t('chatbot.welcome') }] }]);
    }
  }, [activeLanguage, t]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  /**
   * Main message handler.
   * Performs sanitization, logging, and AI communication.
   */
  const handleSend = async (text = null) => {
    const rawInput = text || input.trim();
    if (!rawInput || isTyping) return;

    // 1. Sanitize user input for security
    const msgText = sanitizeInput(rawInput);
    const newMessages = [
      ...messages,
      { role: 'user', parts: [{ text: msgText }] },
    ];

    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    // 2. Log analytics
    logChatbotQuery(activeLanguage);

    try {
      // 3. Request AI response with system constraints
      const responseText = await sendMessage(
        msgText,
        activeLanguage,
        messages,
        systemPrompt
      );
      const updatedMessages = [
        ...newMessages,
        { role: 'model', parts: [{ text: responseText }] },
      ];
      setMessages(updatedMessages);

      // 4. Persistence (Firebase Realtime DB)
      if (isFirebaseConfigured) {
        push(ref(db, 'chat-sessions'), {
          user: msgText,
          bot: responseText,
          lang: activeLanguage,
          userId: userId || 'anonymous',
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Chatbot Error:', error);
      setMessages([
        ...newMessages,
        {
          role: 'model',
          parts: [
            {
              text:
                t('chatbot.error_message') ||
                'I am currently overloaded. Please try again.',
            },
          ],
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (!nextState && onClose) {
      onClose();
    }
  };

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
          {isTyping && (
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
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-border-gray">
          {/* Quick Suggestions */}
          {messages.length === 1 && !isTyping && (
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
};

Chatbot.propTypes = {
  language: PropTypes.string,
  userId: PropTypes.string,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

Chatbot.defaultProps = {
  language: 'en',
  userId: null,
  isOpen: false,
  onClose: () => {},
};

export default Chatbot;
