import axios from 'axios';
import parseLinkHeader from 'parse-link-header';
import cheerio from 'cheerio';
import {absUrl} from './util';

export default async function findWebmentionEndpoint(url) {
  try {
    const response = await axios.get(url);
    if (response.headers.link) {
      const headers = parseLinkHeader(response.headers.link);
      if (headers.webmention) {
        return absUrl(headers.webmention.url, url);
      }
    }
    const pageContent = await response.data;
    const $ = cheerio.load(pageContent);
    const link = $('link[rel~="webmention"][href], a[rel~="webmention"][href]');
    if (link.length) {
      return absUrl($(link).prop('href'), url);
    }
  } catch (error) {
    console.log('Error finding webmention endpoint', error.message);
    return null;
  }
}
