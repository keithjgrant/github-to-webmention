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
    const link = $('link[rel="webmention"]');
    if (link.length) {
      return absUrl($(link).prop('href'), url);
    }
    const anchor = $('a[rel="webmention"]');
    if (anchor.length) {
      return absUrl($(anchor).prop('href'), url);
    }
  } catch (error) {
    console.log('Error finding webmention endpoint', error.message);
    return null;
  }
}
