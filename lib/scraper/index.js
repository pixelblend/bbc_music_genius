require('es6-promise').polyfill();
require('isomorphic-fetch');

const request = (url) => (
  fetch(url)
    .then((res) => res.text())
    .then((text) => text.replace('null(', '').slice(0, -1))
    .then(JSON.parse)
    .catch(err => console.warn(err))
);

const parse = (obj = false) => {
  if (!obj) {
    console.warn('No data found');
    return Promise.reject();
  }

  const { packages: { richtracks: tracks } } = obj;

  return tracks.map((track) => {
    const {
      record_id: pid,
      start,
      end,
      service: { sid: station }
    } = track;

    const startTime = new Date(start).toISOString();
    const endTime = new Date(end).toISOString();
    const json = JSON.stringify(track);

    return { pid, startTime, endTime, station, json };
  });
};

const storeInDB = db => (tracks) => (
  Promise.all(db.insertNew(tracks))
);

const scrape = (db, url) => {
  const store = storeInDB(db);

  let timeout = 1000;

  const runTimeout = () => (
    new Promise((resolve) => {
      console.log('waiting', timeout);
      setTimeout(resolve, timeout);
    })
  );

  console.log('scraping', url);

  request(url)
    .then((obj) => {
      const { timeouts: { polling_timeout } } = obj;
      timeout = polling_timeout;

      return obj;
    })
    .then(parse)
    .then(store)
    .then(runTimeout, runTimeout)
    .then(() => scrape(db, url))
    .catch(err => console.error(err));
};

const scraper = ({ urls, db }) => () => {
  urls.forEach((url) => scrape(db, url));
};

module.exports = scraper;
