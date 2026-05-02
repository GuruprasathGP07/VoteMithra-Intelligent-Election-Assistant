import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Firebase before importing analytics
vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(() => ({})),
  logEvent: vi.fn(),
  isSupported: vi.fn(() => Promise.resolve(true)),
}));

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
  getApps: vi.fn(() => []),
  getApp: vi.fn(() => ({})),
}));

import { logEvent as firebaseLogEvent } from 'firebase/analytics';
import {
  logCustomEvent,
  logQuizStarted,
  logQuizCompleted,
  logEVMVoteCast,
  logChatbotQuery,
  logFakeNewsCheck,
  logBoothSearch,
  logEligibilityChecked,
  logLanguageSwitched,
  logTimelineViewed,
  logVoteEvent,
  logFakeNewsEvent,
  logQuizEvent,
} from '../utils/analytics';

describe('Analytics Tracking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('logCustomEvent handles missing eventName', () => {
    logCustomEvent('');
    logCustomEvent(null);
    // Should not throw
    expect(true).toBe(true);
  });

  it('logQuizStarted logs correctly', () => {
    logQuizStarted('TestUser');
    expect(firebaseLogEvent).toHaveBeenCalled();
  });

  it('logQuizCompleted logs correctly', () => {
    logQuizCompleted('TestUser', 9);
    expect(firebaseLogEvent).toHaveBeenCalled();
  });

  it('logEVMVoteCast logs correctly', () => {
    logEVMVoteCast(1, 'en');
    expect(firebaseLogEvent).toHaveBeenCalled();
  });

  it('logChatbotQuery logs correctly', () => {
    logChatbotQuery('ta');
    expect(firebaseLogEvent).toHaveBeenCalled();
  });

  it('logFakeNewsCheck logs correctly', () => {
    logFakeNewsCheck(100);
    expect(firebaseLogEvent).toHaveBeenCalled();
  });

  it('logBoothSearch logs correctly', () => {
    logBoothSearch('Chennai');
    expect(firebaseLogEvent).toHaveBeenCalled();
  });

  it('logEligibilityChecked logs correctly', () => {
    logEligibilityChecked(true);
    expect(firebaseLogEvent).toHaveBeenCalled();
  });

  it('logLanguageSwitched logs correctly', () => {
    logLanguageSwitched('en', 'ta');
    expect(firebaseLogEvent).toHaveBeenCalled();
  });

  it('logTimelineViewed logs correctly', () => {
    logTimelineViewed();
    expect(firebaseLogEvent).toHaveBeenCalled();
  });

  it('aliases work correctly', () => {
    logVoteEvent(2, 'hi');
    expect(firebaseLogEvent).toHaveBeenCalled();
    vi.clearAllMocks();
    logFakeNewsEvent(50);
    expect(firebaseLogEvent).toHaveBeenCalled();
  });

  it('logQuizEvent alias routes correctly', () => {
    logQuizEvent('started');
    expect(firebaseLogEvent).toHaveBeenCalled();
    vi.clearAllMocks();
    logQuizEvent('completed', 9);
    expect(firebaseLogEvent).toHaveBeenCalled();
  });
});