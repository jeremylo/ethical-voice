import { useEffect } from "react";
import { useAuth } from "../auth/use-auth";

export function isValidName(n) {
    return /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u.test(n) && n.length < 250;
}

export function isValidEmail(email) {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(email).toLowerCase());
}

export function isValidPassword(password) {
    return String(password).length >= 10;
}

export function isNumeric(x) {
    return /^[1-9][\d]*$/.test(x);
}

// eslint-disable-next-line react-hooks/exhaustive-deps
export const useMountEffect = (f) => useEffect(f, []);

export const useForceLogin = () => {
    const auth = useAuth();
    useMountEffect(() => { if (auth && auth.refresh) { auth.refresh(); } });
}
