import assert from 'assert';
import nock from 'nock';
import sendWebmention from '../lib/sendWebmention';

describe('sendWebmention', () => {
  it('should send webmention', async () => {
    nock('https://example.com')
      .post('/webmention')
      .reply(202, 'Accepted', {
        'Content-Type': 'text/plain',
      });

    const source = 'https://example.com/source';
    const target = 'https://example.com/target';
    const endpoint = 'https://example.com/webmention';
    const response = await sendWebmention(source, target, endpoint);

    assert.equal(response.status, '202');
    assert.equal(response.data, 'Accepted');
  });
});
