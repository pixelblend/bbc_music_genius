const sqlite = require('sqlite3');
const config = require('../config');

var db = new sqlite.Database(config.dbPath);

db.serialize(() => {
  db.run(`drop table music`);

  db.run(`create table music (
    id INTEGER PRIMARY KEY,
    pid CHAR(6),
    start_time DATETIME,
    end_time DATETIME,
    station VARCHAR(255),
    genius_url TEXT,
    json JSON
  );`);
});
