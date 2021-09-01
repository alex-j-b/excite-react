import React, { Component } from "react";
import "./Legal.css";


export default class Conditions extends Component {

    componentDidMount() {
        let title = document.querySelector('head > title');
        title.innerHTML = "Excite | Conditions générales d'utilisation";
    }

    render() {
        return (
            <div className="legal">
            <div className="wrap-legal">

                <p className="title">Conditions générales d'utilisation</p>

                <h3>1. Avant propos</h3>
                <p>L’utilisation du site <a className="grey-link" title="https://excite.world/" href="https://excite.world/">excite.world</a> implique l’acceptation pleine et entière des conditions générales d’utilisation ci-après décrites. Ces conditions d’utilisation sont susceptibles d’être modifiées ou complétées à tout moment, les utilisateurs du site <a className="grey-link" title="https://excite.world/" href="https://excite.world/">excite.world</a> sont donc invités à les consulter de manière régulière.</p>
                <p>Ce site est normalement accessible à tout moment aux utilisateurs. Une interruption pour raison de maintenance technique peut être toutefois décidée par Alexis Boix.</p>

                <h3>2. Description des services fournis</h3>
                <p>Le site <a className="grey-link" title="https://excite.world/" href="https://excite.world/">excite.world</a> a pour objet de permettre aux joueurs de jeux vidéos de participer à des défis avec un objectif à atteindre dans le jeu vidéo. Une quantité donnée de monnaie virtuel (eCoin) est mise en jeu au début du défis, elle sera multipliée si le joueur atteint l'objectif donné.</p>
                <p>La monnaie virtuelle "eCoins" permet aux joueurs de commander des articles dans la boutique Excite. Chaque joueur démarre avec 500 eCoins, il est également possible d'acheter des eCoins grâce à la solution de paiement Stripe qui propose un service sécurisé et crypté.</p>
                <p>Le site <a className="grey-link" title="https://excite.world/" href="https://excite.world/">excite.world</a> n'est pas un site de pari en ligne, il est donc n'est donc pas possible de retirer et de convertir la monnaie virtuelle "eCoins" pour obtenir une autre monnaie.</p>

                <h3>3. Propriété</h3>
                <p>Votre compte sur <a className="grey-link" title="https://excite.world/" href="https://excite.world/">excite.world</a> ainsi que la totalité du contenu du site hors données personnelles appartiennent exclusivement aux propriétaires d'Excite, ainsi la vente ou l'achat de comptes Excite est formélement interdite.</p>

                <h3>4. Conditions d'utilisations</h3>
                <p>En cas d'utilisation jugée frauduleuse sur <a className="grey-link" title="https://excite.world/" href="https://excite.world/">excite.world</a>, l'utilisateur pourra voir sont compte Excite être définitivement supprimé et l'utilisateur est susceptible d'être banni à vie d'Excite. Les commandes en cours dans la boutique Excite pourront également être annulées. Cela concerne nottamment les points suivant (non exhaustif) :</p>

                <ul>
                    <li>Utilisation d'un compte de jeu vidéo secondaire (smurf) moins bien classé que son compte principale.</li>
                    <li>Pari réalisé par une personne tiers que celle qui est indiqué dans Nom et Prenom lors de l'inscription.</li>
                    <li>Création d'un nouveau compte Excite en plus de celui existant (compte unique obligatoire).</li>
                    <li>Triche réalisé sur un jeu vidéo pris en charge par Excite avec ou sans pari en cours.</li>
                    <li>Toute augmentation anormale du montant total d'eCoins présent sur le compte.</li>
                </ul>

            </div>
            </div>
        );
    }
}