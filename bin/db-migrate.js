const createDB = require('../lib/db');
const config = require('../config');

var db = createDB(config);

var initialize = async () => {
  await db.all(`create table if not exists music (
    id INTEGER PRIMARY KEY,
    pid CHAR(6),
    start_time DATETIME,
    end_time DATETIME,
    station VARCHAR(255),
    genius_url TEXT,
    json JSON
  );`);

  await db.all(`create table if not exists migrations (version INT);`);
  await db.all(`insert into migrations (version) VALUES (1)`);
};

var migrate1 = async () => {
  await db.all(`alter table music add column lyrics text`);
  await db.all(`insert into migrations (version) VALUES (2)`);
};

var migration = async () => {
  try {
    const [{ version }] = await db.all(`select version from migrations order by version desc limit 1`);
    return version;
  } catch(err) {
    return 0;
  }
};

const main = async () => {
  const version = await migration();

  switch (version) {
    case 0: {
      console.log('Migrating to version 1');
      await initialize();
      await main();
      break;
    }
    case 1: {
      console.log('Migrating to version 2');
      await migrate1();
      await main();
      break;
    }
    default: {
      console.log(`Nothing to do for version ${version}`);
    }
  }
};

main();
