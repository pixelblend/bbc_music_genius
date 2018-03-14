const _ = require('lodash');
const stemmer = require('stemmer');
const sqlite = require('sqlite3');

const stemming = process.env.STEMMING ? true : false;

const sort = (obj) => (
  _.chain(obj)
    .map((val, key) => (
      { name: key, count: val }
    ))
    .sortBy('count')
    .reverse()
    .keyBy('name')
    .mapValues('count')
    .value()
);

var db = new sqlite.Database(__dirname + '/../db/music.sqlite3');

db.serialize(() => {
  db.all(`SELECT lyrics from music where lyrics IS NOT NULL;`, (err, data) => {
    if(err) {
      console.error(err);
      process.exit(1);
    }

    const freq = {};

    data.forEach(({ lyrics }) => {
      const words = lyrics.match(/[a-z]+(?:$|\s+)/gi);

      if (typeof words == 'null') {
        return;
      }

      _.compact(words).forEach((word) => {
        const normalised = _.trim(word).toLowerCase()

        const wordKey = stemming ? stemmer(normalised) : normalised;

        const count = _.get(freq, wordKey, 0);

        _.set(freq, wordKey, count + 1);
      });
    });

    const sorted = sort(freq);

    console.log(JSON.stringify(sorted));
  });
});
