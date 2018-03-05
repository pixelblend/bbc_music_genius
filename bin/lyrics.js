const config = require('../config');
const createDB = require('../lib/db');
const scrapeLyrics = require('../lib/lyrics');

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

const db = createDB(config);

const main = async () => {
  const pendingTracks = await db.all(
    `select id, json_extract(json, '$.artist') as artist, json_extract(json, '$.title') as title from music where lyrics IS NULL`
  );

  asyncForEach(pendingTracks, async (t) => {
    const query = `${t.title} ${t.artist}`.replace(/[^0-9a-z ]/gi, '');
    const queryStripped = query.replace(/[^0-9a-z ]/gi, '');

    try {
      const lyrics = await scrapeLyrics(query);

    await db.run(
      `update music set lyrics = $lyrics where id = $id`,
      { $id: t.id, $lyrics: lyrics }
    );
    } catch(err) {
      console.warn(`No lyrics found for ${query}: `, err);
    }
  });
};

main();
