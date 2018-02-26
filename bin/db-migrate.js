const sqlite = require('sqlite3');
const config = require('../config');

console.log(config);

var db = new sqlite.Database(config.dbPath);

db.serialize(() => {
  db.run(`create table music (
    id INTEGER PRIMARY KEY,
    start_time DATETIME,
    end_time DATETIME,
    station VARCHAR(255),
    genius_url TEXT,
    json JSON
  );`);

  const startTime = new Date('Mon Feb 26 10:07:05 +0000 2018').toISOString();
  const endTime = new Date('Mon Feb 26 10:07:05 +0000 2018').toISOString();

  db.run(`insert into music (start_time, end_time, station) VALUES (
    "${startTime}", "${endTime}", "bbc_1xtra"
  );`);
});
