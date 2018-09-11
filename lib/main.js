import findTargets from './find-targets';

const url =
  'https://keithjgrant.com/posts/2018/06/resilient-declarative-contextual/';

function sendWebmentions(sourceUrl) {
  const targetUrs = findTargets(url);
}

sendWebmentions(url);
