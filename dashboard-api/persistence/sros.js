import { query } from '../db.js';


export async function findSroById(id) {
    return (await query("SELECT * FROM sros WHERE id=? AND status=? LIMIT 1", [id, 1]))[0];
}

export async function findSroByEmail(email) {
    return (await query("SELECT * FROM sros WHERE email=? AND status=? LIMIT 1", [email, 1]))[0];
}

export async function createSro(n, email, password, trusted) {
    return (await query("INSERT INTO sros (name, email, password, status, trusted) VALUES (?, ?, ?, ?, ?)", [n, email, password, 1, trusted ? 1 : 0]));
}

export async function updateSroName(user, n) {
    return (await query("UPDATE sros SET name=? WHERE id=?", [n, user.id]));
}

export async function updateSroEmail(user, email) {
    return (await query("UPDATE sros SET email=? WHERE id=?", [email, user.id]));
}

export async function updateSroPassword(user, password) {
    return (await query("UPDATE sros SET password=? WHERE id=?", [password, user.id]));
}
