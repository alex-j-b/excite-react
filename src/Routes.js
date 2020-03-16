import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import Log from "./containers/Log";
import Sign from "./containers/Sign";
import Account from "./containers/Account";
import Play from "./containers/Play";
import NotFound from "./containers/NotFound";
import Shop from "./containers/Shop";
import BuyEcoin from "./containers/BuyEcoin";

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/connexion" component={Log} />
            <Route exact path="/inscription" component={Sign} />
            <Route exact path="/jouer" component={Play} />
            <Route exact path="/boutique" component={Shop} />
            <Route exact path="/ecoin" component={BuyEcoin} />
            <Route exact path="/mon-compte" component={Account} />
            <Route path="*" component={NotFound} />
        </Switch>
    );
}