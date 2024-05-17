import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 3 });

const url = 'https://jsonplaceholder.typicode.com/posts/1';

axios
  .get(url)
  .then((res) => console.log(res.data)) // 'ok'
  .catch((e) => console.error(e));
