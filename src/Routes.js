import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import Log from "./containers/Log";
import Sign from "./containers/Sign";
import Account from "./containers/Account";

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/connexion" component={Log} />
            <Route exact path="/inscription" component={Sign} />
            <Route exact path="/mon-compte" component={Account} />
        </Switch>
    );
}