# TradeStack

## Setup DB.

* `cd` to project
* `cd db`
* Reset DB flat `mv trades.db trades.db.bak && sqlite3 trades.db < ../setup/schema.sql`
* Ensure it's working with:
  * `sqlite3 trades.db` > `.tables`
  * `.exit` to exit