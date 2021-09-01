import React, { Component } from "react";
import "./Faq.css";


export default class Conditions extends Component {

    componentDidMount() {
        let title = document.querySelector('head > title');
        title.innerHTML = 'Excite | FAQ';
    }

    render() {
        return (
            <div className="faq">
                <div className="wrap-faq">

                <p className="title">FAQ</p>

                    <h3>C’est quoi Excite ?</h3>
                    <p>Excite est une plateforme gaming qui permet de rentabiliser ses parties. Excite donne la possibilité aux joueurs de miser des eCoins (monnaie virtuelle) sur leur victoire. Avec les eCoins gagnés, le joueur peut ensuite les échanger contre des cadeaux dans la boutique Excite (maillot, carte cadeau, abonnement streaming...)</p>

                    <h3>Commence ça fonctionne ?</h3>
                    <ul>
                        <li>Le joueur créer un compte pour jouer</li>
                        500 eCOINS OFFERT À L’INSCRIPTION autre couleur
                        <li>Il choisit ensuite le jeu et une mise d’eCoins afin de lancer une partie</li>
                        <li>La recherche automatique trouve instantanément un adversaire de même niveau et le match commence</li>
                        <li>Le joueur gagnant remporte les mises </li>
                        Et ça recommence...
                    </ul>

                    <h3>Les eCoins ®️</h3>
                    <p>eCoin ®️ est la monnaie virtuelle permettant de jouer et d’avoir des cadeaux sur Excite.world</p>

                    <h3>Comment avoir des eCoins ? </h3>
                    <p>Plusieurs possibilités : </p>
                    <ul>
                        <li>En créant son compte Excite = 500eCoins offert </li>
                        <li>En gagnant un maximum de parties </li>
                        <li>En cliquant sur « obtenir des eCoins » </li>
                        <li>En parrainant un ami (cet ami indique l’ID du parrain à l’inscription)</li>

                    </ul>

                    <h3>La Boutique </h3>
                    <p>Pour avoir des cadeaux, il suffit de cliquer sur « boutique ». Une sélection de cadeaux en fonction des jeux proposées est disponible avec une valeur en eCoin pour chaque cadeau. Le joueur échange le nombre d’eCoins équivalent au cadeau qu’il souhaite afin de l’obtenir.</p>
                </div>
            </div>
        );
    }
}