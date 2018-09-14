import express from 'express';
import bodyParser from 'body-parser';
import processGitHubCommit from './processGitHubCommit';

import processPage from './processPage';

const {BRANCH_NAME} = process.env;

const app = express();

app.use(bodyParser.json());

app.post('/main', (request, response) => {
  console.log('Request received');
  try {
    const payload = request.body;

    if (payload && payload.ref === `refs/heads/${BRANCH_NAME || 'master'}`) {
      if (payload.commits && Array.isArray(payload.commits)) {
        payload.commits.map(processGitHubCommit);
      }
    }
    response.status(202).send({
      success: true,
    });
  } catch (err) {
    response.status(500).send({
      success: false,
    });
  }
});

const TEST_URL = 'https://keithjgrant.com/replies/2018/09/ping-3/';
processPage(TEST_URL);

app.listen(process.env.PORT || 3000);
