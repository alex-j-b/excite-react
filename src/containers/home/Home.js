//React
import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import "./Home.css";
//Images
import {
    frame1BG,
    esportBG,
    ecoin,
    oneIcon,
    twoIcon,
    threeIcon,
    controlerIcon,
    giftIcon,
    lolImage,
    fortniteImage,
    fifa20Image,
    separator
} from "../../assets/export.js";


export default class Home extends Component {
    render() {
        return (
            <div className="home">
                <Helmet><title>{this.props.title}</title></Helmet>
                <div className="home-1" onClick={() => this.props.history.push('/jouer')}>
                    <video id="videoBG" poster={frame1BG} playbackRate="0.75" autoPlay playsInline muted loop>
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

                <div className="svg-wrapper">
                    <svg viewBox="0 0 500 150" preserveAspectRatio="none">
                        <path d="M0.00,49.98 C149.99,150.00 349.20,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"></path>
                    </svg>
                </div>

                <div className="home-2" onClick={() => this.props.history.push('/jouer')}>
                    <div className="step first">
                        <img className="number" src={oneIcon} alt="oneIcon"></img>
                        <div>
                            <img className="icon" src={ecoin} alt="ecoin"></img>
                            <p>Mise des eCoins</p>
                        </div>
                        <span>500 offerts à l'inscription !</span>
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
                        <Link to="/jouer?game=fortnite">
                            <img src={fortniteImage} alt="fortniteImage"></img>
                        </Link>
                        <Link to="/jouer?game=fifa20">
                            <img src={fifa20Image} alt="fifa20Image"></img>
                        </Link>
                        <Link to="/jouer?game=leagueoflegends">
                            <img src={lolImage} alt="lolImage"></img>
                        </Link>
                        {/* <Link to="/jouer?game=counterstrikego">
                            <img src={csgoImage} alt="csgoImage"></img>
                        </Link> */}
                    </div>
                </div>
            </div>
        );
    }
}
