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
      } else {
        console.log(`${url} not found. Waiting to retry...`);
      }
    })
    .catch(err => {
      console.log(`${url} ERROR processing:`);
      console.log(err);
    });
}
