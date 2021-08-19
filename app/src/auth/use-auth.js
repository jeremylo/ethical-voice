import React, { createContext, useContext, useEffect, useState } from "react";
import authenticator from "./authenticator";


const AuthContext = createContext();

export function AuthProvider({ children }) {
    return <AuthContext.Provider value={useAuthProvider()}>{children}</AuthContext.Provider>;
}

// Hook for child components to get the auth object and re-render when it changes.
export const useAuth = () => {
    return useContext(AuthContext);
};

const ANONYMOUS_USER = {
    refId: "ANONYMOUS_USER",
    email: "",
    outwardPostcode: "",
    sharing: false
};

// Provider hook that creates auth object and handles state
function useAuthProvider() {
    const [user, setUser] = useState(null);
    const [anonymous, setAnonymous] = useState(() => {
        if (localStorage.getItem('loggedInAnonymously') === "true") {
            setUser(ANONYMOUS_USER);
            return true;
        } else {
            return false;
        }
    });

    const refresh = () => {
        if (anonymous) return;
        authenticator
            .getLoggedInUser()
            .then((user) => {
                setUser(user);
            });
    };

    useEffect(() => {
        refresh();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // disabled so that this only runs once!

    const login = (email, password) => {
        return authenticator
            .loginWithCredentials(email, password)
            .then((user) => {
                setUser(user);
                return user;
            }); // TODO: error handling
    };

    const loginAnonymously = () => {
        if (user) return;

        setUser(null);
        localStorage.setItem('loggedInAnonymously', 'true');
        setAnonymous(true);
        setUser(ANONYMOUS_USER);
    }

    const logout = () => {
        setUser(null);

        if (anonymous) {
            localStorage.removeItem('loggedInAnonymously');
            setAnonymous(false);
            setUser(false);
            return;
        }

        return authenticator
            .logout()
            .then(() => {
                setUser(false);
            });
    };

    const authMethods = {
        register: authenticator.register,
        activate: authenticator.activate,
        requestPasswordReset: authenticator.requestPasswordReset,
        resetPassword: authenticator.resetPassword,
        setEmail: authenticator.setEmail,
        setPassword: authenticator.setPassword,
        setOutwardPostcode: authenticator.setOutwardPostcode,
        setSharing: authenticator.setSharing
    };

    // bypass real auth methods while logged in anonymously
    if (anonymous === true) {
        Object.keys(authMethods).forEach(method =>
            authMethods[method] = (async () => false)
        );
    }

    // Return the user object and auth methods
    return {
        user,
        refresh,
        setUser,
        login,
        logout,
        anonymous,
        loginAnonymously,
        ...authMethods
    };
}
