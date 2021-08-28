import { useEffect } from "react";

/**
 * Validates whether an email is valid or not.
 *
 * @param   {string}  email  The email to validate.
 *
 * @return  {boolean}        True if the email is valid.
 */
export function isValidEmail(email) {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(email).toLowerCase());
}

/**
 * Validates whether a password meets the password policy.
 *
 * @param   {string}  password  The password to validate.
 *
 * @return  {boolean}           True if the password is valid.
 */
export function isValidPassword(password) {
    return String(password).length >= 10;
}

/**
 * Validates whether an outward postcode is a valid UK outward postcode,
 * e.g. SW1A.
 *
 * @param   {string}  outwardPostcode  The outward postcode to validate.
 *
 * @return  {boolean}                  True if the outward postcode is valid.
 */
export function isValidOutwardPostcode(outwardPostcode) {
    return /^[A-Z]{1,2}[0-9][A-Z0-9]?$/.test(String(outwardPostcode).toUpperCase());
}

/**
 * Validates whether a given reference ID is valid.
 *
 * @param   {string}  refId  The reference ID to validate.
 *
 * @return  {boolean}        Whether or not the reference ID is valid.
 */
export function isValidReferenceId(refId) {
    return /^[0-9]{4,16}$/.test(refId);
}

// eslint-disable-next-line react-hooks/exhaustive-deps
export const useMountEffect = (f) => useEffect(f, []);
