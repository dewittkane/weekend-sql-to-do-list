const pg = require('pg');
//requires pg into the file

const pool = new pg.Pool({
    database: 'weekend_to_do_app',
    host: 'localhost',
    port: 5432
});//constructs a new pool that links to our Postgres DB

pool.on("connect", () => {
    console.log('connected to postgres!');
});//log for successful DB connection

pool.on("error", (err) => {
    console.log('error connecting to postgres:', err);
});// log for unsuccessful DB connection

module.exports = pool;