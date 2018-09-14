import findTargets from './findTargets';
import findWebmentionEndpoint from './findWebmentionEndpoint';
import sendWebmention from './sendWebmention';

const {RETRY_DELAY_SECONDS, MAX_RETRIES} = process.env;
const RETRY_DELAY = RETRY_DELAY_SECONDS * 1000;

async function sendWebmentions(sourceUrl, targetUrls) {
  const promises = [];
  targetUrls.forEach(async targetUrl => {
    let endpoint;
    try {
      endpoint = await findWebmentionEndpoint(targetUrl);
    } catch (err) {
      return;
    }
    if (endpoint) {
      console.log(`Webmention endpoint found for ${targetUrl}: ${endpoint}`);
      promises.push(sendWebmention(sourceUrl, targetUrl, endpoint));
    }
  });
  return Promise.all(promises);
}

export default async function processPage(url, count = 0) {
  let targetUrls;
  try {
    targetUrls = await findTargets(url);
  } catch (err) {
    if (count < MAX_RETRIES) {
      setTimeout(processPage.bind(null, url, count + 1), RETRY_DELAY);
      return false;
    }
    console.log(`${url}: max retries exceeded. Abandoning.`);
    throw Error(`Unable to process page: ${url}`);
  }
  return sendWebmentions(url, targetUrls);
}
