const lyrics = require('../lib/lyrics');

lyrics(query)
  .then(console.log)
  .then(() => process.exit(0));
