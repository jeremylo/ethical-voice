import { query } from '../db.js';


/**
 * Finds all activated SROs.
 */
export async function findActivatedSros() {
    return (await query("SELECT * FROM sros WHERE status=?", [1]));
}

/**
 * Finds an SRO by their ID.
 * @param {number} id
 * @return Database results-set.
 */
export async function findSroById(id) {
    return (await query("SELECT * FROM sros WHERE id=? AND status=? LIMIT 1", [id, 1]))[0];
}

/**
 * Finds an SRO by their email.
 * @param {string} email
 * @return Database results-set.
 */
export async function findSroByEmail(email) {
    return (await query("SELECT * FROM sros WHERE email=? AND status=? LIMIT 1", [email, 1]))[0];
}

/**
 * Creates a new SRO.
 *
 * @param   {string}  n         The SRO's name.
 * @param   {string}  email     The SRO's email.
 * @param   {string}  password  A hash of the SRO's password.
 * @param   {string}  trusted   Whether or not the SRO may manage other SROs.
 *
 * @return  {object}            Database results set.
 */
export async function createSro(n, email, password, trusted) {
    return (await query("INSERT INTO sros (name, email, password, status, trusted) VALUES (?, ?, ?, ?, ?)", [n, email, password, 1, trusted ? 1 : 0]));
}

/**
 * Updates an SRO's name.
 *
 * @param   {object}  user  The SRO's user object.
 * @param   {string}  n     The SRO's new name.
 *
 * @return  {object}        Database results-set.
 */
export async function updateSroName(user, n) {
    return (await query("UPDATE sros SET name=? WHERE id=?", [n, user.id]));
}

/**
 * Updates an SRO's email.
 *
 * @param   {object}  user  The SRO's user object.
 * @param   {string}  email The SRO's new email.
 *
 * @return  {object}        Database results-set.
 */
export async function updateSroEmail(user, email) {
    return (await query("UPDATE sros SET email=? WHERE id=?", [email, user.id]));
}

/**
 * Updates an SRO's password.
 *
 * @param   {object}  user      The SRO's user object.
 * @param   {string}  password  A dash of the SRO's new password.
 *
 * @return  {object}            Database results-set.
 */
export async function updateSroPassword(user, password) {
    return (await query("UPDATE sros SET password=? WHERE id=?", [password, user.id]));
}

/**
 * Transfers all the patients from one SRO to another.
 *
 * @param   {number}  from  The ID to transfer from.
 * @param   {number}  to    The ID to transfer to.
 *
 * @return  {object}        Database results-set.
 */
export async function transferPatients(from, to) {
    return (await query("UPDATE users SET sro_id=? WHERE sro_id=?", [to, from]));
}
