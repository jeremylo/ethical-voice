import pool from '../db.js';

export async function findUserById(id) {
    const conn = await pool.getConnection();
    return (await conn.query("SELECT * FROM users WHERE id=? LIMIT 1", [id]))[0];
}
