//React
import React, { Component } from "react";
import "./Play.css";
//Redux
import { connect } from "react-redux";
import { checkLolAccount } from "../actions";
//libs
import Select from 'react-select';
import ImageFadeIn from 'react-image-fade-in';
import DotsLoader from '../components/DotsLoader';
//Images
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

import lolPotion from "../images/lol-potion.png";


const ecoinOptions = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' }
]

const lolRegionsOptions = [
    { value: 'euw1', label: 'EUW' },
    { value: 'eun1', label: 'EUN' },
    { value: 'ru', label: 'Russia' },
    { value: 'na1', label: 'NA' },
    { value: 'tr1', label: 'Turkey' },
    { value: 'kr', label: 'Korea' },
    { value: 'jp1', label: 'Japan' },
    { value: 'br1', label: 'Brasil' },
    { value: 'la1', label: 'LAN' },
    { value: 'la2', label: 'LAS' },
    { value: 'oc1', label: 'OCE' }
]

const CustomSingleValue = ({ data }) => (
    <div className="input-select">
        <div className="input-select__single-value">
            <span>{ data.label }</span>
            <span className="input-select__icon"><img className="ecoin" src={ecoin} alt="ecoin"></img></span>
        </div>
    </div>
);

class Play extends Component {
    onChange = this.onChange.bind(this);
    switchTab = this.switchTab.bind(this);
    checkLolAccount = this.checkLolAccount.bind(this);
    state = {
        tab: 'League of legends',
        ecoinOption: 5,
        imageReady: true,
        summonerName: '',
        region: 'euw1',
        loading: false
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    switchTab(e) {
        this.setState({ tab: e.target.name })
    }

    selectChange(name, value) {
        this.setState({ [name]: value });
    }

    checkLolAccount() {
        const { summonerName, region } = this.state;
        if (summonerName === '') {
            document.querySelector('.error-input.wrong-pseudo-region').style.display = "inline";
        }
        else {
            this.setState({ loading: true });
            this.props.checkLolAccount(summonerName, region).then(response => {
                this.setState({ loading: false });
                if (response.statusCode === 500) {
                    if (response.body.error === 'error bad profileIconId') {
                        document.querySelector('.error-input.wrong-icon').style.display = "inline";
                    }
                    else {
                        document.querySelector('.error-input.wrong-pseudo-region').style.display = "inline";
                    }
                }
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.tab !== nextState.tab) this.setState({ imageReady: false });
        return true;
    }

    componentDidUpdate() {
        console.log(this.props.user);
        //Not Logged Redirection
        if (!this.props.isLogged) {
            this.props.history.push('/connexion');
        }
        if (!this.state.imageReady) this.setState({ imageReady: true });
    }

    componentDidMount() {
        if (this.props.authStatus === 'deleteUser') {
            this.props.history.push('/connexion');
        }
    }

    render() {
        let gameImage = this.state.tab === 'League of legends' ? riven : fortniteChar;
        gameImage = this.state.tab === 'Rocket League' ? rocketCrash : gameImage;

        let tabKey = this.state.tab === 'League of legends' ? 'lol' : 'fortnite';
        tabKey = this.state.tab === 'Rocket League' ? 'rl' : tabKey;

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

                        <div>
                            <span><label className="ecoin-label">E-coins : </label>{this.props.user['custom:ecoin']}</span>
                            <img className="ecoin" src={ecoin} alt="ecoin"></img>
                        </div>

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
                                {this.state.imageReady && <ImageFadeIn src={gameImage} />}
                            </div>
                            <div className="right">
                                <h1><span className="purple">{this.state.tab.charAt(0)}</span>{this.state.tab.slice(1)}</h1>

                            { this.props.isLogged && tabKey in this.props.user['custom:games_account'] ?
                                <>
                                <Select
                                    className="select-ecoin"
                                    options={ecoinOptions}
                                    defaultValue={ecoinOptions[0]}
                                    components={{ SingleValue: CustomSingleValue }}
                                    blurInputOnSelect={true}
                                    isSearchable={false}
                                    onChange={obj => this.selectChange('ecoinOption', obj.value)}
                                />
                                <div>
                                    <span className="goal-price">Gagne une partie classée : {this.state.ecoinOption*2}</span>
                                    <img className="ecoin" src={ecoin} alt="ecoin"></img>
                                </div>
                                <button>Parier</button>
                                </>
                                :


                                <>
                                <div className="check-game-account">
                                    <div>
                                        <label htmlFor="summonerName">
                                            <span><span className="purple">N</span>om d'invocateur</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Nom d'invocateur"
                                            name="summonerName"
                                            onChange={this.onChange}
                                            value={this.state.summonerName}
                                            spellCheck={false}
                                            required
                                        ></input>
                                    </div>

                                    <div>
                                        <label htmlFor="regionSelect">
                                            <span><span className="purple">R</span>égion</span>
                                        </label>
                                        <Select
                                            className="select-region"
                                            options={lolRegionsOptions}
                                            defaultValue={lolRegionsOptions[0]}
                                            blurInputOnSelect={true}
                                            isSearchable={false}
                                            onChange={obj => this.selectChange('regionOption', obj.value)}
                                        />
                                    </div>
                                </div>
                                
                                <div className="lol-check-icon">
                                    <img src={lolPotion} alt="lol-potion"></img>
                                    <p>Veuillez changer votre icon afin de valider votre compte</p>
                                </div>

                                <button onClick={this.checkLolAccount}>Valider</button>
                                <p className="error-input wrong-pseudo-region">Nom d'invocateur ou région invalide</p>
                                <p className="error-input wrong-icon">Veuillez changer votre icon</p>
                                <DotsLoader loading={this.state.loading}/>
                                </>
                            }


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

function mapDispatchToProps(dispatch) {
    return {
        checkLolAccount: function(summonerName, region){
            return dispatch(checkLolAccount(summonerName, region));
        }
    }
}
function mapStateToProps(reduxState) {
    return {
        user: reduxState.user,
        isLogged: reduxState.isLogged
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Play);