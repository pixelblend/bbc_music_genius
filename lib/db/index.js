const sqlite = require('sqlite3');

const db = ({ dbPath }) => {
  var handle = new sqlite.Database(dbPath);

  const run = (sql, fields = {}, debug = false) => (
    new Promise((resolve, reject) => {
      handle.run(sql, fields, (err, data) => {
        if(err) {
          debug && console.warn('err', sql);
          return reject(err);
        }

        resolve(data);
      });
    })
  );

  const all = (sql, debug = false) => (
    new Promise((resolve, reject) => {
      handle.all(sql, (err, rows) => {
        if(err) {
          debug && console.warn('err', sql);
          return reject(err);
        }

        resolve(rows);
      });
    })
  );

  const insert = (track) => (
    run(
      `INSERT into music
        (pid, start_time, end_time, station, json)
        VALUES
        ($pid, $startTime, $endTime, $station, $json);`,
      {
        $pid: track.pid,
        $startTime: track.startTime,
        $endTime: track.endTime,
        $station: track.station,
        $json: track.json
      }
    )
  );

  const insertNew = (tracks) => (
    tracks.map((t) => (
      all(`SELECT id from music where start_time = '${t.startTime}'`)
        .then((rows) => {
          if(rows.length == 0) {
            console.log('inserting', t.pid);
            return insert(t);
          }

          console.log('passing', t.pid);
          return Promise.resolve();
        })
    ))
  );

  return { all, insert, insertNew, run };
};

module.exports = db;
