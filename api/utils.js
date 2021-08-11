import bcrypt from 'bcrypt';

export function isValidEmail(email) {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(email).toLowerCase());
}

export function isValidPassword(password) {
    return String(password).length >= 10;
}

export function isValidOutwardPostcode(outwardPostcode) {
    return /^[A-Z]{1,2}[0-9][A-Z0-9]?$/.test(String(outwardPostcode).toUpperCase());
}

export function isValidReferenceId(refId) {
    return /^[0-9]{4,16}$/.test(refId);
}

export async function isValidPasswordHash(password, hash) {
    return await bcrypt.compare(password, hash);
}

export async function hashPassword(password) {
    return await bcrypt.hash(password, 14);
}

export function hashSha256(token) {
    return createHash('sha256').update(token).digest('hex');
}
