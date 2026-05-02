import {
  getAnalytics,
  logEvent as firebaseLogEvent,
  isSupported,
} from 'firebase/analytics';
import { initializeApp, getApps, getApp } from 'firebase/app';

/**
 * Firebase Configuration loaded from Environment Variables (VITE_ prefix).
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase Instance
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

import { logger } from './logger';

// Analytics instance (handled asynchronously for safety)
let analytics = null;
isSupported()
  .then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  })
  .catch((err) => {
    logger.warn('Analytics not supported or failed to initialize:', err);
  });

/**
 * Universal wrapper for logging analytics events.
 * @param {string} eventName - Name of the event to log
 * @param {Object} [properties={}] - Key-value pairs of metadata
 */
export const logCustomEvent = (eventName, properties = {}) => {
  if (!eventName) return;

  // 1. Firebase Analytics (Standard)
  if (analytics) {
    try {
      firebaseLogEvent(analytics, eventName, {
        ...properties,
        timestamp: new Date().toISOString(),
        platform: 'web',
        environment: import.meta.env.MODE,
      });
    } catch (error) {
      logger.warn(`Analytics Error [${eventName}]:`, error);
    }
  }

  // 2. BigQuery Proxy (Hackathon Extra Point)
  // Provides high-durability logging even if browser blocks standard analytics
  const bqUrl = import.meta.env.VITE_BIGQUERY_LOG_URL;
  if (bqUrl) {
    fetch(bqUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dataset: 'user_events',
        data: {
          event_name: eventName,
          properties: properties,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        },
      }),
    }).catch(() => {
      /* Silent fail for analytics */
    });
  }
};

// --- Preferred Analytics Exports ---

/** Logs when a user starts the knowledge quiz. */
export const logQuizStarted = (userName) =>
  logCustomEvent('quiz_started', { userName });

/** Logs when a user completes the quiz with their final score. */
export const logQuizCompleted = (userName, score) =>
  logCustomEvent('quiz_completed', { userName, score });

/** Logs a mock vote cast in the EVM simulator. */
export const logEVMVoteCast = (candidateId, language) =>
  logCustomEvent('evm_vote_cast', { candidateId, language });

/** Logs a query sent to the AI chatbot. */
export const logChatbotQuery = (language) =>
  logCustomEvent('chatbot_query_sent', { language });

/** Logs when a user uses the fake news scanner. */
export const logFakeNewsCheck = (textLength) =>
  logCustomEvent('fakenews_check_performed', { textLength });

/** Logs a search for polling booths. */
export const logBoothSearch = (district) =>
  logCustomEvent('booth_search_performed', { district });

/** Logs result of eligibility checker. */
export const logEligibilityChecked = (result) =>
  logCustomEvent('eligibility_checked', { eligible: result });

/** Logs when the user switches the app language. */
export const logLanguageSwitched = (from, to) =>
  logCustomEvent('language_switched', { from, to });

/** Logs a view of the election timeline. */
export const logTimelineViewed = () => logCustomEvent('timeline_viewed');

// --- Backward Compatible Aliases ---

/** @deprecated Use logEVMVoteCast */
export const logVoteEvent = logEVMVoteCast;

/** @deprecated Use logFakeNewsCheck */
export const logFakeNewsEvent = logFakeNewsCheck;

/** @deprecated Use logChatbotQuery */
export const logChatEvent = logChatbotQuery;

/** @deprecated Use logEligibilityChecked */
export const logEligibilityCheck = logEligibilityChecked;

/** @deprecated Use logTimelineViewed */
export const logTimelineView = logTimelineViewed;

/** @deprecated Use logLanguageSwitched */
export const logLanguageSwitch = logLanguageSwitched;

/** @deprecated Use logQuizStarted/logQuizCompleted */
export const logQuizEvent = (status, score) => {
  if (status === 'started') logQuizStarted();
  else logQuizCompleted(undefined, score);
};
