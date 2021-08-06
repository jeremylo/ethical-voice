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

// Provider hook that creates auth object and handles state
function useAuthProvider() {
    const [user, setUser] = useState(null);

    const refresh = () => {
        authenticator
            .getLoggedInUser()
            .then((user) => {
                console.log(user);
                setUser(user);
            });
    };

    useEffect(() => {
        refresh();
    }, [setUser])

    const login = (email, password) => {
        return authenticator
            .loginWithCredentials(email, password)
            .then((user) => {
                setUser(user);
                return user;
            }); // TODO: error handling
    };

    const register = (refId, email, password) => {
        return authenticator
            .register(refId, email, password)
            .then((user) => {
                setUser(user);
                return user;
            }); // TODO: error handling
    };

    const logout = () => {
        setUser(null);
        return authenticator
            .logout()
            .then(() => {
                setUser(false);
            });
    };

    const sendPasswordResetEmail = (email) => {
        // return authenticator
        //     .sendPasswordResetEmail(email)
        //     .then(() => {
        //         return true;
        //     });
    };

    const confirmPasswordReset = (code, password) => {
        // return authenticator
        //     .confirmPasswordReset(code, password)
        //     .then(() => {
        //         return true;
        //     });
    };

    // Return the user object and auth methods
    return {
        user,
        setUser,
        login,
        register,
        logout,
        sendPasswordResetEmail,
        confirmPasswordReset,
        setPassword: authenticator.setPassword,
        setOutwardPostcode: authenticator.setOutwardPostcode,
        setSharing: authenticator.setSharing
    };
}
