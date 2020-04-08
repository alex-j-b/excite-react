//React
import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
//Images
import frame1BG from "../images/esport-background-frame1.png";
import esportBG from "../images/esport-background.mp4";
import ecoin from "../images/e-coin.png";
import oneIcon from "../images/one.png";
import twoIcon from "../images/two.png";
import threeIcon from "../images/three.png";
import controlerIcon from "../images/controler.png";
import giftIcon from "../images/gift.png";
import lolImage from "../images/lol-image.png";
import fortniteImage from "../images/fortnite-image.png";
import csgoImage from "../images/counter-strike-image.jpg";
import separator from "../images/separator.png";
//Preload
import authBG from "../images/mystique-statue.jpg";
import lolLogo from "../images/lol-logo.png";
import fortniteLogo from "../images/fortnite-logo.png";
import csgoLogo from "../images/csgo-logo.png";
import historyBlack from "../images/history-black.png";
import stripeLogo from "../images/stripe-logo.png";
import mastercardLogo from "../images/mastercard-logo.png";
import visaLogo from "../images/visa-logo.jpg";
import paypalLogo from "../images/paypal-logo.png";
import paysafecardLogo from "../images/paysafecard-logo.jpg";
import csgoPolice from "../images/csgo-police.png";
import steamLogo from "../images/steam-logo.png";
import riven from "../images/lol-riven.png";
import lolPotion from "../images/lol-potion.png";
import fortniteChar from "../images/fortnite-char.png";
import rocketCrash from "../images/rocket-crash.png";
import backArrow from "../images/back-arrow.png";
import articlesIcon from "../images/articles.png";
import commandesIcon from "../images/commandes.png";
import panierIcon from "../images/panier.png";
import forestBG from "../images/forest.jpg";
import teemo from "../images/teemo.png";


export default class Home extends Component {

    componentDidMount() {
        let videoBG = document.getElementById("videoBG");
        videoBG.playbackRate = 0.75;

        let title = document.querySelector('head > title');
        title.innerHTML = 'Excite | Pariez sur vous';

        if (localStorage.getItem('firstVisit') === 'true') {
            const imagesPreload = [authBG, lolLogo, fortniteLogo, csgoLogo, historyBlack, stripeLogo, mastercardLogo, visaLogo, paypalLogo, paysafecardLogo, csgoPolice, steamLogo, riven, lolPotion, fortniteChar, rocketCrash, backArrow, articlesIcon, commandesIcon, panierIcon, forestBG, teemo];
            imagesPreload.forEach((image) => {
                const newImage = new Image();
                newImage.src = image;
                window[image] = newImage;
            });
            localStorage.setItem('firstVisit', 'false');
        }
    }

    render() {
        return (
            <div className="home">

                <div className="home-1">
                    <video id="videoBG" poster={frame1BG} playbackrate="3.0" autoPlay playsInline muted loop>
                        <source src={esportBG} type="video/mp4"></source>
                    </video>
                    <div>
                        <p>Mise sur ton skill et</p>
                        <p>Gagne des cadeaux !</p>
                        <button 
                            className="e-button"
                            onClick={() => this.props.history.push('/jouer')}
                            >Jouer
                        </button>
                    </div>
                </div>

                <div className="home-2">
                    <div className="step first">
                        <img className="number" src={oneIcon} alt="oneIcon"></img>
                        <div>
                            <img className="icon" src={ecoin} alt="ecoin"></img>
                            <p>Mise des eCoins (gratuit)</p>
                        </div>
                    </div>
                    <div className="step second">
                        <img className="number" src={twoIcon} alt="twoIcon"></img>
                        <div>
                            <img className="icon" src={controlerIcon} alt="controlerIcon"></img>
                            <p>Gagne ta partie</p>
                        </div>
                    </div>
                    <div className="step third">
                        <img className="number" src={threeIcon} alt="threeIcon"></img>
                        <div>
                            <img className="icon" src={giftIcon} alt="giftIcon"></img>
                            <p>Multiplie ta mise et achète des cadeaux</p>
                        </div>
                    </div>
                </div>
    
                <div className="home-3">
                    <img src={separator} alt="separator"></img>
                    <p>Jeux disponibles</p>
                    <div>
                        <Link to="/jouer?game=leagueoflegends">
                            <img src={lolImage} alt="lolImage"></img>
                        </Link>
                        <Link to="/jouer?game=fortnite">
                            <img src={fortniteImage} alt="fortniteImage"></img>
                        </Link>
                        <Link to="/jouer?game=counterstrikego">
                            <img src={csgoImage} alt="csgoImage"></img>
                        </Link>
                    </div>
                </div>

            </div>
        );
    }
}