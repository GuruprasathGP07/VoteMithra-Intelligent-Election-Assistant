/**
 * Application-wide constants for VoteMithra.
 * Import from here instead of using magic strings/numbers inline.
 */

/** Supported language codes with display names */
export const SUPPORTED_LANGUAGES = [
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
export const CHATBOT_MAX_LENGTH = 500;

/** Maximum characters allowed in fake news analysis textarea */
export const FAKE_NEWS_MAX_LENGTH = 2000;

/** Gemini API rate limit: max calls per window */
export const RATE_LIMIT_MAX_CALLS = 10;

/** Gemini API rate limit: window in milliseconds */
export const RATE_LIMIT_WINDOW_MS = 60000;

/** Quiz scoring: points per correct answer */
export const QUIZ_POINTS_PER_CORRECT = 10;

/** Application routes */
export const ROUTES = {
  HOME: '/',
  CHATBOT: '/chatbot',
  EVM: '/evm-simulator',
  FAKE_NEWS: '/fake-news',
  LOCATOR: '/locator',
  QUIZ: '/quiz',
  ELIGIBILITY: '/eligibility',
  TIMELINE: '/timeline',
  SIMULATOR: '/election-simulator',
  PROFILE: '/profile',
};

/** Firebase collection names */
export const COLLECTIONS = {
  USERS: 'users',
  QUIZ_RESULTS: 'quizResults',
  CHECKLISTS: 'checklists',
  MISINFORMATION: 'misinformationReports',
};
