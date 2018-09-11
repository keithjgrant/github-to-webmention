import axios from 'axios';
import parseLinkHeader from 'parse-link-header';

export default async function findWebmentionEndpoint(url) {
  try {
    const response = await axios.get(url);
    if (response.headers.link) {
      const headers = parseLinkHeader(response.headers.link);
      console.log(response.headers.link);
      console.log(headers);
      if (headers.webmention) {
        console.log(headers.webmention.url);
      }
    }
    const pageContent = await response.data;
  } catch (error) {
    console.log('Error finding webmention endpoint', error.message);
    return '';
  }
}
