//React
import React, { Component } from "react";
//Redux
import { connect } from "react-redux";
import {
    loggedInCheck,
    confirmFortniteAccount,
    addFortniteBet,
    updateBetLost
} from "../actions";
//libs
import { onBetPending, offBetPending } from '../libs/betPending';
import { odds } from '../libs/infos';
import { isEqual } from 'lodash';
import Select from 'react-select';
import ImageFadeIn from 'react-image-fade-in';
import Popup from "reactjs-popup";
//Components
import SwitchPlay from '../components/SwitchPlay';
import DotsLoader from '../components/DotsLoader';
//Images
import ecoin from "../images/e-coin.png";
import fortniteChar from "../images/fortnite-char.png";

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


class Fortnite extends Component {
    onChange = this.onChange.bind(this);
    handleEnter = this.handleEnter.bind(this);
    selectChange = this.selectChange.bind(this);
    onSwitch = this.onSwitch.bind(this);
    confirmFortniteAccount = this.confirmFortniteAccount.bind(this);
    togglePopUp = this.togglePopUp.bind(this);
    betLost = this.betLost.bind(this);
    addFortniteBet = this.addFortniteBet.bind(this);
    onBetPending = onBetPending.bind(this);
    offBetPending = offBetPending.bind(this);
    state = {
        ecoinOption: 5,
        fortniteId: '',
        defaultEcoinOption: undefined,
        betIsPending: false,
        multiplayer: false,
        type: 'fortnite-top10-BR-solo',
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

    confirmFortniteAccount() {
        const { fortniteId } = this.state;
        this.refs.errorInputId.style.display = 'none';
        if (fortniteId === '') {
            this.refs.errorInputId.style.display = 'inline';
        }
        else {
            this.setState({ loading: true });
            this.props.confirmFortniteAccount(fortniteId).then(response => {
                this.setState({ loading: false });
                if (response.statusCode === 500) {
                    this.refs.errorInputId.style.display = 'inline';
                    this.refs.errorInputId.innerHTML = response.body.error;
                }
            });
        }
    }

    addFortniteBet() {
        this.refs.errorEcoin.style.display = 'none';
        if (Number(this.props.user['custom:ecoin']) >= this.state.ecoinOption) {
            this.setState({ loading: true });
            this.props.addFortniteBet(
                this.state.type,
                this.state.ecoinOption
            );
        }
        else {
            this.refs.errorEcoin.style.display = 'inline';
        }
    }

    togglePopUp() {
        this.setState({ popUpBetLost: !this.state.popUpBetLost });
    }

    betLost() {
        this.setState({
            loading: true,
            popUpBetLost: false
        });
        this.props.updateBetLost('fortnite').then(response => {
            this.setState({ loading: false });
        });
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
                this.onBetPending('fortnite', thisBets.fortnite);
            }
            else if ("fortnite" in prevBets && !("fortnite" in thisBets)) {
                this.offBetPending('fortnite');
            }
        }
    }

    componentDidMount() {
        const thisBets = this.props.pendingBets;
        if ("fortnite" in thisBets) {
            this.onBetPending('fortnite', thisBets.fortnite);
        }
        document.addEventListener("keydown", this.handleEnter, false);
    }

    componentWillUnmount() {
        if (this.props.accountConfirmed) {
            this.refs.buttonFortniteBet.disabled = false;
            this.refs.notifFortniteBet.style.display = 'none';
            this.refs.lostBetLink.style.display = 'none';
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
                    <SwitchPlay
                        display={this.props.accountConfirmed}
                        disabled={true}
                        multiplayer={false}
                        onSwitch={this.onSwitch}
                    />
                    <p className="title"><span className="purple">F</span>ortnite</p>

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
                                <span className="goal-price">Finir top 10 en Battle Royal solo : <span className="number">{this.state.ecoinOption * odds[this.state.type]}</span>
                                    <img className="ecoin" src={ecoin} alt="ecoin"></img>
                                </span>
                            </div>

                            <button ref="buttonFortniteBet" className="e-button" onClick={this.addFortniteBet}>Parier</button>
                            <DotsLoader loading={this.state.loading} />

                            <p ref="errorEcoin" className="error-input not-enough-ecoin">eCoins insuffisant</p>
                            <p ref="lostBetLink" className="grey-link" onClick={this.togglePopUp}>Pari perdu ?</p>
                            <Popup
                                open={this.state.popUpBetLost}
                                contentStyle={{ width: 'fit-content' }}
                                closeOnDocumentClick
                            >
                                <div className="yes-no-popup">
                                    <div className="close" onClick={this.togglePopUp}>
                                        &times;
                                    </div>
                                    <p>Voulez-vous vraiment confirmer votre <b>défaite</b> ?</p>
                                    <p>Cela vous permet de relancer un pari avant que la partie précédente soit terminée</p>
                                    <div className="wrap-buttons">
                                        <button className="yes" type="button" onClick={this.betLost}>Oui</button>
                                        <button className="no" type="button" onClick={this.togglePopUp}>Non</button>
                                    </div>
                                </div>
                            </Popup>
                            
                            <p ref="notifFortniteBet" className="notif">
                                Pari en cours... il vous reste&nbsp;
                                <span ref="countDown"></span>
                                &nbsp;pour rejoindre une partie
                            </p>
                            <p 
                                ref="unconfirmedGameAccount"
                                className="error-input unconfirmed-game-account"
                                style={{ display: `${this.props.isLogged && this.props.user.game_accounts.fortnite.confirmed === 'false' ? 'inline' : 'none'}` }}
                                >Pour commander dans la boutique Excite, ajoutez en ami DarjGG sur Fortnite afin de confirmer votre compte
                            </p>
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

                            <button className="e-button" onClick={this.confirmFortniteAccount}>Valider</button>
                            <DotsLoader loading={this.state.loading} />
                            <p ref="errorInputId" className="error-input wrong-id">ID de compte invalide</p>
                        </>
                    }
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        confirmFortniteAccount: function(summonerName, region) {
            return dispatch(confirmFortniteAccount(summonerName, region));
        },
        addFortniteBet: function(type, ecoin) {
            dispatch(addFortniteBet(type, ecoin));
        },
        updateBetLost: function(game) {
            return dispatch(updateBetLost(game));
        },
        loggedInCheck: function() {
            dispatch(loggedInCheck());
        }
    }
}
function mapStateToProps(reduxState) {
    return {
        pendingBets: reduxState.pendingBets,
        user: reduxState.user,
        isLogged: reduxState.isLogged
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Fortnite);