import assert from 'assert';
import nock from 'nock';
import {URL} from 'url';
import parseLinkHeader from 'parse-link-header';
import findWebmentionEndpoint from '../lib/findWebmentionEndpoint';

describe('parse-link-header', () => {
  it('should parse', () => {
    const header =
      '<https://api.github.com/webmention>; rel="webmention", ' +
      '<https://api.github.com/user/9287/repos?page=1&per_page=100>; rel="prev"; pet="cat", ' +
      '<https://api.github.com/user/9287/repos?page=5&per_page=100>; rel="last"';
    const result = parseLinkHeader(header);
    assert.equal(result.webmention.url, 'https://api.github.com/webmention');
  });
});

describe('findWebmentionEndpoint', () => {
  it('should find from link header', async () => {
    nock('https://example.com')
      .get('/foo')
      .reply(200, '<html><p>some body</p></html', {
        'Content-Type': 'text/html',
        Link: '<https://example.com/webmention>; rel="webmention"',
      });
    const result = findWebmentionEndpoint('https://example.com/foo');

    assert.equal(await result, 'https://example.com/webmention');
  });

  it('should find from link header - relative url', async () => {
    nock('https://example.com')
      .get('/foo')
      .reply(200, '<html><p>some body</p></html', {
        'Content-Type': 'text/html',
        Link: '</webmention>; rel="webmention"',
      });
    const result = findWebmentionEndpoint('https://example.com/foo');

    assert.equal(await result, 'https://example.com/webmention');
  });

  it('should find from link tag', async () => {
    nock('https://example.com')
      .get('/foo')
      .reply(
        200,
        '<html><link rel="webmention" href="https://example.com/webmention"><p>some body</p></html',
        {
          'Content-Type': 'text/html',
        }
      );
    const result = findWebmentionEndpoint('https://example.com/foo');

    assert.equal(await result, 'https://example.com/webmention');
  });

  it('should find from link tag - relative url', async () => {
    nock('https://example.com')
      .get('/foo')
      .reply(
        200,
        '<html><link rel="webmention" href="/webmention"><p>some body</p></html',
        {
          'Content-Type': 'text/html',
        }
      );
    const result = findWebmentionEndpoint('https://example.com/foo');

    assert.equal(await result, 'https://example.com/webmention');
  });

  it('should find from anchor tag', async () => {
    nock('https://example.com')
      .get('/foo')
      .reply(
        200,
        '<html><a rel="webmention" href="https://example.com/webmention">link</a><p>some body</p></html',
        {
          'Content-Type': 'text/html',
        }
      );
    const result = findWebmentionEndpoint('https://example.com/foo');

    assert.equal(await result, 'https://example.com/webmention');
  });

  it('should find from anchor tag - relative url', async () => {
    nock('https://example.com')
      .get('/foo')
      .reply(
        200,
        '<html><a rel="webmention" href="/webmention">link</a><p>some body</p></html',
        {
          'Content-Type': 'text/html',
        }
      );
    const result = findWebmentionEndpoint('https://example.com/foo');

    assert.equal(await result, 'https://example.com/webmention');
  });

  it('should should preserve query parameters', async () => {
    nock('https://example.com')
      .get('/foo')
      .reply(200, '<html><p>some body</p></html', {
        'Content-Type': 'text/html',
        Link: '<https://example.com/webmention?query=yes>; rel="webmention"',
      });
    const result = findWebmentionEndpoint('https://example.com/foo');

    assert.equal(await result, 'https://example.com/webmention?query=yes');
  });

  it('should resolve url relative to path rather than host', async () => {
    nock('https://example.com')
      .get('/foo/bar')
      .reply(
        200,
        '<html><link rel="webmention" href="bar/webmention"><p>some body</p></html',
        {
          'Content-Type': 'text/html',
        }
      );
    const result = findWebmentionEndpoint('https://example.com/foo/bar');

    assert.equal(await result, 'https://example.com/foo/bar/webmention');
  });

  it('should return null if no endpoint specified', async () => {
    nock('https://example.com')
      .get('/foo')
      .reply(200, '<html><p>some body</p></html', {
        'Content-Type': 'text/html',
      });
    const result = findWebmentionEndpoint('https://example.com/foo');

    assert.equal(await result, null);
  });
});
