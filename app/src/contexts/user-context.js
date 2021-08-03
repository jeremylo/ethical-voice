import { createContext } from "react";

export const UserContext = createContext({
    loggedIn: false,
    authToken: null,
    email: null,
    outwardPostcode: null,
    sharing: null,
})
