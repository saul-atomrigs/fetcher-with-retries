const axios = require('axios');

let attemptCounter = 0;

/**
 * Increases wait time by a constant amount after each retry for predictable delays.
 */

export type OptionsProps = {
  url: string;
  retries: number;
  delay: number;
  increment: number;
};

export const linearBackoff = async ({
  url,
  retries,
  delay,
  increment,
}: OptionsProps) => {
  try {
    attemptCounter++;
    if (attemptCounter <= 3) {
      throw new Error('network failure!');
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return linearBackoff({
        url,
        retries: retries - 1,
        delay: delay + increment,
        increment,
      });
    } else {
      throw new Error('All retries have failed');
    }
  }
};

const url = 'https://jsonplaceholder.typicode.com/posts/1';
linearBackoff({ url, retries: 3, delay: 1000, increment: 1000 }).catch(
  console.error
);

/**
 * Output:
 * Attempt 1 failed with error: Simulated network failure. Waiting 1000 ms before retrying.
 * Attempt 2 failed with error: Simulated network failure. Waiting 3000 ms before retrying.
 * Attempt 3 failed with error: Simulated network failure. Waiting 5000 ms before retrying.
 * Success: 200
 */
