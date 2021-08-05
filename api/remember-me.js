import { createHash, randomBytes } from 'crypto';
import pool from './db.js';


export function hashRememberMeToken(token) {
    return createHash('sha256').update(token).digest('hex');
}

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

// Consume remember-me token (tokens are single-use!)
export function consumeRememberMeToken(token, done) {
    const tokenHash = hashRememberMeToken(token);
    try {
        const tokenData = findRememberMeToken(tokenHash);
        deleteRememberMeToken(tokenHash);

        if (!tokenData.user_id) {
            return done(null, false);
        }

        findUserById(tokenData.user_id)
            .then(user => {
                return done(null, user);
            })
    } catch (e) {
        done(e, false);
    }
}

// Issue remember-me token
export async function issueRememberMeToken(user) {
    const token = randomBytes(64).toString('base64');
    try {
        await insertRememberMeToken(user.id, hashRememberMeToken(token));
        return token;
    } catch (e) {
        throw new Error("Unable to issue a new remember-me token.");
    }
}
