import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import Sign from "./containers/Sign";

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/inscription" component={Sign} />
        </Switch>
    );
}