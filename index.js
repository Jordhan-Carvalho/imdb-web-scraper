const fs = require('fs');
const requestPromise = require('request-promise');
const request = require('request');
const cheerio = require('cheerio');
const { Parser } = require('json2csv');

const URLS = [
  {
    url: 'https://www.imdb.com/title/tt3371366/?ref_=nv_sr_1?ref_=nv_sr_1',
    id: 'filme1',
  },
  {
    url: 'https://www.imdb.com/title/tt1131734/?ref_=nv_sr_7?ref_=nv_sr_7',
    id: 'filme2',
  },
  {
    url: 'https://www.imdb.com/title/tt2382009/?ref_=nv_sr_3?ref_=nv_sr_3',
    id: 'filme3',
  },
];

(async () => {
  const moviesData = [];
  for (const movie of URLS) {
    const headers = {
      // eslint-disable-next-line prettier/prettier
        'accept':
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
      'accept-language': 'en-US,en;q=0.9,en-US;q=0.8,en;q=0.7',
      'cache-control': 'max-age=0',
      'upgrade-insecure-requests': '1',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
      'accept-encoding': 'gzip, deflate, br',
    };
    const response = await requestPromise({
      uri: movie.url,
      headers,
      gzip: true,
    });
    const $ = cheerio.load(response);

    // Scrapped infos
    const title = $('div[class="title_wrapper"] > h1')
      .text()
      .trim();
    const rating = $('div[class="ratingValue"] > strong').text();
    const poster = $('div[class="poster"] > a > img').attr('src');
    const ratingCount = $('span[itemprop="ratingCount"]').text();
    const releaseDate = $('a[title="See more release dates"]')
      .text()
      .trim();
    const genres = [];
    $('div[class="subtext"] > a[href^="/search/title?genres="]').each(
      function() {
        genres.push($(this).text());
      }
    );

    moviesData.push({
      title,
      ratingCount,
      rating,
      releaseDate,
      genres,
      poster,
    });

    const file = fs.createWriteStream(`${movie.id}.jpg`);

    await new Promise((resolve, reject) => {
      const stream = request({
        uri: poster,
        headers,
        gzip: true,
      })
        .pipe(file)
        .on('finish', () => {
          console.log(`${title} finished downloading the img`);
          resolve();
        })
        .on('error', error => {
          reject(error);
        });
    }).catch(error => {
      console.log(`${title} has an error on download ${error}`);
    });
  }

  /* ##### Save as Data.json
  fs.writeFileSync('./data.json', JSON.stringify(moviesData), 'utf-8'); */

  /* ##### Save as .csv
  const fields = ['title', 'rating', 'releaseDate'];
  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(moviesData);
  fs.writeFileSync('./data.csv', csv, 'utf-8'); */
})();
