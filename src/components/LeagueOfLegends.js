//React
import React, { Component } from "react";
//Redux
import { connect } from "react-redux";
import {
    loggedInCheck,
    confirmLolAccount,
    addLolBet
} from "../actions";
//libs
import { WebSocketContext } from '../WebSocket';
import { isEqual } from 'lodash';
import Select from 'react-select';
import ImageFadeIn from 'react-image-fade-in';
//Components
import DotsLoader from '../components/DotsLoader';
import SwitchPlay from '../components/SwitchPlay';
//Images
import ecoin from "../images/e-coin.png";
import riven from "../images/lol-riven.png";
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
            <span className="number">{data.label}</span>
            <span className="input-select__icon"><img className="ecoin" src={ecoin} alt="ecoin"></img></span>
        </div>
    </div>
);

class LeagueOfLegends extends Component {
    onChange = this.onChange.bind(this);
    handleEnter = this.handleEnter.bind(this);
    selectChange = this.selectChange.bind(this);
    onSwitch = this.onSwitch.bind(this);
    confirmLolAccount = this.confirmLolAccount.bind(this);
    addLolBet = this.addLolBet.bind(this);
    static contextType = WebSocketContext;
    state = {
        ecoinOption: 5,
        summonerName: '',
        region: 'euw1',
        defaultEcoinOption: undefined,
        multiplayer: false,
        searching: false,
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

    confirmLolAccount() {
        const { summonerName, region } = this.state;
        this.refs.errorInputIcon.style.display = 'none';
        this.refs.errorInputPseudo.style.display = 'none';
        if (summonerName === '') {
            this.refs.errorInputPseudo.style.display = 'inline';
        }
        else {
            this.setState({ loading: true });
            this.props.confirmLolAccount(summonerName, region).then(response => {
                this.setState({ loading: false });
                if (response.statusCode === 500) {
                    if (response.body.error === 'error bad profileIconId') {
                        this.refs.errorInputIcon.style.display = 'inline';
                    }
                    else {
                        this.refs.errorInputPseudo.style.display = 'inline';
                    }
                }
            });
        }
    }

    addLolBet() {
        if (!this.state.multiplayer) {
            this.setState({ loading: true });
            this.props.addLolBet(this.state.ecoinOption);
        }
        else {
            if (!this.state.searching) {
                this.setState({ searching: true });
                this.refs.notifLolSearch.style.display = 'inline';
                this.refs.notifLolEstimation.style.display = 'inline';
                this.refs.buttonLolBet.innerHTML = 'Annuler';
                this.refs.buttonLolBet.classList.add('grey');
                let start;
                window.intervalLolBet = setInterval(() => {
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
            }
            else {
                if (false) {
                    this.setState({ searching: false });
                    this.refs.notifLolSearch.style.display = 'none';
                    this.refs.notifLolEstimation.style.display = 'none';
                    this.refs.buttonLolBet.innerHTML = 'Parier';
                    this.refs.buttonLolBet.classList.remove('grey');
                    this.refs.chrono.innerHTML = '00:00';
                    clearInterval(window.intervalLolBet);
                }
                else {
                    this.setState({
                        searching: false,
                        betIsPending: true
                    });
                    this.refs.notifLolSearch.style.display = 'none';
                    this.refs.notifLolEstimation.style.display = 'none';
                    this.refs.buttonLolBet.innerHTML = 'Parier';
                    this.refs.buttonLolBet.classList.remove('grey');
                    this.refs.buttonLolBet.disabled = true;
                    this.refs.chrono.innerHTML = '00:00';
                    clearInterval(window.intervalLolBet);

                    this.refs.notifGameFound.style.display = 'inline';
                    this.refs.notifLolTournCode.style.display = 'inline';
                    this.refs.notifLolJoin.style.display = 'inline';
                    this.refs.linkLolHelp.style.display = 'inline';
                    this.refs.notifDiscord.style.display = 'inline';
                    this.refs.discordLink.style.display = 'inline';
                    
                }
            }
        }
    }

    handleEnter(e) {
        if (this.props.display && e.keyCode === 13) {
            if (this.props.accountConfirmed) {
                this.addLolBet();
            }
            else {
                this.confirmLolAccount();
            }
        }
    }

    componentDidUpdate(prevProps) {
        const prevBets = prevProps.pendingBets;
        const thisBets = this.props.pendingBets;
        if (this.props.accountConfirmed && !isEqual(prevBets, thisBets)) {
            if ("leagueoflegends" in thisBets && !isEqual(prevBets.leagueoflegends, thisBets.leagueoflegends)) {
                const ecoinValue = this.props.pendingBets.leagueoflegends.ecoin.toString();
                const optionIndex = ecoinOptions.findIndex(option => option.value === ecoinValue);
                this.setState({
                    loading: false,
                    betIsPending: true,
                    defaultEcoinOption: ecoinOptions[optionIndex]
                });
                this.refs.buttonLolBet.disabled = true;
                this.refs.notifLolBet.style.display = 'inline';
                const countDown = () => {
                    const timestamp = thisBets.leagueoflegends.timestamp;
                    const timeRemaining = 1800 - ((Date.now() - timestamp) / 1000);
                    if (thisBets.leagueoflegends.status === 'playing') {
                        this.refs.notifLolBet.innerHTML = 'Partie en cours... GLHF!';
                    }
                    else if (timeRemaining < 0) {
                        this.refs.notifLolBet.innerHTML = 'Pari en cours...';
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
                window.intervalLolBet = setInterval(() => {
                    countDown();
                }, 60000);
            }
            else if ("leagueoflegends" in prevBets && !("leagueoflegends" in thisBets)) {
                this.setState({ betIsPending: false, defaultEcoinOption: undefined });
                this.props.loggedInCheck();
                this.refs.buttonLolBet.disabled = false;
                this.refs.notifLolBet.style.display = 'none';
                clearInterval(window.intervalLolBet);
            }
        }
    }

    componentDidMount() {
        const thisBets = this.props.pendingBets;
        if ("leagueoflegends" in thisBets) {
            const ecoinValue = this.props.pendingBets.leagueoflegends.ecoin.toString();
            const optionIndex = ecoinOptions.findIndex(option => option.value === ecoinValue);
            this.setState({
                loading: false,
                betIsPending: true,
                defaultEcoinOption: ecoinOptions[optionIndex]
            });
            this.refs.buttonLolBet.disabled = true;
            this.refs.notifLolBet.style.display = 'inline';
            const countDown = () => {
                const timestamp = thisBets.leagueoflegends.timestamp;
                const timeRemaining = 1800 - ((Date.now() - timestamp) / 1000);
                if (thisBets.leagueoflegends.status === 'playing') {
                    this.refs.notifLolBet.innerHTML = 'Partie en cours... GLHF!';
                }
                else if (timeRemaining < 0) {
                    this.refs.notifLolBet.innerHTML = 'Pari en cours...';
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
            window.intervalLolBet = setInterval(() => {
                countDown();
            }, 60000);
        }
        document.addEventListener('keydown', this.handleEnter, false);
    }

    componentWillUnmount() {
        if (this.props.accountConfirmed) {
            this.refs.buttonLolBet.disabled = false;
            this.refs.notifLolBet.style.display = 'none';
            clearInterval(window.intervalLolBet);
        }
        document.removeEventListener('keydown', this.handleEnter, false);
    }

    render() {
        const cote = this.state.multiplayer ? 2 : 1.8;
        return (
            <div className="wrap-leagueoflegends" style={{ display: this.props.display ? 'flex' : 'none' }}>
                <div className="left">
                    {this.props.imageReady && <ImageFadeIn src={riven} />}
                </div>
                <div className="right">
                    <SwitchPlay
                        display={this.props.accountConfirmed}
                        disabled={this.state.searching || this.state.betIsPending}
                        multiplayer={this.state.multiplayer}
                        onSwitch={this.onSwitch}
                    />
                    <p className="title"><span className="purple">L</span>eague of legends</p>

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
                                    { !this.state.multiplayer && 'Gagne une partie classée :' }
                                    { this.state.multiplayer && 'Gagne une partie privée entre joueurs Excite :' }
                                    &nbsp;<span className="number">{this.state.ecoinOption * cote}</span>
                                    <img className="ecoin" src={ecoin} alt="ecoin"></img>
                                </span>
                            </div>
                            <button className="e-button" ref="buttonLolBet" onClick={this.addLolBet}>Parier</button>
                            <DotsLoader loading={this.state.loading} />
                            <p ref="notifLolBet" className="notif">
                                Pari en cours... il vous reste&nbsp;
                                <span ref="countDown"></span>&nbsp;
                                pour rejoindre une partie classée
                            </p>
                            <p ref="notifLolEstimation" className="notif">Estimation : 05:21</p>
                            <p ref="notifLolSearch" className="notif search">Recherche d'une partie...<span ref="chrono">00:00</span></p>

                            <p ref="notifGameFound" className="notif">Partie trouvée ! Entrez le code&nbsp;
                                <a 
                                    ref="linkLolHelp"
                                    className="grey-link"
                                    title="Où cà ?"
                                    href="https://static.developer.riotgames.com/img/docs/lol/tournament-client.png"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    >ici
                                </a>
                            </p>
                            <p ref="notifLolTournCode" className="notif">EUW5043-TOURNAMENTCODE0001</p>
                            <p ref="notifLolJoin" className="notif">Puis rejoignez l'équipe de gauche</p>

                            <p ref="notifDiscord" className="notif">Une question ? venez sur&nbsp;
                                <a 
                                    ref="discordLink"
                                    className="grey-link"
                                    title="Où cà ?"
                                    href="https://static.developer.riotgames.com/img/docs/lol/tournament-client.png"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    >Discord
                                </a>
                            </p>
                        </>
                        :
                        <>
                            <div className="confirm-inputs">
                                <div>
                                    <label htmlFor="summonerName">
                                        <span>Nom d'invocateur</span>
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
                                        <span>Région</span>
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

                            <div className="confirm-instructions">
                                <img src={lolPotion} alt="lol-potion"></img>
                                <p>Veuillez changer votre icon afin de valider votre compte</p>
                            </div>

                            <button className="e-button" onClick={this.confirmLolAccount}>Valider</button>
                            <p ref="errorInputPseudo" className="error-input wrong-pseudo-region">Nom d'invocateur ou région invalide</p>
                            <p ref="errorInputIcon" className="error-input wrong-icon">Veuillez changer votre icon</p>
                            <DotsLoader loading={this.state.loading} />
                        </>
                    }
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        confirmLolAccount: function (summonerName, region) {
            return dispatch(confirmLolAccount(summonerName, region));
        },
        addLolBet: function (ecoin) {
            dispatch(addLolBet(ecoin));
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
export default connect(mapStateToProps, mapDispatchToProps)(LeagueOfLegends);