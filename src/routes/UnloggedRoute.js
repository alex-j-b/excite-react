import React from "react";
import { Route, Redirect } from "react-router-dom";

export default function UnloggedRoute({ component: C, authProps, ...rest }) {

    const redirect = () => {
        let urlParams = (new URL(document.location)).searchParams;
        if (urlParams.get('redirect') !== null) {
            return urlParams.get('redirect');
        }
        else {
            return '/jouer';
        }
    }

    return (
        <Route
            {...rest}
            render={
                props => !authProps.isLogged
                ? <C {...props} />
                : <Redirect to={redirect()} />
            }
        />
    );
}
