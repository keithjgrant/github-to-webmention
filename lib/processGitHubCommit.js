import processPage from './processPage';

const {CONTENT_DIRECTORY, WEBSITE_URL} = process.env;

export default function processGitHubCommit(commit) {
  console.log(commit);
  if (!commit.files) {
    return;
  }

  commit.files.map(processFileCommit);
}

export function processFileCommit(file) {
  if (file.fileName && file.fileName.startsWith(CONTENT_DIRECTORY)) {
    if (file.status === 'created' /* || file.status === 'modified' */) {
      console.log(`File created: ${file.fileName}`);
      const url = `${WEBSITE_URL}/${file.fileName.replace(/.md$/, '')}`;
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
  }
}
