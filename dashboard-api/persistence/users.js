import { query } from '../db.js';


/**
 * Finds a user by their ID.
 */
export async function findUserById(id, status = 1) {
    return (await query("SELECT * FROM users WHERE id=? AND status=? LIMIT 1", [id, status]))[0];
}

/**
 * Finds an unactivated user by their SRO's ID.
 */
export async function findUnactivatedUsersBySro(sroId) {
    return (await query("SELECT * FROM users WHERE sro_id=? AND status=?", [sroId, 0]));
}

/**
 * Finds an activated user by their SRO's ID.
 */
export async function findActivatedUsersBySro(sroId) {
    return (await query("SELECT * FROM users WHERE sro_id=? AND status=?", [sroId, 1]));
}

/**
 * Creates a new unactivated user.
 */
export async function createUnactivatedUser(referenceId, sroId, extra = '') {
    return (await query("INSERT INTO users (reference_id, sro_id, extra) VALUES (?, ?, ?)", [referenceId, sroId, extra]));
}

/**
 * Updates the 'extra' field of a user.
 */
export async function updateUserExtra(user, extra) {
    return (await query("UPDATE users SET extra=? WHERE id=?", [extra, user.id]));
}
