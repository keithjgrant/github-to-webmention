import qs from 'qs';
import axios from 'axios';
import processPage from './processPage';

const {CONTENT_DIRECTORY, WEBSITE_URL} = process.env;

export default function processGitHubCommit(commit) {
  console.log(commit);
  if (!commit.added) {
    return;
  }

  commit.added.map(processFileCommit);
}

export function processFileCommit(fileName) {
  if (!fileName.startsWith(CONTENT_DIRECTORY)) {
    return;
  }
  console.log(`File created: ${fileName}`);
  const url = `${WEBSITE_URL}/${fileName
    .replace(`${CONTENT_DIRECTORY}/`, '')
    .replace(/.md$/, '')}`;
  console.log(`Checking url: ${url}`);
  processPage(url)
    .then(resp => {
      if (resp) {
        console.log(`${url} done processing`);
        pingPuSHServer(url);
      } else {
        console.log(`${url} not found. Waiting to retry...`);
      }
    })
    .catch(err => {
      console.log(`${url} ERROR processing:`);
      console.log(err);
    });
}

async function pingPuSHServer(url) {
  if (!process.env.PUSH_ENDPOINT) {
    console.log('No PUSH_ENDPOINT specified');
    return;
  }
  try {
    const data = {
      'hub.mode': 'publish',
      'hub.url': process.env.PUSH_RESOURCE || WEBSITE_URL,
    };
    console.log('Pinging PuSH endpoint');
    return await axios({
      method: 'POST',
      headers: {'content-type': 'application/x-www-form-urlencoded'},
      data: qs.stringify(data),
      url: process.env.PUSH_ENDPOINT,
    });
  } catch (err) {
    console.log('Error pinging PuSH endpoint', err.message);
  }
}
