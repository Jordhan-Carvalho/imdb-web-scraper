const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

const URLS = [
  'https://www.imdb.com/title/tt1131734/?ref_=nv_sr_7?ref_=nv_sr_7',
  'https://www.imdb.com/title/tt3371366/?ref_=nv_sr_1?ref_=nv_sr_1',
  'https://www.imdb.com/title/tt2382009/?ref_=nv_sr_3?ref_=nv_sr_3',
];

(async () => {
  const moviesData = [];
  for (const movie of URLS) {
    const response = await request({
      uri: movie,
      headers: {
        // eslint-disable-next-line prettier/prettier
      'accept':
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
        'accept-language': 'en-US,en;q=0.9,en-US;q=0.8,en;q=0.7',
        'cache-control': 'max-age=0',
        // eslint-disable-next-line prettier/prettier
      'referer': 'https://www.imdb.com/',
        'upgrade-insecure-requests': '1',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
        'accept-encoding': 'gzip, deflate, br',
      },
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
  }

  fs.writeFileSync('./data.json', JSON.stringify(moviesData), 'utf-8');

  console.log(moviesData);
})();
