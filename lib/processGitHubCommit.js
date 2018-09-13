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
    .then(() => {
      console.log(`${url} done processing`);
    })
    .catch(err => {
      console.log(`${url} ERROR processing:`);
      console.log(err);
    });
}
