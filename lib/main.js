import findTargets from './findTargets';
import findWebmentionEndpoint from './findWebmentionEndpoint';
import sendWebmention from './sendWebmention';

const TEST_URLS = [
  // five links, one with WM endpoint in <head>
  'https://keithjgrant.com/posts/2018/06/resilient-declarative-contextual/',
  // reply to page with WM endpoint in link header
  'https://keithjgrant.com/replies/2018/09/testing-some-webmention-endpoint-discovery',
];

async function sendWebmentions(sourceUrl) {
  const targetUrls = await findTargets(sourceUrl);
  targetUrls.forEach(async targetUrl => {
    const endpoint = await findWebmentionEndpoint(targetUrl);
    if (!endpoint) {
      return;
    }
    sendWebmention(sourceUrl, targetUrl, endpoint);
  });
}

sendWebmentions(TEST_URLS[1]);
