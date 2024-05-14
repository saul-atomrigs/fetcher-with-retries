import axios from 'axios';

let attemptCounter = 0;

type OptionsProps = {
  url: string;
  retries: number;
  delay: number;
};

/**
 * The linear backoff strategy increases the delay between retries by a fixed increment,
 * providing a balanced approach to managing retry intervals and allowing the system
 * some time to recover before the next attempt.
 */
const fetchData = async ({ url, retries, delay }: OptionsProps) => {
  try {
    attemptCounter++;
    if (attemptCounter <= 2) {
      throw new Error('network failure!');
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchData({ url, retries: retries - 1, delay: delay * 2 });
    } else {
      throw new Error('All retries have failed');
    }
  }
};

const url = 'https://jsonplaceholder.typicode.com/posts/1';

fetchData({ url, retries: 3, delay: 1000 }).catch(console.error);
