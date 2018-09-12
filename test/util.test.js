import assert from 'assert';
import {absUrl} from '../lib/util';

describe('util', () => {
  describe('absUrl', () => {
    it('should build absolute url', () => {
      assert.equal(
        absUrl('/webmention', 'https://example.com'),
        'https://example.com/webmention'
      );
    });

    it('should build url relative to path', () => {
      assert.equal(
        absUrl('webmention', 'https://example.com/foo/bar.html'),
        'https://example.com/foo/webmention'
      );
    });
  });
});
