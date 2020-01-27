import React, { Component } from "react";
import "./Home.css";

import trophyBG from "../images/trophy-background.jpg";
import esportBG from "../images/esport-background.mp4";

import oneIcon from "../images/one.png";
import twoIcon from "../images/two.png";
import threeIcon from "../images/three.png";

import eCoinIcon from "../images/e-coin.png";
import controlerIcon from "../images/controler.png";
import giftIcon from "../images/gift.png";

import lolImage from "../images/lol-image.png";
import fortniteImage from "../images/fortnite-image.png";
import rocketImage from "../images/rocket-image.jpg";

import separator from "../images/separator.png";


export default class Home extends Component {

    componentDidMount() {
        let videoBG = document.getElementById("videoBG");
        videoBG.playbackRate = 0.75;
    }

    render() {
        return (
            <div className="home">

                <div className="home-1">
                    <video id="videoBG" poster={trophyBG} playbackRate="3.0" autoPlay muted loop>
                        <source src={esportBG} type="video/mp4"></source>
                    </video>
                    <div>
                        <p>Mise sur ton skill et</p>
                        <p>Gagne des cadeaux !</p>
                        <button>Jouer</button>
                    </div>
                </div>

                <div className="home-2">
                    <div className="step first">
                        <img className="number" src={oneIcon} alt="oneIcon"></img>
                        <div>
                            <img className="icon" src={eCoinIcon} alt="eCoinIcon"></img>
                            <p>Mise des E-coins (gratuit)</p>
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
                    <img className="image" src={separator} alt="separator"></img>
                    <p>Jeux disponibles</p>
                    <div>
                        <img className="image" src={lolImage} alt="lolImage"></img>
                        <img className="image" src={fortniteImage} alt="fortniteImage"></img>
                        <img className="image" src={rocketImage} alt="rocketImage"></img>
                    </div>
                </div>

            </div>
        );
    }
}