const{Pool} = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME

});


pool.connect((err, client, release) => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }

    console.log('Connected successfully');
    release();
});


module.exports = pool;
