import React from "react";
import { Route, Redirect } from "react-router-dom";

export default function loggedRoute({ component: C, authProps, ...rest }) {
    return (
        <Route
            {...rest}
            render={
                props => authProps.isLogging || authProps.isLogged
                ? <C {...props} />
                : <Redirect to={`/connexion?redirect=${props.location.pathname}${props.location.search}`} />
            }
        />
    );
}
