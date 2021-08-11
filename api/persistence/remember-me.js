import pool from './db.js';

export async function findRememberMeToken(tokenHash) {
    let conn;
    try {
        conn = await pool.getConnection();
        return (await conn.query("SELECT * FROM remember_me WHERE token=? LIMIT 1", [tokenHash]))[0];
    } catch (e) {
        throw new Error("Unable to retrieve the remember-me token.");
    } finally {
        conn.release();
    }
}

export async function deleteRememberMeToken(tokenHash) {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query("DELETE FROM remember_me WHERE token=?", [tokenHash]);
    } catch (e) {
        throw new Error("Unable to delete the remember-me token.");
    } finally {
        conn.release();
    }
}

export async function insertRememberMeToken(userId, tokenHash) {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query("INSERT INTO remember_me (user_id, token) VALUES (?, ?)", [userId, tokenHash]);
    } catch (e) {
        throw new Error("Unable to insert the remember-me token.");
    } finally {
        conn.release();
    }
}
