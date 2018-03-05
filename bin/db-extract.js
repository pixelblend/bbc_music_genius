const util = require('util');
const { groupBy, orderBy } = require('lodash');
const sqlite = require('sqlite3');

var db = new sqlite.Database(__dirname + '/../db/music.sqlite3');

db.serialize(() => {
  db.all(`SELECT start_time, json from music order by start_time;`, (err, data) => {
    if(err) {
      console.error(err);
      process.exit(1);
    }

    const obj = data.map(d => JSON.parse(d.json));
    const grouped = groupBy(obj, o => o.service.sid);

    console.log(JSON.stringify(grouped));
  });
});
