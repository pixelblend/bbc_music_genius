const config = require('../config');
const createDB = require('../lib/db');
const createScraper = require('../lib/scraper');

const db = createDB(config);
const scraper = createScraper({ urls: config.urls, db });

scraper();
