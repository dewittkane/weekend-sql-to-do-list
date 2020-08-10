const pg = require( 'pg' );
const url = require('url');
//requires pg into the file

let config = {};

if (process.env.DATABASE_URL) {
    const params = url.parse(process.env.DATABASE_URL);
    const auth = params.auth.split(':');

    config = {
        user: auth[0],
        password: auth[1],
        host: params.hostname,
        port: params.port,
        database: params.pathname.split('/')[1],
        ssl: true
    }
    
} else {
    config = {
        database: 'weekend_to_do_app',
        host: 'localhost',
        port: 5432
    };
}
const pool = new pg.Pool(config);//constructs a new pool that links to our Postgres DB

pool.on( 'connect', () => {
    console.log( 'connected to postgres!' );
});//log for successful DB connection

pool.on( 'error', ( error ) => {
    console.log( 'error connecting to postgres:', error);
});// log for unsuccessful DB connection

module.exports = pool;