import React, { Component } from "react";
import "./Play.css";
import Select from 'react-select';

import authBG from "../images/mystique-statue.jpg";
import lolLogo from "../images/lol-logo.png";
import fortniteLogo from "../images/fortnite-logo.png";
import rocketLogo from "../images/rocket-logo.png";
import history from "../images/history.png";
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
    switchGame = this.switchGame.bind(this);
    state = {
        game: 'League of legends',
        ecoinOption: 5
    }

    switchGame(e) {
        this.setState({ game: e.target.name })
    }

    selectChange(value) {
        console.log(this.state.ecoinOption)
        this.setState({ ecoinOption: value });
    }

    render() {
        let gameImage = this.state.game === 'League of legends' ? riven : fortniteChar;
        gameImage = this.state.game === 'Rocket League' ? rocketCrash : gameImage;
        return (
            <div className="play">
                <div>
                    <div className="header">
                        <button
                            className="lol-logo" 
                            style={{
                                backgroundImage: `url(${lolLogo})`,
                                backgroundColor: `${this.state.game === 'League of legends' ? '#f9f9f9' : 'transparent'}`
                            }}
                            name="League of legends"
                            onClick={this.switchGame}
                        ></button>
                        <button
                            className="fortnite-logo" 
                            style={{
                                backgroundImage: `url(${fortniteLogo})`,
                                backgroundColor: `${this.state.game === 'Fortnite' ? '#f9f9f9' : 'transparent'}`
                            }}
                            name="Fortnite"
                            onClick={this.switchGame}
                        ></button>
                        <button
                            className="rocket-logo" 
                            style={{
                                backgroundImage: `url(${rocketLogo})`,
                                backgroundColor: `${this.state.game === 'Rocket League' ? '#f9f9f9' : 'transparent'}`
                            }}
                            name="Rocket League"
                            onClick={this.switchGame}
                        ></button>

                        <div><span>E-coins : 500</span><img className="ecoin" src={ecoin} alt="ecoin"></img></div>

                        <button
                            className="history" 
                            style={{
                                backgroundImage: `url(${history})`,
                                backgroundColor: 'transparent'
                            }}
                        ></button>
                    </div>

                    <div className="wrap-left-right">
                        <div className="left">
                            <img src={gameImage} alt="riven"></img>
                        </div>
                        <div className="right">
                            <h1><span className="purple">{this.state.game.charAt(0)}</span>{this.state.game.slice(1)}</h1>
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
                </div>
            </div>
        );
    }
}