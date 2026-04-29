const { BigQuery } = require('@google-cloud/bigquery');
const bigquery = new BigQuery();

const datasetId = 'election_analytics';
const tableId = 'user_events';

/**
 * Insert anonymous events into BigQuery for deep analysis
 */
exports.insertAnonymousEvent = async (eventName, properties) => {
  try {
    const row = {
      event_name: eventName,
      properties: JSON.stringify(properties),
      timestamp: bigquery.timestamp(new Date()),
    };

    await bigquery
      .dataset(datasetId)
      .table(tableId)
      .insert([row]);
    
    console.log(`Inserted 1 row into BigQuery: ${eventName}`);
  } catch (error) {
    console.error('BigQuery Insertion Error:', error);
    // Non-blocking: don't throw error to avoid crashing the main function
  }
};

/**
 * Note: Ensure the dataset and table exist in GCP Console
 * Schema:
 * [
 *   { name: 'event_name', type: 'STRING', mode: 'REQUIRED' },
 *   { name: 'properties', type: 'STRING', mode: 'NULLABLE' },
 *   { name: 'timestamp', type: 'TIMESTAMP', mode: 'REQUIRED' }
 * ]
 */
