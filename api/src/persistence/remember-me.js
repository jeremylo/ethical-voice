import { query } from '../db.js';

/**
 * Retrieves remember-be record from its database table.
 * @param   {string}  tokenHash  The SHA256 hash of the remember-me token.
 * @return  {object}             Database results-set
 */
export async function findRememberMeToken(tokenHash) {
    return (await query("SELECT * FROM remember_me WHERE token=? LIMIT 1", [tokenHash]))[0];
}

/**
 * Deletes a remember-be record from its database table.
 * @param   {string}  tokenHash  The SHA256 hash of the remember-me token.
 * @return  {object}             Database results-set
 */
export async function deleteRememberMeToken(tokenHash) {
    return (await query("DELETE FROM remember_me WHERE token=?", [tokenHash]));
}

/**
 * Insert a new remember-be record into the database.
 * @param   {number}  userId     The ID of the user.
 * @param   {string}  tokenHash  The SHA256 hash of the remember-me token.
 * @return  {object}             Database results-set
 */
export async function insertRememberMeToken(userId, tokenHash) {
    return (await query("INSERT INTO remember_me (user_id, token) VALUES (?, ?)", [userId, tokenHash]));
}
