import bcrypt from 'bcrypt';
import { createHash } from 'crypto';


/**
 * Validates an SRO's name.
 *
 * @param   {string}  n  The name.
 *
 * @return  {boolean}    True if valid.
 */
export function isValidName(n) {
    return /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u.test(n) && n.length < 250;
}

/**
 * Validates an email.
 *
 * @param   {string}  email  The email to validate.
 *
 * @return  {boolean}        True if the email is valid.
 */
export function isValidEmail(email) {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(email).toLowerCase());
}

/**
 * Validates whether a password is deemed acceptable to register with.
 *
 * @param   {string}  password  The password.
 *
 * @return  {boolean}           True if the password met the password policy.
 */
export function isValidPassword(password) {
    return String(password).length >= 10;
}

/**
 * Determines whether a plaintext matches a (salted) password hash.
 *
 * @param   {string}  password  The plaintext password.
 * @param   {string}  hash      The Bcrypt password hash.
 *
 * @return  {boolean}           True if they match.
 */
export async function isValidPasswordHash(password, hash) {
    return await bcrypt.compare(password, hash);
}

/**
 * Hashes a plaintext password using Bcrypt.
 *
 * @param   {string}  password  The plaintext password to hash.
 *
 * @return  {string}            The salted Bcrypt digest.
 */
export async function hashPassword(password) {
    return await bcrypt.hash(password, process.env.BCRYPT_SALT_ROUNDS ?? 14);
}

/**
 * Hashes a plaintext password using SHA256.
 *
 * @param   {string}  token  The token to hash.
 *
 * @return  {string}         The resulting hash.
 */
export function hashSha256(token) {
    return createHash('sha256').update(token).digest('hex');
}

/**
 * Validates whether the input represents a non-zero-padded valid integer.
 *
 * @param   {string}  x  The input to validate.
 *
 * @return  {boolean}    True if it is numeric.
 */
export function isNumeric(x) {
    return /^[1-9][\d]*$/.test(x);
}

/**
 * Generates a fresh random reference ID.
 *
 * @return  {string}  The new reference ID.
 */
export function generateReferenceId() {
    return String(Math.floor(Math.random() * Math.pow(10, 12)) + 1).padStart(12, '0');
}
