import bcrypt from 'bcrypt';
import { createHash } from 'crypto';

export function isValidName(n) {
    return /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u.test(n) && n.length < 250;
}

export function isValidEmail(email) {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(email).toLowerCase());
}

export function isValidPassword(password) {
    return String(password).length >= 10;
}

export async function isValidPasswordHash(password, hash) {
    return await bcrypt.compare(password, hash);
}

export async function hashPassword(password) {
    return await bcrypt.hash(password, process.env.BCRYPT_SALT_ROUNDS ?? 14);
}

export function hashSha256(token) {
    return createHash('sha256').update(token).digest('hex');
}

export function isNumeric(x) {
    return /^[1-9][\d]*$/.test(x);
}

export function generateReferenceId() {
    return String(Math.floor(Math.random() * Math.pow(10, 12)) + 1).padStart(12, '0');
}
