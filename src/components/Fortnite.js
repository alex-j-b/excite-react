//React
import React, { Component } from "react";
//Redux
import { connect } from "react-redux";
import {
    loggedInCheck,
    confirmFortniteAccount,
    addFortniteBet,
    getFortniteBets
} from "../actions";
//libs
import { isEqual } from 'lodash';
import Select from 'react-select';
import ImageFadeIn from 'react-image-fade-in';
import DotsLoader from '../components/DotsLoader';
//Images
import ecoin from "../images/e-coin.png";
import fortniteChar from "../images/fortnite-char.png";

const ecoinOptions = [
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '50', label: '50' }
]

const CustomSingleValue = ({ data }) => (
    <div className="input-select">
        <div className="input-select__single-value">
            <span className="number">{data.label}</span>
            <span className="input-select__icon"><img className="ecoin" src={ecoin} alt="ecoin"></img></span>
        </div>
    </div>
);


class Fortnite extends Component {
    onChange = this.onChange.bind(this);
    handleEnter = this.handleEnter.bind(this);
    selectChange = this.selectChange.bind(this);
    confirmFortniteAccount = this.confirmFortniteAccount.bind(this);
    addFortniteBet = this.addFortniteBet.bind(this);
    state = {
        ecoinOption: '5',
        fortniteId: '',
        defaultEcoinOption: undefined,
        betIsPending: false,
        loading: false
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    selectChange(name, value) {
        this.setState({ [name]: value });
    }

    confirmFortniteAccount() {
        const { fortniteId } = this.state;
        this.refs.errorInputId.style.display = "none";
        if (fortniteId === '') {
            this.refs.errorInputId.style.display = "inline";
        }
        else {
            this.setState({ loading: true });
            this.props.confirmFortniteAccount(fortniteId).then(response => {
                this.setState({ loading: false });
                if (response.statusCode === 500) this.refs.errorInputId.style.display = "inline";
            });
        }
    }

    addFortniteBet() {
        this.setState({ loading: true });
        this.props.addFortniteBet(this.state.ecoinOption);
    }

    handleEnter(e) {
        if (this.props.display && e.keyCode === 13) {
            if (this.props.accountConfirmed) {
                this.addFortniteBet();
            }
            else {
                this.confirmFortniteAccount();
            }
        }
    }

    componentDidUpdate(prevProps) {
        const prevBets = prevProps.pendingBets;
        const thisBets = this.props.pendingBets;
        if (!isEqual(prevBets, thisBets)) {
            if ("fortnite" in thisBets && !isEqual(prevBets.fortnite, thisBets.fortnite)) {
                const ecoinValue = this.props.pendingBets.fortnite.ecoinBet.toString();
                const optionIndex = ecoinOptions.findIndex(option => option.value === ecoinValue);
                this.setState({
                    loading: false,
                    betIsPending: true,
                    defaultEcoinOption: ecoinOptions[optionIndex]
                });
                this.refs.buttonFortniteBet.disabled = true;
                this.refs.notifFortniteBet.style.display = 'inline';
                const countDown = () => {
                    const timestamp = thisBets.fortnite.timestamp;
                    const timeRemaining = 600 - ((Date.now() - timestamp) / 1000);
                    if (timeRemaining < 0) {
                        this.refs.notifFortniteBet.innerHTML = 'Pari en cours...';
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
                window.intervalFortniteBet = setInterval(() => {
                    countDown();
                    this.props.getFortniteBets();
                }, 60000);
            }
            else if ("fortnite" in prevBets && !("fortnite" in thisBets)) {
                this.setState({ betIsPending: false, defaultEcoinOption: undefined });
                this.props.loggedInCheck();
                this.refs.buttonFortniteBet.disabled = false;
                this.refs.notifFortniteBet.style.display = 'none';
                clearInterval(window.intervalFortniteBet);
            }
        }
    }

    componentDidMount() {
        const thisBets = this.props.pendingBets;
        if ("fortnite" in thisBets) {
            const ecoinValue = this.props.pendingBets.fortnite.ecoinBet.toString();
            const optionIndex = ecoinOptions.findIndex(option => option.value === ecoinValue);
            this.setState({
                loading: false,
                betIsPending: true,
                defaultEcoinOption: ecoinOptions[optionIndex]
            });
            this.refs.buttonFortniteBet.disabled = true;
            this.refs.notifFortniteBet.style.display = 'inline';
            const countDown = () => {
                const timestamp = thisBets.fortnite.timestamp;
                const timeRemaining = 600 - ((Date.now() - timestamp) / 1000);
                if (timeRemaining < 0) {
                    this.refs.notifFortniteBet.innerHTML = 'Pari en cours...';
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
            window.intervalFortniteBet = setInterval(() => {
                countDown();
                this.props.getFortniteBets();
            }, 60000);
        }
        document.addEventListener("keydown", this.handleEnter, false);
    }

    componentWillUnmount() {
        if (this.props.accountConfirmed) {
            this.refs.buttonFortniteBet.disabled = false;
            this.refs.notifFortniteBet.style.display = 'none';
            clearInterval(window.intervalFortniteBet);
        }
        document.removeEventListener("keydown", this.handleEnter, false);
    }

    render() {
        return (
            <div className="wrap-fortnite" style={{ display: this.props.display ? 'flex' : 'none' }}>
                <div className="left">
                    { this.props.imageReady && <ImageFadeIn src={fortniteChar} /> }
                </div>
                <div className="right">
                    <h1><span className="purple">F</span>ortnite</h1>

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
                                <span className="goal-price">Finir top 10 en Battle Royal solo : <span className="number">{this.state.ecoinOption * 2}</span>
                                    <img className="ecoin" src={ecoin} alt="ecoin"></img>
                                </span>
                            </div>
                            <button ref="buttonFortniteBet" onClick={this.addFortniteBet}>Parier</button>
                            <p ref="notifFortniteBet" className="notif">
                                Pari en cours... il vous reste&nbsp;
                                <span ref="countDown"></span>
                                &nbsp;pour rejoindre une partie
                            </p>
                            <DotsLoader loading={this.state.loading} />
                        </>
                        :
                        <>
                            <div className="confirm-inputs">
                                <div>
                                <p>(PC, xbox et ps4 seulement)</p>
                                    <label htmlFor="fortniteId">
                                        <span>ID de votre compte</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="ID de votre compte"
                                        name="fortniteId"
                                        onChange={this.onChange}
                                        value={this.state.fortniteId}
                                        spellCheck={false}
                                        required
                                    ></input>
                                </div>
                            </div>

                            <div className="confirm-instructions">
                                <p>L'ID de votre compte se trouve sur le site d'epic games :
                                    <a href="https://www.epicgames.com/account/personal" target="_blank" rel="noopener noreferrer"> epicgames.com/account...</a>
                                </p>
                            </div>

                            <button onClick={this.confirmFortniteAccount}>Valider</button>
                            <p ref="errorInputId" className="error-input wrong-id">ID de compte invalide</p>
                            <DotsLoader loading={this.state.loading} />
                        </>
                    }
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        confirmFortniteAccount: function (summonerName, region) {
            return dispatch(confirmFortniteAccount(summonerName, region));
        },
        addFortniteBet: function (ecoinBet) {
            dispatch(addFortniteBet(ecoinBet));
        },
        getFortniteBets: function () {
            dispatch(getFortniteBets());
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
export default connect(mapStateToProps, mapDispatchToProps)(Fortnite);