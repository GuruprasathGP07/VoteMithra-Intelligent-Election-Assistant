import { logger } from './logger';

/**
 * Validates that all required environment variables are present.
 * Runs once on app startup and warns in development.
 */

const REQUIRED_ENV_VARS = [
  'VITE_GEMINI_API_KEY',
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_MAPS_API_KEY',
];

/**
 * Checks all required environment variables on startup.
 * @returns {{ valid: boolean, missing: string[], isDemoMode: boolean }}
 */
export const validateEnv = () => {
  const missing = REQUIRED_ENV_VARS.filter((key) => {
    const value = import.meta.env[key];
    return (
      !value ||
      value.includes('YOUR_') ||
      value === 'undefined'
    );
  });

  if (missing.length > 0 && import.meta.env.DEV) {
    logger.warn(
      '[VoteMithra] Missing environment variables:',
      missing.join(', ')
    );
  }

  return {
    valid: missing.length === 0,
    missing,
    isDemoMode: missing.length > 0,
  };
};

export const ENV_STATUS = validateEnv();
