import { query } from '../db.js';


/**
 * Finds an activated user from a given ID.
 * @param   {number}  id  The ID of the user.
 * @return  {object}      Database results-set.
 */
export async function findUserById(id) {
    return (await query("SELECT * FROM users WHERE id=? AND status=? LIMIT 1", [id, 1]))[0];
}

/**
 * Finds an activated user from a given reference ID.
 * @param   {number}  refId  The reference ID of the user.
 * @return  {object}         Database results-set.
 */
export async function findActivatedUserByReferenceId(refId) {
    return (await query("SELECT * FROM users WHERE reference_id=? AND status=? LIMIT 1", [refId, 1]))[0];
}

/**
 * Finds an unactivated user from a given reference ID.
 * @param   {number}  refId  The reference ID of the user.
 * @return  {object}         Database results-set.
 */
export async function findUnactivatedUserByReferenceId(refId) {
    return (await query("SELECT * FROM users WHERE reference_id=? AND status=? LIMIT 1", [refId, 0]))[0];
}

/**
 * Finds an activated user from a given email.
 * @param   {number}  refId  The email of the user.
 * @return  {object}         Database results-set.
 */
export async function findUserByEmail(email) {
    return (await query("SELECT * FROM users WHERE email=? AND status=? LIMIT 1", [email, 1]))[0];
}

/**
 * Activates the user and populates the missing needed fields in the database table. *
 * @param   {number}  id               The user's ID.
 * @param   {string}  referenceId      The user's reference ID.
 * @param   {string}  email            The user's email.
 * @param   {string}  password         A hash of a user's password.
 * @param   {string}  outwardPostcode  The user's outward postcode.
 * @return  {object}                   Database results-set.
 */
export async function activateUser(id, referenceId, email, password, outwardPostcode) {
    return (await query("UPDATE users SET email=?, password=?, outward_postcode=?, status=? WHERE id=? AND reference_id=?", [email, password, outwardPostcode, 1, id, referenceId]));
}

export async function updateUserEmail(user, email) {
    return (await query("UPDATE users SET email=? WHERE id=?", [email, user.id]));
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
