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

    const logout = () => {
        setUser(null);
        return authenticator
            .logout()
            .then(() => {
                setUser(false);
            });
    };

    // Return the user object and auth methods
    return {
        user,
        setUser,
        login,
        logout,
        register: authenticator.register,
        activate: authenticator.activate,
        requestPasswordReset: authenticator.requestPasswordReset,
        resetPassword: authenticator.resetPassword,
        setEmail: authenticator.setEmail,
        setPassword: authenticator.setPassword,
        setOutwardPostcode: authenticator.setOutwardPostcode,
        setSharing: authenticator.setSharing
    };
}
