import microformat from 'microformat-node';
import cheerio from 'cheerio';

export default function getTargetUrls(html, sourceUrl) {
  return new Promise((resolve, reject) => {
    microformat.get({html}, (err, data) => {
      if (err) {
        console.log('Error parsing microformats', err);
        return reject(err);
      }

      const hItem = findMainHItem(sourceUrl, data);
      if (!hItem || !hItem.properties || !hItem.properties.content) {
        return resolve([]);
      }

      let links = [];
      hItem.properties.content.forEach(content => {
        const contentLinks = findContentLinks(content.html);
        // TODO: resolve relative urls
        links = links.concat(contentLinks);
      });
      // console.log('links found:', links);
      resolve(links);
    });
  });
}

export function findMainHItem(url, mfData) {
  if (!mfData.items) {
    return null;
  }
  const main = mfData.items.find(item => {
    if (item.properties.url) {
      return item.properties.url.includes(url);
    }
    return false;
  });
  if (main) {
    return main;
  }

  // Make a guess: return first item that's not an h-card
  const entry = mfData.items.find(item => !item.type.includes('h-card'));
  return entry || null;
}

export function findContentLinks(html) {
  const $ = cheerio.load(html);
  const links = [];
  $('a[href]').each((i, link) => {
    links.push($(link).prop('href'));
  });
  return links;
}
