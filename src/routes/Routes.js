//React
import React from "react";
import { Switch } from "react-router-dom";
//Route types
import NormalRoute from "./NormalRoute";
import UnloggedRoute from "./UnloggedRoute";
import LoggedRoute from "./LoggedRoute";
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
            <NormalRoute exact path="/" component={Home} title="Excite | Pariez sur vous" />
            <NormalRoute exact path="/boutique" component={Shop} title="Excite | Boutique" />
            <NormalRoute exact path="/contact" component={Contact} title="Excite | Contact" />
            <NormalRoute exact path="/faq" component={Faq} title="Excite | FAQ" />
            <NormalRoute exact path="/conditions" component={Conditions} title="Excite | Conditions générales d'utilisation" />
            <NormalRoute exact path="/mentions" component={Mentions} title="Excite | Mentions légales" />

            <UnloggedRoute exact path="/connexion" component={Log} authProps={authProps} title="Excite | Connexion" />
            <UnloggedRoute exact path="/inscription" component={Sign} authProps={authProps} title="Excite | Inscription" />

            <LoggedRoute exact path="/jouer" component={Play} authProps={authProps} title="Excite | Jouer" />
            <LoggedRoute exact path="/ecoin" component={BuyEcoin} authProps={authProps} title="Excite | Obtenir des eCoins" />
            <LoggedRoute exact path="/mon-compte" component={Account} authProps={authProps} title="Excite | Mon Compte" />

            <NormalRoute exact path="/riot.txt" onEnter={reload} />
            <NormalRoute path="*" component={NotFound} title="Excite | Page introuvable" />
        </Switch>
    );
}
