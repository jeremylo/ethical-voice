import { query } from '../db.js';


export async function findSroById(id) {
    return (await query("SELECT * FROM sros WHERE id=? AND status=? LIMIT 1", [id, 1]))[0];
}

export async function findUnactivatedSroById(id) {
    return (await query("SELECT * FROM sros WHERE id=? AND status=? LIMIT 1", [id, 0]))[0];
}

export async function findSroByEmail(email) {
    return (await query("SELECT * FROM sros WHERE email=? AND status=? LIMIT 1", [email, 1]))[0];
}

export async function activateSro(id, email, password) {
    return (await query("UPDATE sros SET email=?, password=?, status=? WHERE id=?", [email, password, 1, id]));
}

export async function updateSroEmail(user, email) {
    return (await query("UPDATE sros SET email=? WHERE id=?", [email, user.id]));
}

export async function updateSroPassword(user, password) {
    return (await query("UPDATE sros SET password=? WHERE id=?", [password, user.id]));
}
