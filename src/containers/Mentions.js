import React, { Component } from "react";
import "./Legal.css";


export default class Conditions extends Component {

    componentDidMount() {
        let title = document.querySelector('head > title');
        title.innerHTML = 'Excite | Mentions légales';
    }

    render() {
        return (
            <div className="legal">
            <div className="wrap-legal">

            <p className="title">Mentions légales</p>

                <h3>1. Présentation du site</h3>
                <p>En vertu de l’article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique, il est précisé aux utilisateurs du site <a className="grey-link" title="https://excite.world/" href="https://excite.world/">excite.world</a> l’identité des différents intervenants dans le cadre de sa réalisation et de son suivi :</p>
                <p><strong>Propriétaires : </strong>Leo Adragna - leo.adragna@excite.world | Alexis Boix - alexis.boix@excite.world</p>
                <p><strong>Webmaster : </strong>Alexis Boix - alexis.boix@excite.world</p>
                <p><strong>Hébergeur : </strong>Amazon Web Services, Inc. – 2121 7th Avenue Seattle, Washington, U.S.</p>

                <h3>2. Gestion des données personnelles</h3>
                <p>En France, les données personnelles sont notamment protégées par la loi n° 78-87 du 6 janvier 1978, la loi n° 2004-801 du 6 août 2004, l’article L. 226-13 du Code pénal et la Directive Européenne du 24 octobre 1995.</p>
                <p>Afin de satisfaire le besoin de certains services, le site <a className="grey-link" title="https://excite.world/" href="https://excite.world/">excite.world</a> collecte des informations personnelles relatives à l’utilisateur :</p>

                <ul>
                    <li>Email, Nom, Prénom, Date de naissance, Numéro de téléphone, Adresse et Mot de passe (crypté) de façon obligatoire lors de l'inscription. Ces informations son essentiels pour prevenir la fraude à la création de plusieurs comptes et pour expédier les articles commandés sur la boutique Excite.</li>
                    <li>Toutes les informations liées aux : paniers et commandes de la boutique Excite, achats d'eCoins, défis lancés et comptes de jeu vidéos sont également essentiels au fonctionnement du site.</li>
                    <li>D'autres informations tel que la fréquence de visite du site ou les pages Excite visitées sont stockés dans le stockage local présent sur le navigateur de l'appareil de l'utilisateur (se référer à la section 5).</li>
                </ul>

                <p>L’utilisateur fournit ces informations en toute connaissance de cause, notamment lorsqu’il procède par lui-même à leur saisie.</p>
                <p>Conformément aux dispositions des articles 38 et suivants de la loi 78-17 du 6 janvier 1978 relative à l’informatique, aux fichiers et aux libertés, tout utilisateur dispose d’un droit d’accès, de rectification et d’opposition aux données personnelles le concernant. Pour faire valoir ces droits, veuillez effectuer votre demande à partir de l'adresse mail utilisée lors de votre inscription au site <a className="grey-link" title="https://excite.world/" href="https://excite.world/">excite.world</a> vers l'adresse mail : alexis.boix@excite.world, en fournissant une copie du titre d’identité avec signature du titulaire de la pièce.</p>
                <p>Aucune information personnelle de l’utilisateur du site <a className="grey-link" title="https://excite.world/" href="https://excite.world/">excite.world</a> n’est publiée à l’insu de l’utilisateur, échangée, transférée, cédée ou vendue sur un support quelconque à des tiers. Seule l’hypothèse du rachat du site <a className="grey-link" title="https://excite.world/" href="https://excite.world/">excite.world</a> et de ses droits permettrait la transmission des dites informations à l’éventuel acquéreur qui serait à son tour tenu de la même obligation de conservation et de modification des données vis à vis de l’utilisateur du site <a className="grey-link" title="https://excite.world/" href="https://excite.world/">excite.world</a>.</p>
                <p>Les bases de données sont protégées par les dispositions de la loi du 1er juillet 1998 transposant la directive 96/9 du 11 mars 1996 relative à la protection juridique des bases de données.</p>
                <p>En cas d'utilisation des données personnelles non conforme avec la loi, l'utilisateur concerné peut déposer une réclamation auprès de la Cnil.</p>

                <h3>3. Liens hypertextes et cookies</h3>
                <p>Le site <a className="grey-link" title="https://excite.world/" href="https://excite.world/">excite.world</a> contient un certain nombre de liens hypertextes vers d’autres sites, mis en place avec l’autorisation de Alexis Boix. Cependant, Alexis Boix n’a pas la possibilité de vérifier le contenu des sites ainsi visités, et n’assumera en conséquence aucune responsabilité de ce fait.</p>
                <p>La navigation sur le site <a className="grey-link" title="https://excite.world/" href="https://excite.world/">excite.world</a> est susceptible de provoquer l’installation de cookie(s) sur l’ordinateur de l’utilisateur. Un cookie est un fichier de petite taille, qui ne permet pas l’identification de l’utilisateur, mais qui enregistre des informations relatives à la navigation d’un ordinateur sur un site. Les données ainsi obtenues visent à faciliter la navigation ultérieure sur le site, et ont également vocation à permettre diverses mesures de fréquentation.</p>
                <p>Le refus d’installation d’un cookie peut entraîner l’impossibilité d’accéder à certains services. L’utilisateur peut toutefois configurer son ordinateur de la manière suivante, pour refuser l’installation des cookies :</p>
                <p>Sous Internet Explorer : onglet outil (pictogramme en forme de rouage en haut a droite) / options internet. Cliquez sur Confidentialité et choisissez Bloquer tous les cookies. Validez sur Ok.</p>
                <p>Sous Firefox : en haut de la fenêtre du navigateur, cliquez sur le bouton Firefox, puis aller dans l’onglet Options. Cliquer sur l’onglet Vie privée. Paramétrez les Règles de conservation sur : utiliser les paramètres personnalisés pour l’historique. Enfin décochez-la pour désactiver les cookies.</p>
                <p>Sous Safari : Cliquez en haut à droite du navigateur sur le pictogramme de menu (symbolisé par un rouage). Sélectionnez Paramètres. Cliquez sur Afficher les paramètres avancés. Dans la section «&nbsp;Confidentialité&nbsp;», cliquez sur Paramètres de contenu. Dans la section «&nbsp;Cookies&nbsp;», vous pouvez bloquer les cookies.</p>
                <p>Sous Chrome : Cliquez en haut à droite du navigateur sur le pictogramme de menu (symbolisé par trois lignes horizontales). Sélectionnez Paramètres. Cliquez sur Afficher les paramètres avancés. Dans la section «&nbsp;Confidentialité&nbsp;», cliquez sur préférences. Dans l’onglet «&nbsp;Confidentialité&nbsp;», vous pouvez bloquer les cookies.</p>

                <h3>4. Applications tierces</h3>
                <p>Afin de proposer des services de qualité sur le site <a className="grey-link" title="https://excite.world/" href="https://excite.world/">excite.world</a>, la solution de paiement sécurisée et cryptée Stripe y est intégrée ainsi que l'outil Google "Places API" qui permet de prédire l'adresse que l'utilisateur est en train d'écrire.</p>
                <p>Lors de l'utilisation d'Excite, vous êtes par conséquent lié :</p>
                <ul>
                    <li>Aux conditions d'utilisation de Stripe : <a className="grey-link" title="https://stripe.com/fr/legal" href="https://stripe.com/fr/legal">https://stripe.com/fr/legal</a></li>
                    <li>Aux règles de confidentialité de Google : <a className="grey-link" title="https://policies.google.com/privacy" href="https://policies.google.com/privacy">https://policies.google.com/privacy</a></li>
                </ul>
                <p>Si vous avez une question ou une demande à propos de l'utilisation d'applications tierces par le site <a className="grey-link" title="https://excite.world/" href="https://excite.world/">excite.world</a>, n'hésitez pas à envoyer un courriel à cette adresse : alexis.boix@excite.world</p>

                <h3>5. Limitations contractuelles sur les données techniques</h3>
                <p>Le site utilise la technologie JavaScript.</p>
                <p>Le site Internet ne pourra être tenu responsable de dommages matériels liés à l’utilisation du site. De plus, l’utilisateur du site s’engage à accéder au site en utilisant un matériel récent, ne contenant pas de virus et avec un navigateur de dernière génération mis-à-jour.</p>

                <h3>6. Propriété intellectuelle et contrefaçons</h3>
                <p>Leo Adragna et Alexis Boix sont propriétaires des droits de propriété intellectuelle et détiennent les droits d’usage sur tous les éléments inhérents au site <a className="grey-link" title="https://excite.world/" href="https://excite.world/">excite.world</a>, notamment les textes, images, graphismes, logo, icônes, sons, logiciels.</p>
                <p>Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable par les propriétaires.</p>
                <p>Toute exploitation non autorisée du site ou de l’un quelconque des éléments qu’il contient sera considérée comme constitutive d’une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de Propriété Intellectuelle.</p>

                <h3>7. Limitations de responsabilité</h3>
                <p>Leo Adragna et Alexis Boix ne pourront être tenu responsable des dommages directs et indirects causés au matériel de l’utilisateur, lors de l’accès au site <a className="grey-link" title="https://excite.world/" href="https://excite.world/">excite.world</a>, et résultant soit de l’utilisation d’un matériel ne répondant pas aux spécifications indiquées au point 7, soit de l’apparition d’un bug ou d’une incompatibilité.</p>

                <h3>8. Droit applicable et attribution de juridiction</h3>
                <p>Tout litige en relation avec l’utilisation du site <a className="grey-link" title="https://excite.world/" href="https://excite.world/">excite.world</a> est soumis au droit français. Il est fait attribution exclusive de juridiction aux tribunaux compétents de Paris.</p>

                <h3>9. Les principales lois concernées</h3>
                <p>Loi n° 78-17 du 6 janvier 1978, notamment modifiée par la loi n° 2004-801 du 6 août 2004 relative à l’informatique, aux fichiers et aux libertés.</p>
                <p>Loi n° 2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique.</p>

                <h3>10. Lexique</h3>
                <p>Utilisateur : Internaute se connectant, utilisant le site susnommé.</p>
                <p>Informations personnelles : « les informations qui permettent, sous quelque forme que ce soit, directement ou non, l’identification des personnes physiques auxquelles elles s’appliquent » (article 4 de la loi n° 78-17 du 6 janvier 1978).</p>

            </div>
            </div>
        );
    }
}