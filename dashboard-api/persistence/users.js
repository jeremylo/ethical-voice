import { query } from '../db.js';


export async function findUserById(id, status = 1) {
    return (await query("SELECT * FROM users WHERE id=? AND status=? LIMIT 1", [id, status]))[0];
}

export async function findActivatedUserByReferenceId(refId) {
    return (await query("SELECT * FROM users WHERE reference_id=? AND status=? LIMIT 1", [refId, 1]))[0];
}

export async function findUnactivatedUserByReferenceId(refId) {
    return (await query("SELECT * FROM users WHERE reference_id=? AND status=? LIMIT 1", [refId, 0]))[0];
}

export async function findUserByEmail(email) {
    return (await query("SELECT * FROM users WHERE email=? AND status=? LIMIT 1", [email, 1]))[0];
}

export async function findUnactivatedUsersBySro(sroId) {
    return (await query("SELECT * FROM users WHERE sro_id=? AND status=?", [sroId, 0]));
}

export async function findActivatedUsersBySro(sroId) {
    return (await query("SELECT * FROM users WHERE sro_id=? AND status=?", [sroId, 1]));
}

export async function createUnactivatedUser(referenceId, sroId, extra = '') {
    return (await query("INSERT INTO users (reference_id, sro_id, extra) VALUES (?, ?, ?)", [referenceId, sroId, extra]));
}

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

export async function updateUserExtra(user, extra) {
    return (await query("UPDATE users SET extra=? WHERE id=?", [extra, user.id]));
}
