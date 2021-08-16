import mariadb from 'mariadb';

const pool = mariadb.createPool({
    host: process.env.MARIADB_HOST,
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    database: process.env.MARIADB_DATABASE,
    connectionLimit: 80,
    compress: true
});

export async function query(...args) {
    let conn;
    try {
        conn = await pool.getConnection();
        return await conn.query(...args);
    } finally {
        conn.release();
    }
}

export default pool;
