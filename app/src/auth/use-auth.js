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

    useEffect(() => {
        authenticator
            .getLoggedInUser()
            .then((user) => {
                console.log(user);
                setUser(user);
            });
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

    const setPassword = (oldPassword, newPassword) => {
        return authenticator
            .setPassword(oldPassword, newPassword)
            .then((success) => {
                return success;
            })
            .catch(() => {
                return false;
            });
    };

    const setOutwardPostcode = (outwardPostcode) => {
        return authenticator
            .setOutwardPostcode(outwardPostcode)
            .then((success) => {
                return success;
            })
            .catch(() => {
                return false;
            });
    };

    const setSharing = (sharing) => {
        return authenticator
            .setSharing(sharing)
            .then((success) => {
                return success;
            })
            .catch(() => {
                return false;
            });
    };

    // Return the user object and auth methods
    return {
        user,
        login,
        register,
        logout,
        sendPasswordResetEmail,
        confirmPasswordReset,
        setPassword,
        setOutwardPostcode,
        setSharing
    };
}
