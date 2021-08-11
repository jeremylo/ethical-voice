import { query } from '../db.js';

export async function findRememberMeToken(tokenHash) {
    return (await query("SELECT * FROM remember_me WHERE token=? LIMIT 1", [tokenHash]))[0];
}

export async function deleteRememberMeToken(tokenHash) {
    return (await query("DELETE FROM remember_me WHERE token=?", [tokenHash]));
}

export async function insertRememberMeToken(userId, tokenHash) {
    return (await query("INSERT INTO remember_me (user_id, token) VALUES (?, ?)", [userId, tokenHash]));
}
