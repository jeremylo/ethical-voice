import pool from './db.js';

async function query(...args) {
    let conn;
    try {
        conn = await pool.getConnection();
        return await conn.query(...args);
    } finally {
        conn.release();
    }
}

export async function findUserById(id) {
    return (await query("SELECT * FROM users WHERE id=? AND status=? LIMIT 1", [id, 1]))[0];
}

export async function findUserByEmail(email) {
    return (await query("SELECT * FROM users WHERE email=? AND status=? LIMIT 1", [email, 1]))[0];
}

export async function updateUserPassword(user, password) {
    return (await query("UPDATE users SET password=? WHERE id=?", [password, user.id]));
}

export async function updateUserOutwardPostcode(user, outwardPostcode) {
    return (await query("UPDATE users SET outward_postcode=? WHERE id=?", [outwardPostcode, user.id]));
}

export async function updateUserSharing(user, sharing) {
    return (await query("UPDATE users SET sharing=? WHERE id=?", [sharing ? 1 : 0, user.id]));
}
