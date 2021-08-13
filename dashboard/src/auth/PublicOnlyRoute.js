import React from "react";
import {
    Redirect, Route
} from "react-router-dom";
import { useAuth } from "./use-auth";

// A <Route> wrapper that redirects unauthenticated users to the login page.
export default function PublicOnlyRoute({ children, ...rest }) {
    const auth = useAuth();
    return <Route
        {...rest}
        render={({ location }) =>
            !auth.sro ? children : <Redirect
                to={{
                    pathname: "/",
                    state: { from: location }
                }}
            />
        }
    />;
}
