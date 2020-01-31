import React, { Component } from "react";
import "./Play.css";
import Select from 'react-select';
import ImageFadeIn from 'react-image-fade-in';

import authBG from "../images/mystique-statue.jpg";
import lolLogo from "../images/lol-logo.png";
import fortniteLogo from "../images/fortnite-logo.png";
import rocketLogo from "../images/rocket-logo.png";
import historyWhite from "../images/history-white.png";
import historyBlack from "../images/history-black.png";
import ecoin from "../images/e-coin.png";

import riven from "../images/riven.png";
import fortniteChar from "../images/fortnite-char.png";
import rocketCrash from "../images/rocket-crash.png";


const ecoinOptions = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' }
]

const CustomSingleValue = ({ data }) => (
    <div className="input-select">
        <div className="input-select__single-value">
            <span>{ data.label }</span>
            <span className="input-select__icon"><img className="ecoin" src={ecoin} alt="ecoin"></img></span>
        </div>
    </div>
);

export default class Play extends Component {
    switchTab = this.switchTab.bind(this);
    state = {
        tab: 'League of legends',
        ecoinOption: 5,
        imageReady: true
    }

    switchTab(e) {
        this.setState({ tab: e.target.name })
    }

    selectChange(value) {
        this.setState({ ecoinOption: value });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.tab !== nextState.tab) this.setState({ imageReady: false });
        return true;
    }

    componentDidUpdate() {
        if (!this.state.imageReady) this.setState({ imageReady: true });
    }

    render() {
        let gameImage = this.state.tab === 'League of legends' ? riven : fortniteChar;
        gameImage = this.state.tab === 'Rocket League' ? rocketCrash : gameImage;
        return (
            <div className="play" style={{ backgroundImage: `url(${authBG})` }}>
                <div>
                    <div className="header">
                        <button
                            className="lol-button" 
                            style={{
                                backgroundImage: `url(${lolLogo})`,
                                backgroundColor: `${this.state.tab === 'League of legends' ? '#f9f9f9' : 'transparent'}`
                            }}
                            name="League of legends"
                            onClick={this.switchTab}
                        ></button>
                        <button
                            className="fortnite-button" 
                            style={{
                                backgroundImage: `url(${fortniteLogo})`,
                                backgroundColor: `${this.state.tab === 'Fortnite' ? '#f9f9f9' : 'transparent'}`
                            }}
                            name="Fortnite"
                            onClick={this.switchTab}
                        ></button>
                        <button
                            className="rocket-button" 
                            style={{
                                backgroundImage: `url(${rocketLogo})`,
                                backgroundColor: `${this.state.tab === 'Rocket League' ? '#f9f9f9' : 'transparent'}`
                            }}
                            name="Rocket League"
                            onClick={this.switchTab}
                        ></button>

                        <div><span><label className="ecoin-label">E-coins : </label>500</span><img className="ecoin" src={ecoin} alt="ecoin"></img></div>

                        <button
                            className="history-button" 
                            style={{
                                backgroundImage: `url(${this.state.tab === 'history' ? historyBlack : historyWhite})`,
                                backgroundColor: `${this.state.tab === 'history' ? '#f9f9f9' : 'transparent'}`
                            }}
                            name="history"
                            onClick={this.switchTab}
                        ></button>
                    </div>

                    { this.state.tab !== 'history' ?
                        <div className="wrap-games">
                            <div className="left">
                                {/* <img src={gameImage} alt="game_image"></img> */}
                                {this.state.imageReady && <ImageFadeIn src={gameImage} />}
                            </div>
                            <div className="right">
                                <h1><span className="purple">{this.state.tab.charAt(0)}</span>{this.state.tab.slice(1)}</h1>
                                <Select
                                    className="select"
                                    options={ecoinOptions}
                                    defaultValue={ecoinOptions[0]}
                                    components={{ SingleValue: CustomSingleValue }}
                                    blurInputOnSelect={true}
                                    isSearchable={false}
                                    onChange={obj => this.selectChange(obj.value)}
                                />
                                <div>
                                    <span className="goal-price">Gagne une partie classée : {this.state.ecoinOption*2}</span>
                                    <img className="ecoin" src={ecoin} alt="ecoin"></img>
                                </div>
                                <button>Parier</button>
                            </div>
                        </div>
                        :
                        <div className="history">
                            <h1><span className="purple">H</span>istorique</h1>

                            <div className="item pending">
                                <div className="wrap-date-game">
                                    <span>24/10/2020 à 19h12</span>
                                    <span>League of legends</span>
                                </div>
                                <div className="wrap-bet-result">
                                    <span>Gagné une partie classée</span>
                                    <span>En cours... 5 <img className="ecoin" src={ecoin} alt="ecoin"></img></span>
                                </div>
                            </div>

                            <div className="item win">
                                <div className="wrap-date-game">
                                    <span>23/10/2020 à 17h45</span>
                                    <span>League of legends</span>
                                </div>
                                <div className="wrap-bet-result">
                                    <span>Gagné une partie classée</span>
                                    <span>Victoire +50 <img className="ecoin" src={ecoin} alt="ecoin"></img></span>
                                </div>
                            </div>

                            <div className="item lose">
                                <div className="wrap-date-game">
                                    <span>22/10/2020 à 11h30</span>
                                    <span>League of legends</span>
                                </div>
                                <div className="wrap-bet-result">
                                    <span>Gagné une partie classée</span>
                                    <span>Défaite -20 <img className="ecoin" src={ecoin} alt="ecoin"></img></span>
                                </div>
                            </div>

                            <div className="item win">
                                <div className="wrap-date-game">
                                    <span>24/10/2020 à 19h12</span>
                                    <span>League of legends</span>
                                </div>
                                <div className="wrap-bet-result">
                                    <span>Gagné une partie classée</span>
                                    <span>Victoire +5 <img className="ecoin" src={ecoin} alt="ecoin"></img></span>
                                </div>
                            </div>

                            <div className="item win">
                                <div className="wrap-date-game">
                                    <span>23/10/2020 à 17h45</span>
                                    <span>League of legends</span>
                                </div>
                                <div className="wrap-bet-result">
                                    <span>Gagné une partie classée</span>
                                    <span>Victoire +50 <img className="ecoin" src={ecoin} alt="ecoin"></img></span>
                                </div>
                            </div>

                            <div className="item lose">
                                <div className="wrap-date-game">
                                    <span>22/10/2020 à 11h30</span>
                                    <span>League of legends</span>
                                </div>
                                <div className="wrap-bet-result">
                                    <span>Gagné une partie classée</span>
                                    <span>Défaite -20 <img className="ecoin" src={ecoin} alt="ecoin"></img></span>
                                </div>
                            </div>
                            
                            <div className="item win">
                                <div className="wrap-date-game">
                                    <span>24/10/2020 à 19h12</span>
                                    <span>League of legends</span>
                                </div>
                                <div className="wrap-bet-result">
                                    <span>Gagné une partie classée</span>
                                    <span>Victoire +5 <img className="ecoin" src={ecoin} alt="ecoin"></img></span>
                                </div>
                            </div>

                            <div className="item win">
                                <div className="wrap-date-game">
                                    <span>23/10/2020 à 17h45</span>
                                    <span>League of legends</span>
                                </div>
                                <div className="wrap-bet-result">
                                    <span>Gagné une partie classée</span>
                                    <span>Victoire +50 <img className="ecoin" src={ecoin} alt="ecoin"></img></span>
                                </div>
                            </div>

                            <div className="item lose">
                                <div className="wrap-date-game">
                                    <span>22/10/2020 à 11h30</span>
                                    <span>League of legends</span>
                                </div>
                                <div className="wrap-bet-result">
                                    <span>Gagné une partie classée</span>
                                    <span>Défaite -20 <img className="ecoin" src={ecoin} alt="ecoin"></img></span>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}