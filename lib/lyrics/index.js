const { get, trim } = require('lodash');
const cheerio = require('cheerio');
const geniusClient = require('node-genius');
const fetch = require('isomorphic-fetch');
const readline = require('readline');

const genius = new geniusClient(process.env.GENIUS_ACCESS_TOKEN);

const newShell = () => (
  readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
);

const searchForMatch = (term) => (
  new Promise((resolve, reject) => {
    genius.search(term, (error, json) => {
      if (error) {
        reject(err);
      }
      else {
        const results = JSON.parse(json);

        const matches = get(results, 'response.hits', []).map((h) => (
          { path: get(h, 'result.api_path', ''), title: get(h, 'result.full_title', '') }
        ));

        resolve(matches);
      }
    });
  })
);

const offerMatches = ({ matches, query }) => (
  new Promise((resolve, reject) => {
    const offerings = matches.map((m, i) => `[${i}] ${m.title}`);
    const questionText = `
Matches for "${query}":\n\n${offerings.join("\n")}
[s] Skip this track
`;

    const shell = newShell();

    shell.question(questionText, (answer) => {
      const selection = get(matches, answer, false);

      shell.close();

      if (answer == 's') {
        console.log('Skipping...');
        return reject();
      }

      if (selection) {
        return resolve(selection);
      }

      // didn't get a useful answer, ask again
      resolve(offerMatches({ matches, query }));
    });
  })
);

const fetchLyric = ({ path }) => (
  fetch(`https://genius.com${path}`)
    .then((response) => response.text())
);

const parseLyrics = ((html) => {
  const $ = cheerio.load(html);
  const lyrics = $('div.lyrics').text();

  return trim(lyrics);
});

const lyrics = (query) => (
  searchForMatch(query)
    .then((matches) => offerMatches({ matches, query }))
    .then(fetchLyric)
    .then(parseLyrics)
);

module.exports = lyrics;
