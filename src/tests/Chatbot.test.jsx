import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('../utils/gemini', () => ({
  askGemini: vi.fn().mockResolvedValue('Mock response'),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInAnonymously: vi.fn().mockResolvedValue({}),
  onAuthStateChanged: vi.fn(() => () => {}),
}));

vi.mock('firebase/database', () => ({
  getDatabase: vi.fn(),
  ref: vi.fn(),
  push: vi.fn().mockResolvedValue({}),
  onValue: vi.fn(() => () => {}),
}));

describe('Chatbot Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('chatbot module exists', { timeout: 10000 }, async () => {
    const mod = await import('../components/Chatbot');
    expect(mod.default).toBeDefined();
  });

  it('chatbot renders without crash', { timeout: 10000 }, async () => {
    const { default: Chatbot } = await import('../components/Chatbot');
    const { container } = render(<Chatbot language="en" />);
    expect(container).toBeTruthy();
  });
});
