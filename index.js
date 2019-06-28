const request = require('request-promise');
const cheerio = require('cheerio');

const URL =
  'https://www.imdb.com/title/tt8663516/?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=99ed26bb-89a8-4157-8c78-3cd5b17286cd&pf_rd_r=HZV3JHQP2V1EFF5HR303&pf_rd_s=right-7&pf_rd_t=15061&pf_rd_i=homepage&ref_=hm_cht_t1';

(async () => {
  const response = await request({
    uri: URL,
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
  const title = $('div[class="title_wrapper"] > h1').text();
  const rating = $('div[class="ratingValue"] > strong').text();
  console.log(`${title} e o rating ${rating}`);
})();
