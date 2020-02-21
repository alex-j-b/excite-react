//React
import React, { Component } from "react";
//Redux
import { connect } from "react-redux";
import {
    loggedInCheck,
    confirmLolAccount,
    addLolBet,
    getLolBets
} from "../actions";
//libs
import { isEqual } from 'lodash';
import Select from 'react-select';
import ImageFadeIn from 'react-image-fade-in';
import DotsLoader from '../components/DotsLoader';
//Images
import ecoin from "../images/e-coin.png";
import riven from "../images/riven.png";
import lolPotion from "../images/lol-potion.png";

const ecoinOptions = [
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '50', label: '50' }
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
            <span>{data.label}</span>
            <span className="input-select__icon"><img className="ecoin" src={ecoin} alt="ecoin"></img></span>
        </div>
    </div>
);

class LeagueOfLegends extends Component {
    onChange = this.onChange.bind(this);
    confirmLolAccount = this.confirmLolAccount.bind(this);
    addLolBet = this.addLolBet.bind(this);
    state = {
        ecoinOption: '5',
        summonerName: '',
        region: 'euw1',
        betIsPending: false,
        loading: false
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    selectChange(name, value) {
        this.setState({ [name]: value });
    }

    confirmLolAccount() {
        const { summonerName, region } = this.state;
        if (summonerName === '') {
            document.querySelector('.error-input.wrong-pseudo-region').style.display = "inline";
        }
        else {
            this.setState({ loading: true });
            this.props.confirmLolAccount(summonerName, region).then(response => {
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

    addLolBet() {
        this.setState({ loading: true });
        this.props.addLolBet(this.state.ecoinOption);
    }

    componentDidUpdate(prevProps) {
        const prevBets = prevProps.pendingBets;
        const thisBets = this.props.pendingBets;
        if (!isEqual(prevBets, thisBets)) {
            if ("leagueoflegends" in thisBets && !isEqual(prevBets.leagueoflegends, thisBets.leagueoflegends)) {
                this.setState({ loading: false, betIsPending: true });
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
                    this.props.getLolBets();
                }, 60000);
            }
            else if ("leagueoflegends" in prevBets && !("leagueoflegends" in thisBets)) {
                this.setState({ betIsPending: false });
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
            this.setState({ loading: false, betIsPending: true });
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
                this.props.getLolBets();
            }, 60000);
        }
    }

    componentWillUnmount() {
        if (this.props.accountConfirmed) {
            this.refs.buttonLolBet.disabled = false;
            this.refs.notifLolBet.style.display = 'none';
            clearInterval(window.intervalLolBet);
        }
    }

    render() {
        return (
            <div className="wrap-leagueoflegends" style={{ display: this.props.display ? 'flex' : 'none' }}>
                <div className="left">
                    {this.props.imageReady && <ImageFadeIn src={riven} />}
                </div>
                <div className="right">
                    <h1><span className="purple">L</span>eague of legends</h1>

                    {this.props.accountConfirmed ?
                        <>
                            <Select
                                className="select-ecoin"
                                options={ecoinOptions}
                                defaultValue={ecoinOptions[0]}
                                components={{ SingleValue: CustomSingleValue }}
                                blurInputOnSelect={true}
                                isSearchable={false}
                                isDisabled={this.state.betIsPending}
                                onChange={obj => this.selectChange('ecoinOption', obj.value)}
                            />
                            <div>
                                <span className="goal-price">Gagne une partie classée : {this.state.ecoinOption * 2}</span>
                                <img className="ecoin" src={ecoin} alt="ecoin"></img>
                            </div>
                            <button ref="buttonLolBet" onClick={this.addLolBet}>Parier</button>
                            <p ref="notifLolBet" className="notif">Pari en cours... il vous reste <span ref="countDown"></span> pour lancer une partie classée</p>
                            <DotsLoader loading={this.state.loading} />
                        </>
                        :
                        <>
                            <div className="confirm-game-account">
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

                            <div className="confirm-account">
                                <img src={lolPotion} alt="lol-potion"></img>
                                <p>Veuillez changer votre icon afin de valider votre compte</p>
                            </div>

                            <button onClick={this.confirmLolAccount}>Valider</button>
                            <p className="error-input wrong-pseudo-region">Nom d'invocateur ou région invalide</p>
                            <p className="error-input wrong-icon">Veuillez changer votre icon</p>
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
        addLolBet: function (ecoinBet) {
            dispatch(addLolBet(ecoinBet));
        },
        getLolBets: function () {
            dispatch(getLolBets());
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