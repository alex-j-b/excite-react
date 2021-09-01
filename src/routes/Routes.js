//React
import React from "react";
import { Route, Switch } from "react-router-dom";
//Route types
import LoggedRoute from "./LoggedRoute";
import UnloggedRoute from "./UnloggedRoute";
//Pages
import Home from "../containers/home/Home";
import Log from "../containers/auth/Log";
import Sign from "../containers/auth/Sign";
import Account from "../containers/auth/Account";
import Play from "../containers/play/Play";
import NotFound from "../containers/notfound/NotFound";
import Shop from "../containers/shop/Shop";
import BuyEcoin from "../containers/shop/BuyEcoin";
import Contact from "../containers/contact/Contact";
import Conditions from "../containers/legal/Conditions";
import Mentions from "../containers/legal/Mentions";
import Faq from "../containers/faq/Faq";

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