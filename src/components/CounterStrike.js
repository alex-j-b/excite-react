//React
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
//Redux
import { connect } from "react-redux";
import {
    loggedInCheck,
    confirmCsgoAccount,
    addCsgoBet,
    joinCsgoQueue
} from "../actions";
//libs
import { onBetPending, offBetPending } from '../libs/betPending';
import { odds } from '../libs/infos';
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
    onBetPending = onBetPending.bind(this);
    offBetPending = offBetPending.bind(this);
    state = {
        ecoinOption: 5,
        steamId64: false,
        authenticationCode: '',
        lastMatchToken: '',
        defaultEcoinOption: undefined,
        multiplayer: false,
        type: 'csgo-5v5-competitive-solo',
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
        const type = this.state.multiplayer ? 'csgo-5v5-competitive-solo' : 'csgo-5v5-private-solo';
        this.setState({
            multiplayer: !this.state.multiplayer,
            type: type
        });
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
        this.refs.reponseError.style.display = 'none';

        if (!this.state.multiplayer) {
            this.setState({ loading: true });
            this.props.addCsgoBet(
                this.state.type,
                this.state.ecoinOption
            );
        }
        else {
            //Join queue
            if (!this.state.searching) {
                this.setState({ searching: true });
                this.refs.notifCsgoSearch.style.display = 'inline';
                this.refs.notifCsgoEstimation.style.display = 'inline';
                this.refs.buttonCsgoBet.innerHTML = 'Annuler';
                this.refs.buttonCsgoBet.classList.add('grey');
                let start;
                window.intervalCsgoBet = setInterval(() => {
                    if (!start) {
                        start = new Date();
                        start.setSeconds(start.getSeconds() - 1);
                    }
                    const now = new Date();
                    const diff = new Date(now - start);
                    let min = diff.getMinutes();
                    min = min > 9 ? min : '0' + min;
                    let sec = diff.getSeconds();
                    sec = sec > 9 ? sec : '0' + sec;
                    this.refs.chrono.innerHTML = `${min}:${sec}`;
                }, 1000);

                joinCsgoQueue(this.state.type, this.state.ecoinOption).then(response => {
                    if (response.statusCode === 500) {
                        this.refs.reponseError.style.display = 'inline';
                        this.refs.reponseError.innerHTML = response.body.error;

                        this.setState({ searching: false });
                        this.refs.notifCsgoSearch.style.display = 'none';
                        this.refs.notifCsgoEstimation.style.display = 'none';
                        this.refs.buttonCsgoBet.innerHTML = 'Parier';
                        this.refs.buttonCsgoBet.classList.remove('grey');
                        this.refs.chrono.innerHTML = '00:00';
                        clearInterval(window.intervalCsgoBet);
                    }
                })
            }
            else {
                joinCsgoQueue(false, false);
                this.setState({ searching: false });
                this.refs.notifCsgoSearch.style.display = 'none';
                this.refs.notifCsgoEstimation.style.display = 'none';
                this.refs.buttonCsgoBet.innerHTML = 'Parier';
                this.refs.buttonCsgoBet.classList.remove('grey');
                this.refs.chrono.innerHTML = '00:00';
                clearInterval(window.intervalCsgoBet);
            }
        }
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
                this.onBetPending('counterstrikego', thisBets.counterstrikego);
            }
            else if ("counterstrikego" in prevBets && !("counterstrikego" in thisBets)) {
                this.offBetPending('counterstrikego');
            }
        }

        const prevQueue = prevProps.queue;
        const thisQueue = this.props.queue;
        if (!isEqual(prevQueue, thisQueue)) {
            this.setState({
                searching: true,
                multiplayer: true,
                type: 'csgo-5v5-private-solo'
            });
            this.refs.notifCsgoSearch.style.display = 'inline';
            this.refs.notifCsgoEstimation.style.display = 'inline';
            this.refs.buttonCsgoBet.innerHTML = 'Annuler';
            this.refs.buttonCsgoBet.classList.add('grey');
            let start;
            window.intervalCsgoBet = setInterval(() => {
                if (!start) {
                    start = new Date(this.props.queue.timestamp);
                    start.setSeconds(start.getSeconds() - 1);
                }
                const now = new Date();
                const diff = new Date(now - start);
                let min = diff.getMinutes();
                min = min > 9 ? min : '0' + min;
                let sec = diff.getSeconds();
                sec = sec > 9 ? sec : '0' + sec;
                this.refs.chrono.innerHTML = `${min}:${sec}`;
            }, 1000);
        }
    }

    componentDidMount() {
        const thisBets = this.props.pendingBets;
        if ("counterstrikego" in thisBets) {
            this.onBetPending('counterstrikego', thisBets.counterstrikego);
        }

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

        document.addEventListener('keydown', this.handleEnter, false);
    }

    componentWillUnmount() {
        if (this.props.accountConfirmed) {
            this.refs.buttonCsgoBet.disabled = false;
            this.refs.notifCsgoBet.style.display = 'none';
            clearInterval(window.intervalCsgoBet);
        }

        document.removeEventListener('keydown', this.handleEnter, false);
    }

    render() {
        return (
            <div className="wrap-counterstrikego" style={{ display: this.props.display ? 'flex' : 'none' }}>
                <div className="left">
                    {this.props.imageReady && <ImageFadeIn src={csgoPolice} />}
                </div>
                <div className="right">
                    <SwitchPlay
                        display={this.props.accountConfirmed}
                        disabled={this.state.searching || this.state.betIsPending}
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
                                { this.state.multiplayer && 'Gagne un match privée entre joueurs Excite :' }
                                &nbsp;<span className="number">{this.state.ecoinOption * odds[this.state.type]}</span>
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
                        <p ref="reponseError" className="error-input"></p>
                        <p ref="notifCsgoBet" className="notif">
                            Pari en cours... il vous reste&nbsp;
                            <span ref="countDown"></span>&nbsp;
                            pour rejoindre un match compétitif
                        </p>

                        <p ref="notifCsgoEstimation" className="notif">Estimation : 05:21</p>
                        <p ref="notifCsgoSearch" className="notif search">Recherche d'une partie...<span ref="chrono">00:00</span></p>

                        <p ref="notifGameFound" className="notif">Partie trouvée !</p>
                        <p ref="notifCsgoCreation" className="notif">En cours de création...</p>

                        <p ref="notifCsgoSvInfo" className="notif">Rejoignez Excite #2&nbsp;&nbsp;Mdp : 789625</p>

                        <p ref="notifCsgoConsole" className="notif">
                            Ou via la console :<br/>
                            connect 35.177.187.64:27010; password 789625
                        </p>

                        <p ref="notifDiscord" className="notif">Une question ? venez sur&nbsp;
                            <a 
                                ref="discordLink"
                                className="grey-link"
                                title="Où cà ?"
                                href="https://discord.gg/q2an7Sk"
                                target="_blank"
                                rel="noopener noreferrer"
                                >Discord
                            </a>
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
        confirmCsgoAccount: function(steamId64, authenticationCode, lastMatchToken) {
            return dispatch(confirmCsgoAccount(steamId64, authenticationCode, lastMatchToken));
        },
        addCsgoBet: function(type, ecoin) {
            dispatch(addCsgoBet(type, ecoin));
        },
        loggedInCheck: function() {
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