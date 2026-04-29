/**
 * Google BigQuery Analytics Utility
 * Provides advanced telemetry for election insight gathering.
 * This demonstrates integration with Google's enterprise data warehouse.
 */

const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;

/**
 * Logs an anonymous event to BigQuery via a secure Cloud Function proxy.
 * This keeps the data pipeline secure and follows Google's best practices.
 * 
 * @param {string} dataset - The target BigQuery dataset.
 * @param {Object} payload - The event data to be logged.
 */
export const logToBigQuery = async (dataset, payload) => {
  if (!PROJECT_ID) return;

  const endpoint = `https://us-central1-${PROJECT_ID}.cloudfunctions.net/logToBigQuery`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dataset,
        data: {
          ...payload,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          platform: 'web_v1'
        }
      })
    });

    if (!response.ok) {
      console.warn("BigQuery Logging Error:", response.statusText);
    }
  } catch (error) {
    // Fail silently in production to not disrupt UX
    if (import.meta.env.DEV) {
      console.error("Failed to reach BigQuery proxy:", error);
    }
  }
};

/**
 * Specifically logs election-related sentiment or quiz results for demographic insights.
 */
export const logElectionInsight = (type, value) => {
    return logToBigQuery('election_insights', { type, value });
};
