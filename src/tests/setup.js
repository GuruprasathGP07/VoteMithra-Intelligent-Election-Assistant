import '@testing-library/jest-dom';
import { vi } from 'vitest';

// ── i18n Mock ──────────────────────────────────────────────────────────────────
export const changeLanguageMock = vi.fn().mockImplementation(() => Promise.resolve());
export const tMock = vi.fn().mockImplementation((key) => key);

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: tMock,
    i18n: {
      changeLanguage: changeLanguageMock,
      language: 'en',
      exists: vi.fn().mockReturnValue(true),
    },
  }),
  initReactI18next: { type: '3rdParty', init: vi.fn() },
  Trans: ({ children }) => children,
}));

// ── Firebase Mock ──────────────────────────────────────────────────────────────
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn().mockReturnValue({ name: '[DEFAULT]' }),
  getApps: vi.fn().mockReturnValue([]),
  getApp: vi.fn().mockReturnValue({ name: '[DEFAULT]' }),
}));

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(),
  logEvent: vi.fn(),
  isSupported: vi.fn().mockResolvedValue(false),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
}));

vi.mock('firebase/database', () => ({
  getDatabase: vi.fn(),
  ref: vi.fn(),
  push: vi.fn().mockResolvedValue({ key: 'mock-key' }),
  onValue: vi.fn((ref, callback) => {
    callback({ val: () => [] });
    return vi.fn(); // unsubscribe
  }),
  limitToLast: vi.fn(),
  query: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInAnonymously: vi.fn().mockResolvedValue({ user: { isAnonymous: true } }),
}));

// ── Gemini AI Mock ─────────────────────────────────────────────────────────────
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockImplementation(() => ({
      startChat: vi.fn().mockImplementation(() => ({
        sendMessage: vi.fn().mockResolvedValue({
          response: { text: () => 'Mocked AI response' },
        }),
      })),
      generateContent: vi.fn().mockResolvedValue({
        response: {
          text: () => JSON.stringify({ score: 100, verdict: 'SAFE', reasoning: 'Safe' }),
        },
      }),
    })),
  })),
}));

// ── React Router Mock ─────────────────────────────────────────────────────────
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/' }),
    BrowserRouter: ({ children }) => children,
    Link: ({ children }) => children,
  };
});

// ── Browser API Mocks ─────────────────────────────────────────────────────────
window.scrollTo = vi.fn();
window.alert = vi.fn();
window.matchMedia = vi.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

// Mock scroll properties for Chatbot/EVM
Object.defineProperty(HTMLElement.prototype, 'scrollHeight', { configurable: true, value: 500 });
Object.defineProperty(HTMLElement.prototype, 'scrollTop', { configurable: true, writable: true, value: 0 });
Element.prototype.scrollIntoView = vi.fn();

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = (value || '').toString(); }),
    clear: vi.fn(() => { store = {}; }),
    removeItem: vi.fn((key) => { delete store[key]; }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
Object.defineProperty(window, 'sessionStorage', { value: localStorageMock });

// Global Google Mock
global.google = {
  maps: {
    Map: vi.fn(),
    Marker: vi.fn(),
    InfoWindow: vi.fn(),
    LatLng: vi.fn(),
  },
};

vi.mock('@react-google-maps/api', () => ({
  useJsApiLoader: () => ({ isLoaded: true, loadError: null }),
  GoogleMap: ({ children }) => children,
  Marker: () => null,
}));

// Global fetch mock to prevent network hangs
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({}),
  text: async () => "",
});
