import assert from 'assert';
import getTargetUrls, {
  findMainHItem,
  findContentLinks,
} from '../lib/getTargetUrls';
import mfData1 from './fixtures/mf-data-1.json';
import mfData2 from './fixtures/mf-data-2.json';
import page1 from './fixtures/page-1-html';
import page2 from './fixtures/page-2-html';

describe('findContentLinks', () => {
  it('should return return list of links', function() {
    const html = `
      <div><p><a href="https://example.com">a link</a>
      to some things</p>
      <div>in reply to <a href="https://example.com/foo/bar" class="u-in-reply-to">a post</a></div></div>
    `;
    const result = findContentLinks(html);
    assert.deepEqual(result, [
      'https://example.com',
      'https://example.com/foo/bar',
    ]);
  });

  it('should return empty array', function() {
    const html = `
      <div><p>Some things.</p>
      <div>Some more things</div></div>
    `;
    const result = findContentLinks(html);
    assert.deepEqual(result, []);
  });
});

describe('findMainHItem', () => {
  it('should return item with url matching current url', () => {
    const url =
      'https://keithjgrant.com/posts/2018/06/resilient-declarative-contextual/';
    const result = findMainHItem(url, mfData1);
    assert.deepEqual(result, mfData1.items[1]);
  });

  it('should first non-h-card item when no items have url matching current url', () => {
    const url =
      'https://keithjgrant.com/replies/2018/09/testing-some-webmention-endpoint-discovery/';
    const result = findMainHItem(url, mfData2);
    assert.deepEqual(result, mfData2.items[1]);
  });

  it('should return null if mf data has no items', () => {
    const url = 'https://example.com';
    const result = findMainHItem(url, {});
    assert.equal(result, null);
  });
});

describe('getTargetUrls', () => {
  it('should return links from main entry', async () => {
    const url =
      'https://keithjgrant.com/posts/2018/06/resilient-declarative-contextual/';
    const result = await getTargetUrls(page1, url);
    assert.deepEqual(result, [
      'https://www.manning.com/books/css-in-depth',
      'https://www.youtube.com/watch?v=u00FY9vADfQ',
      'https://adactio.com/journal/13831',
      'https://www.smashingmagazine.com/2016/03/houdini-maybe-the-most-exciting-development-in-css-youve-never-heard-of/',
      'https://freecontent.manning.com/modular-css/',
    ]);
  });

  it('should include in-reply-to url', async () => {
    const url = 'https://keithjgrant.com/replies/2018/09/ping-3/';
    const result = await getTargetUrls(page2, url);
    assert.deepEqual(result, [
      'https://keithjgrant.com/replies/2018/09/50601/',
      'https://brid.gy/publish/twitter',
    ]);
  });
});
