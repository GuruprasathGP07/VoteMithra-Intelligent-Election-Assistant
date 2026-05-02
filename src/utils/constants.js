/**
 * Application-wide constants for VoteMithra.
 * Import from here instead of using magic strings/numbers inline.
 */

/** Supported language codes */
export const SUPPORTED_LANGUAGES = ['en', 'hi', 'ta', 'te', 'kn', 'ml'];

/** Detailed language information for UI switchers */
export const LANGUAGE_DETAILS = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം' },
];

/** Minimum voter age in India per Representation of the People Act */
export const MINIMUM_VOTER_AGE = 18;

/** Maximum characters allowed in chatbot input */
export const MAX_MESSAGE_LENGTH = 500;

/** Gemini API Model Configs */
export const GEMINI_MODEL_PRIMARY = 'gemini-2.5-flash';
export const GEMINI_MODEL_FALLBACK_1 = 'gemini-2.0-flash';
export const GEMINI_MODEL_FALLBACK_2 = 'gemini-2.0-flash-lite';

/** Firebase collection names */
export const FIREBASE_COLLECTIONS = {
  CHAT_SESSIONS: 'chat-sessions',
  QUIZ_LEADERBOARD: 'quiz-leaderboard',
  MISINFORMATION_WALL: 'misinformation-wall',
};

/** Legacy collection names (kept for compatibility during migration if needed) */
export const COLLECTIONS = {
  USERS: 'users',
  QUIZ_RESULTS: 'quizResults',
  CHECKLISTS: 'checklists',
  MISINFORMATION: 'misinformationReports',
};

/** Application routes */
export const ROUTES = {
  HOME: '/',
  EVM: '/evm',
  FAKENEWS: '/fake-news',
  QUIZ: '/quiz',
  LOCATOR: '/locator',
  ELIGIBILITY: '/eligibility',
  TIMELINE: '/timeline',
  LAWS: '/laws',
  EMERGENCY: '/emergency',
  // Keep original paths for mapping if necessary
  SIMULATOR: '/election-simulator',
  NOMINATION: '/nomination',
  FAQ: '/faq',
  GUIDE: '/guide',
  CANDIDATES: '/candidates',
};

/** Gemini API rate limits */
export const RATE_LIMIT_MAX_CALLS = 10;
export const RATE_LIMIT_WINDOW_MS = 60000;
