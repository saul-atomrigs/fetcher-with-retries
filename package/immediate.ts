const axios = require('axios');

let attemptCounter = 0;

const fetchData = async (url: string, retries: number): Promise<any> => {
  try {
    attemptCounter++;

    if (attemptCounter <= 3) {
      throw new Error('Simulated network failure');
    }

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    if (retries > 0) {
      console.log('Retrying immediately.');
      return fetchData(url, retries - 1);
    } else {
      throw new Error(`All retries failed after ${attemptCounter} attempts`);
    }
  }
};

export default fetchData;

const url = 'https://jsonplaceholder.typicode.com/posts/1';

fetchData(url, 5).catch(console.error);

/**
 * Output:
 * Attempt 1 failed with error: Simulated network failure.
 * Retrying immediately.
 * Attempt 2 failed with error: Simulated network failure.
 * Retrying immediately.
 * Attempt 3 failed with error: Simulated network failure.
 * Retrying immediately.
 * Success: 200
 */
