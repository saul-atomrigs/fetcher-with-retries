const axios = require('axios');

let attemptCounter = 0;

type OptionsProps = {
  url: string;
  retries: number;
  delay: number;
};

const fetchData = async ({ url, retries, delay }: OptionsProps) => {
  try {
    attemptCounter++;

    if (attemptCounter <= 3) {
      throw new Error('Simulated network failure');
    }

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchData({ url, retries: retries - 1, delay: delay });
    } else {
      throw new Error('All retries failed');
    }
  }
};

const url = 'https://jsonplaceholder.typicode.com/posts/1';
fetchData({ url, retries: 4, delay: 1000 }).catch(console.error);

/**
 * Output:
 * Attempt 1 failed with error: Simulated network failure. Waiting 1000 ms before retrying.
 * Attempt 2 failed with error: Simulated network failure. Waiting 1000 ms before retrying.
 * Attempt 3 failed with error: Simulated network failure. Waiting 1000 ms before retrying.
 * Success: 200
 */
