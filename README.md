BBC Music & Lyrics Scraper
---

# Installation

1. `npm install`
2. `npm run migrate`

# Usage

1. Scrape Music from Radio 1 / 1xtra

    `npm run music`

2. Once you have enough music, you can run the lyrics scraper to assign words to
   your songs:

    `npm run lyrics`

  This is an interactive process, as [Genius](genius.com) does not always match
  a song search sensibly. You will need a [Genius API
  Token](https://docs.genius.com/) to run this scraper.

All data is stored in a SQLite database file at `db/music.sqlite3`
