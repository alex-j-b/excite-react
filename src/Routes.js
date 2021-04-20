//React
import React from "react";
import { Route, Switch } from "react-router-dom";
//Route types
import LoggedRoute from "./components/LoggedRoute";
import UnloggedRoute from "./components/UnloggedRoute";
//Pages
import Home from "./containers/Home";
import Log from "./containers/Log";
import Sign from "./containers/Sign";
import Account from "./containers/Account";
import Play from "./containers/Play";
import NotFound from "./containers/NotFound";
import Shop from "./containers/Shop";
import BuyEcoin from "./containers/BuyEcoin";
import Contact from "./containers/Contact";
import Conditions from "./containers/Conditions";
import Mentions from "./containers/Mentions";
import Faq from "./containers/Faq";

const reload = () => window.location.reload();

export default function Routes({ authProps }) {
    return (
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/boutique" component={Shop} />
            <Route exact path="/contact" component={Contact} />
            <Route exact path="/faq" component={Faq} />
            <Route exact path="/conditions" component={Conditions} />
            <Route exact path="/mentions" component={Mentions} />
            <UnloggedRoute exact path="/connexion" component={Log} authProps={authProps} />
            <UnloggedRoute exact path="/inscription" component={Sign} authProps={authProps} />
            <LoggedRoute exact path="/jouer" component={Play} authProps={authProps} />
            <LoggedRoute exact path="/ecoin" component={BuyEcoin} authProps={authProps} />
            <LoggedRoute exact path="/mon-compte" component={Account} authProps={authProps} />
            <Route exact path="/riot.txt" onEnter={reload} />
            <Route path="*" component={NotFound} />
        </Switch>
    );
}