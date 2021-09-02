import React from "react";
import { Route } from "react-router-dom";

export default function normalRoute({ component: C, title, ...rest }) {
    return (
        <Route
            {...rest}
            render={props => <C {...props} title={title} />}
        />
    );
}
