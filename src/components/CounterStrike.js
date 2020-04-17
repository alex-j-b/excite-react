//React
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
//Redux
import { connect } from "react-redux";
import {
    loggedInCheck,
    confirmCsgoAccount,
    addCsgoBet
} from "../actions";
//libs
import { isEqual } from 'lodash';
import Select from 'react-select';
import ImageFadeIn from 'react-image-fade-in';
//Components
import SwitchPlay from '../components/SwitchPlay';
import DotsLoader from '../components/DotsLoader';
//Images
import ecoin from "../images/e-coin.png";
import csgoPolice from "../images/csgo-police.png";
import steamLogo from "../images/steam-logo.png";


const ecoinOptions = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' }
]

const CustomSingleValue = ({ data }) => (
    <div className="input-select">
        <div className="input-select__single-value">
            <span className="number">{data.label}</span>
            <span className="input-select__icon"><img className="ecoin" src={ecoin} alt="ecoin"></img></span>
        </div>
    </div>
);


class CounterStrike extends Component {
    onChange = this.onChange.bind(this);
    handleEnter = this.handleEnter.bind(this);
    selectChange = this.selectChange.bind(this);
    onSwitch = this.onSwitch.bind(this);
    steamLogin = this.steamLogin.bind(this);
    confirmCsgoAccount = this.confirmCsgoAccount.bind(this);
    addCsgoBet = this.addCsgoBet.bind(this);
    state = {
        ecoinOption: 5,
        steamId64: false,
        authenticationCode: '',
        lastMatchToken: '',
        defaultEcoinOption: undefined,
        multiplayer: false,
        betIsPending: false,
        loading: false
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    selectChange(name, value) {
        this.setState({ [name]: value });
    }

    onSwitch() {
        this.setState({ multiplayer: !this.state.multiplayer });
    }

    steamLogin() {
        const openIdUrl = `https://steamcommunity.com/openid/login?openid.ns=http://specs.openid.net/auth/2.0&openid.mode=checkid_setup&openid.return_to=http://192.168.1.90:3000/jouer?game=counterstrikego&openid.realm=http://192.168.1.90:3000/&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select&openid.identity=http://specs.openid.net/auth/2.0/identifier_select`;
        window.open(openIdUrl, '_self');
    }

    confirmCsgoAccount() {
        const { steamId64, authenticationCode, lastMatchToken } = this.state;
        this.refs.errorInputToken.style.display = "none";
        if (steamId64 === '' || authenticationCode === '' || lastMatchToken === '') {
            this.refs.errorInputToken.style.display = "inline";
        }
        else {
            this.setState({ loading: true });
            this.props.confirmCsgoAccount(steamId64, authenticationCode, lastMatchToken).then(response => {
                this.setState({ loading: false });
                if (response.statusCode === 500) {
                    this.refs.errorInputToken.style.display = "inline";
                }
            });
        }
    }

    addCsgoBet() {
        this.setState({ loading: true });
        this.props.addCsgoBet(this.state.ecoinOption);
    }

    handleEnter(e) {
        if (this.props.display && e.keyCode === 13) {
            if (this.props.accountConfirmed) {
                this.addCsgoBet();
            }
            else {
                !this.state.steamId64 ? this.steamLogin() : this.confirmCsgoAccount();
            }
        }
    }

    componentDidUpdate(prevProps) {
        const prevBets = prevProps.pendingBets;
        const thisBets = this.props.pendingBets;
        if (!isEqual(prevBets, thisBets)) {
            if ("counterstrikego" in thisBets && !isEqual(prevBets.counterstrikego, thisBets.counterstrikego)) {
                const ecoinValue = this.props.pendingBets.counterstrikego.ecoin.toString();
                const optionIndex = ecoinOptions.findIndex(option => option.value === ecoinValue);
                this.setState({
                    loading: false,
                    betIsPending: true,
                    defaultEcoinOption: ecoinOptions[optionIndex]
                });
                console.log('ecoinOptions: ', ecoinOptions[optionIndex])
                this.refs.buttonCsgoBet.disabled = true;
                this.refs.notifCsgoBet.style.display = 'inline';
                const countDown = () => {
                    const timestamp = thisBets.counterstrikego.timestamp;
                    const timeRemaining = 1800 - ((Date.now() - timestamp) / 1000);
                    if (timeRemaining < 0) {
                        this.refs.notifCsgoBet.innerHTML = 'Pari en cours...';
                    }
                    else {
                        const hour = Math.floor(timeRemaining / 3600);
                        const hourString = hour > 0 ? `${hour}h` : '';
                        const min = Math.floor(timeRemaining % 3600 / 60);
                        const minString = min > 0 ? `${min}min` : '';
                        this.refs.countDown.innerHTML = hourString + minString;
                    }
                }
                countDown();
                window.intervalCsgoBet = setInterval(() => {
                    countDown();
                }, 60000);
            }
            else if ("counterstrikego" in prevBets && !("counterstrikego" in thisBets)) {
                this.setState({ betIsPending: false, defaultEcoinOption: undefined });
                this.props.loggedInCheck();
                this.refs.buttonCsgoBet.disabled = false;
                this.refs.notifCsgoBet.style.display = 'none';
                clearInterval(window.intervalCsgoBet);
            }
        }
    }

    componentDidMount() {
        if (window.location.href.includes('openid')) {
            const steamId64Params = 'openid.claimed_id';
            const regex = new RegExp('[?&]' + steamId64Params + '(=([^&#]*)|&|#|$)');
            const results = regex.exec(window.location.href);
            let steamId64 = decodeURIComponent(results[2].replace(/\+/g, ' '));
            steamId64 = steamId64.split('/');
            steamId64 = steamId64[steamId64.length-1];

            this.setState({ steamId64: steamId64 });
            this.props.history.push({
                pathname: '/jouer',
                search: '?game=counterstrikego'
            });
        }

        const thisBets = this.props.pendingBets;
        if ("counterstrikego" in thisBets) {
            const ecoinValue = this.props.pendingBets.counterstrikego.ecoin.toString();
            const optionIndex = ecoinOptions.findIndex(option => option.value === ecoinValue);
            this.setState({
                loading: false,
                betIsPending: true,
                defaultEcoinOption: ecoinOptions[optionIndex]
            });
            this.refs.buttonCsgoBet.disabled = true;
            this.refs.notifCsgoBet.style.display = 'inline';
            const countDown = () => {
                const timestamp = thisBets.counterstrikego.timestamp;
                const timeRemaining = 1800 - ((Date.now() - timestamp) / 1000);
                if (timeRemaining < 0) {
                    this.refs.notifCsgoBet.innerHTML = 'Pari en cours...';
                }
                else {
                    const hour = Math.floor(timeRemaining / 3600);
                    const hourString = hour > 0 ? `${hour}h` : '';
                    const min = Math.floor(timeRemaining % 3600 / 60);
                    const minString = min > 0 ? `${min}min` : '';
                    this.refs.countDown.innerHTML = hourString + minString;
                }
            }
            countDown();
            window.intervalCsgoBet = setInterval(() => {
                countDown();
            }, 60000);
        }
        document.addEventListener("keydown", this.handleEnter, false);
    }

    componentWillUnmount() {
        if (this.props.accountConfirmed) {
            this.refs.buttonCsgoBet.disabled = false;
            this.refs.notifCsgoBet.style.display = 'none';
            clearInterval(window.intervalCsgoBet);
        }
        document.removeEventListener("keydown", this.handleEnter, false);
    }

    render() {
        const cote = this.state.multiplayer ? 2 : 1.8;
        return (
            <div className="wrap-counterstrikego" style={{ display: this.props.display ? 'flex' : 'none' }}>
                <div className="left">
                    {this.props.imageReady && <ImageFadeIn src={csgoPolice} />}
                </div>
                <div className="right">
                    <SwitchPlay
                        display={this.props.accountConfirmed}
                        multiplayer={this.state.multiplayer}
                        onSwitch={this.onSwitch}
                    />
                    <p className="title"><span className="purple">C</span>ounter Strike GO</p>

                    { this.props.accountConfirmed ?
                        <>
                        <Select
                            className="select-ecoin"
                            options={ecoinOptions}
                            defaultValue={ecoinOptions[0]}
                            value={this.state.defaultEcoinOption}
                            components={{ SingleValue: CustomSingleValue }}
                            blurInputOnSelect={true}
                            isSearchable={false}
                            isDisabled={this.state.betIsPending}
                            onChange={obj => this.selectChange('ecoinOption', obj.value)}
                        />
                        <div>
                            <span className="goal-price">
                                { !this.state.multiplayer && 'Gagne un match compétitif :' }
                                { this.state.multiplayer && 'Gagne une match privée entre joueurs Excite :' }
                                &nbsp;<span className="number">{this.state.ecoinOption * cote}</span>
                                <img className="ecoin" src={ecoin} alt="ecoin"></img>
                            </span>
                        </div>
                        <button 
                            className="e-button"
                            ref="buttonCsgoBet"
                            onClick={this.addCsgoBet}
                            >Parier
                        </button>
                        <DotsLoader loading={this.state.loading} />
                        <p ref="notifCsgoBet" className="notif">
                            Pari en cours... il vous reste&nbsp;
                            <span ref="countDown"></span>&nbsp;
                            pour rejoindre un match compétitif
                        </p>
                        </>
                        :
                        ( !this.state.steamId64 ?
                            <button 
                                className="e-button steam-login"
                                onClick={this.steamLogin}
                                >Connexion Steam
                                <img src={steamLogo} alt="steamLogo"></img>
                            </button>
                        :
                            <>
                            <div className="confirm-inputs">
                                <div>
                                    <label htmlFor="authenticationCode">
                                        <span>Code d'Authentification</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Code d'Authentification"
                                        name="authenticationCode"
                                        onChange={this.onChange}
                                        value={this.state.authenticationCode}
                                        spellCheck={false}
                                        required
                                    ></input>
                                </div>

                                <div>
                                    <label htmlFor="lastMatchToken">
                                        <span>Jeton du dernier match</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Jeton du dernier match"
                                        name="lastMatchToken"
                                        onChange={this.onChange}
                                        value={this.state.lastMatchToken}
                                        spellCheck={false}
                                        required
                                    ></input>
                                </div>
                            </div>

                            <div className="confirm-instructions">
                                <p>Afin de partager votre historique, veuillez créer un code d'authentification :
                                    <a href="https://help.steampowered.com/fr/wizard/HelpWithGameIssue/?appid=730&issueid=128" target="_blank" rel="noopener noreferrer"> help.steampowered.com/fr/wizard...</a>
                                </p>
                            </div>

                            <button className="e-button" onClick={this.confirmCsgoAccount}>Valider</button>
                            <p ref="errorInputToken" className="error-input wrong-code-jeton">Code ou Jeton invalide</p>
                            <DotsLoader loading={this.state.loading}/>
                            </>
                        )
                    }
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        confirmCsgoAccount: function (steamId64, authenticationCode, lastMatchToken) {
            return dispatch(confirmCsgoAccount(steamId64, authenticationCode, lastMatchToken));
        },
        addCsgoBet: function (ecoin) {
            dispatch(addCsgoBet(ecoin));
        },
        loggedInCheck: function () {
            dispatch(loggedInCheck());
        }
    }
}
function mapStateToProps(reduxState) {
    return {
        pendingBets: reduxState.pendingBets
    };
}
CounterStrike = withRouter(CounterStrike);
export default connect(mapStateToProps, mapDispatchToProps)(CounterStrike);