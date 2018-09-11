import microformat from 'microformat-node';
import cheerio from 'cheerio';

export default function getTargetUrls(html, sourceUrl) {
  return new Promise((resolve, reject) => {
    microformat.get({html}, (err, data) => {
      if (err) {
        return reject(err);
      }

      const hItem = findMainHItem(sourceUrl, data);
      if (!hItem) {
        return resolve([]);
      }

      let links = [];
      hItem.properties.content.forEach(content => {
        const contentLinks = findContentLinks(content.html);
        links = links.concat(contentLinks);
      });
      console.log('links found:', links);
      resolve(links);
    });
  });
}

function findMainHItem(url, mfData) {
  return mfData.items.find(item => item.properties.url.includes(url));
}

export function findContentLinks(html) {
  const $ = cheerio.load(html);
  const links = [];
  $('a[href]').each((i, link) => {
    links.push($(link).prop('href'));
  });
  return links;
}
