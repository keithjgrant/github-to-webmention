import assert from 'assert';
import nock from 'nock';
import findTargets from '../lib/findTargets';
import pageContent from './fixtures/page-1-html.js';

describe('findTargets', () => {
  it('should find target urls', async () => {
    nock('https://example.com')
      .get('/test-post')
      .reply(200, pageContent, {
        'Content-Type': 'text/html',
      });

    const result = await findTargets('https://example.com/test-post');
    assert.deepEqual(result, [
      'https://www.manning.com/books/css-in-depth',
      'https://www.youtube.com/watch?v=u00FY9vADfQ',
      'https://adactio.com/journal/13831',
      'https://www.smashingmagazine.com/2016/03/houdini-maybe-the-most-exciting-development-in-css-youve-never-heard-of/',
      'https://freecontent.manning.com/modular-css/',
    ]);
  });

  it('should throw error on 404', done => {
    nock('https://example.com')
      .get('/test-post')
      .reply(404, 'Not found', {
        'Content-Type': 'text/html',
      });

    const result = findTargets('https://example.com/test-post');
    result
      .then(() => {
        assert.fail('Request should not succeed on 404');
      })
      .catch(() => {
        done();
      });
  });
});
