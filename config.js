const path = require('path');

const config = {
  dbPath: path.resolve(__dirname, './db/music.sqlite3'),
  urls: [
    'https://polling.bbc.co.uk/radio/nhppolling/bbc_1xtra?&callback=null',
    'https://polling.bbc.co.uk/radio/nhppolling/bbc_radio_one?&callback=null',
  ]
};

module.exports = config;
