import pool from './db.js';

export async function findUserById(id) {
    let conn;
    try {
        conn = await pool.getConnection();
        return (await conn.query("SELECT * FROM users WHERE id=? AND status=? LIMIT 1", [id, 1]))[0];
    } catch (e) {
        throw new Error("Unable to retrieve this user.");
    } finally {
        conn.release();
    }
}

export async function findUserByEmail(email) {
    let conn;
    try {
        conn = await pool.getConnection();
        return (await conn.query("SELECT * FROM users WHERE email=? AND status=? LIMIT 1", [email, 1]))[0];
    } catch (e) {
        throw new Error("Unable to retrieve this user.");
    } finally {
        conn.release();
    }
}

export async function updateUserPassword(user, password) {
    let conn;
    try {
        conn = await pool.getConnection();
        return (await conn.query("UPDATE users SET password=? WHERE id=?", [password, user.id]));
    } catch (e) {
        throw new Error("Unable to update the user's password.");
    } finally {
        conn.release();
    }
}

export async function updateUserOutwardPostcode(user, outwardPostcode) {
    let conn;
    try {
        conn = await pool.getConnection();
        return (await conn.query("UPDATE users SET outward_postcode=? WHERE id=?", [outwardPostcode, user.id]));
    } catch (e) {
        throw new Error("Unable to update the user's outward postcode.");
    } finally {
        conn.release();
    }
}

export async function updateUserSharing(user, sharing) {
    let conn;
    try {
        conn = await pool.getConnection();
        return (await conn.query("UPDATE users SET sharing=? WHERE id=?", [sharing ? 1 : 0, user.id]));
    } catch (e) {
        throw new Error("Unable to update the user's sharing agreement status.");
    } finally {
        conn.release();
    }
}
