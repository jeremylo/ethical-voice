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
    const [sro, setSro] = useState(null);

    const refresh = () => {
        authenticator
            .getLoggedInUser()
            .then((user) => {
                setSro(user);
            });
    };

    useEffect(() => {
        refresh();
    }, [setSro])

    const login = (email, password) => {
        return authenticator
            .loginWithCredentials(email, password)
            .then((user) => {
                setSro(user);
                return user;
            }); // TODO: error handling
    };

    const logout = () => {
        setSro(null);
        return authenticator
            .logout()
            .then(() => {
                setSro(false);
            });
    };

    // Return the user object and auth methods
    return {
        sro,
        setSro,
        login,
        logout,
        setName: authenticator.setName,
        setEmail: authenticator.setEmail,
        setPassword: authenticator.setPassword,
    };
}
