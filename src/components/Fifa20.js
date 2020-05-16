//React
import React, { Component } from "react";
//Redux
import { connect } from "react-redux";
import {
    loggedInCheck,
    confirmFifa20Account,
    joinFifa20Queue
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
import fifa20Zizou from "../images/fifa20-zizou.png";

const ecoinOptions = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' }
]

const fifaPlateformsOptions = [
    { value: 'ps4', label: 'PS4', placeholder: 'PSN ID' },
    { value: 'xbox', label: 'Xbox', placeholder: 'Gamertag' },
    { value: 'pc', label: 'PC', placeholder: 'EA ID' }
]

const placeholders = {
    ps4: 'PSN ID',
    xbox: 'Gamertag',
    pc: 'EA ID'
}

const CustomSingleValue = ({ data }) => (
    <div className="input-select">
        <div className="input-select__single-value">
            <span className="number">{data.label}</span>
            <span className="input-select__icon"><img className="ecoin" src={ecoin} alt="ecoin"></img></span>
        </div>
    </div>
);


class Fifa20 extends Component {
    onChange = this.onChange.bind(this);
    handleEnter = this.handleEnter.bind(this);
    selectChange = this.selectChange.bind(this);
    onSwitch = this.onSwitch.bind(this);
    confirmFifa20Account = this.confirmFifa20Account.bind(this);
    togglePopUp = this.togglePopUp.bind(this);
    betLost = this.betLost.bind(this);
    addFifa20Bet = this.addFifa20Bet.bind(this);
    onBetPending = onBetPending.bind(this);
    offBetPending = offBetPending.bind(this);
    state = {
        ecoinOption: 5,
        plateform: 'ps4',
        accountId: '',
        defaultEcoinOption: undefined,
        betIsPending: false,
        multiplayer: false,
        type: 'fifa20-1v1-private-solo',
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

    confirmFifa20Account() {
        const { plateform, accountId } = this.state;
        console.log({ plateform, accountId })
        this.refs.errorInputId.style.display = 'none';
        if (accountId === '') {
            this.refs.errorInputId.style.display = 'inline';
        }
        else {
            this.setState({ loading: true });
            this.props.confirmFifa20Account(plateform, accountId).then(response => {
                this.setState({ loading: false });
                if (response.statusCode === 500) {
                    this.refs.errorInputId.style.display = 'inline';
                    this.refs.errorInputId.innerHTML = response.body.error;
                }
            });
        }
    }

    addFifa20Bet() {
        if (!this.state.searching) {
            this.setState({ searching: true });
            this.refs.notifFifa20Search.style.display = 'inline';
            this.refs.notifFifa20Estimation.style.display = 'inline';
            this.refs.buttonFifa20Bet.innerHTML = 'Annuler';
            this.refs.buttonFifa20Bet.classList.add('grey');
            let start;
            window.intervalFifa20Bet = setInterval(() => {
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

            joinFifa20Queue(this.state.type, this.state.ecoinOption).then(response => {
                if (response.statusCode === 500) {
                    this.refs.reponseError.style.display = 'inline';
                    this.refs.reponseError.innerHTML = response.body.error;

                    this.setState({ searching: false });
                    this.refs.notifFifa20Search.style.display = 'none';
                    this.refs.notifFifa20Estimation.style.display = 'none';
                    this.refs.buttonFifa20Bet.innerHTML = 'Parier';
                    this.refs.buttonFifa20Bet.classList.remove('grey');
                    this.refs.chrono.innerHTML = '00:00';
                    clearInterval(window.intervalFifa20Bet);
                }
            })
        }
        else {
            joinFifa20Queue(false, false);
            this.setState({ searching: false });
            this.refs.notifFifa20Search.style.display = 'none';
            this.refs.notifFifa20Estimation.style.display = 'none';
            this.refs.buttonFifa20Bet.innerHTML = 'Parier';
            this.refs.buttonFifa20Bet.classList.remove('grey');
            this.refs.chrono.innerHTML = '00:00';
            clearInterval(window.intervalFifa20Bet);
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
        this.props.updateBetLost('fifa20').then(response => {
            this.setState({ loading: false });
        });
    }

    handleEnter(e) {
        if (this.props.display && e.keyCode === 13) {
            if (this.props.accountConfirmed) {
                this.addFifa20Bet();
            }
            else {
                this.confirmFifa20Account();
            }
        }
    }

    componentDidUpdate(prevProps) {
        const prevBets = prevProps.pendingBets;
        const thisBets = this.props.pendingBets;
        if (!isEqual(prevBets, thisBets)) {
            if ("fifa20" in thisBets && !isEqual(prevBets.fifa20, thisBets.fifa20)) {
                this.onBetPending('fifa20', thisBets.fifa20);
            }
            else if ("fifa20" in prevBets && !("fifa20" in thisBets)) {
                this.offBetPending('fifa20');
            }
        }

        const prevQueue = prevProps.queue;
        const thisQueue = this.props.queue;
        if (!isEqual(prevQueue, thisQueue)) {
            console.log('NEW QUEUE')
            this.setState({
                searching: true,
                multiplayer: true,
                type: 'fifa20-1v1-private-solo',
            });
            this.refs.notifFifa20Search.style.display = 'inline';
            this.refs.notifFifa20Estimation.style.display = 'inline';
            this.refs.buttonFifa20Bet.innerHTML = 'Annuler';
            this.refs.buttonFifa20Bet.classList.add('grey');
            let start;
            window.intervalFifa20Bet = setInterval(() => {
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
        if ("fifa20" in thisBets) {
            this.onBetPending('fifa20', thisBets.fifa20);
        }
        document.addEventListener("keydown", this.handleEnter, false);
    }

    componentWillUnmount() {
        if (this.props.accountConfirmed) {
            this.refs.buttonFifa20Bet.disabled = false;
            this.refs.notifFifa20Bet.style.display = 'none';
            clearInterval(window.intervalFifa20Bet);
        }
        document.removeEventListener("keydown", this.handleEnter, false);
    }

    render() {
        return (
            <div className="wrap-fifa20" style={{ display: this.props.display ? 'flex' : 'none' }}>
                <div className="left">
                    { this.props.imageReady && <ImageFadeIn src={fifa20Zizou} /> }
                </div>
                <div className="right">
                    <SwitchPlay
                        display={this.props.accountConfirmed}
                        disabled={true}
                        multiplayer={true}
                        onSwitch={this.onSwitch}
                    />
                    <p className="title"><span className="purple">F</span>IFA 20</p>

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
                                <span className="goal-price">Gagne un match contre un joueur Excite : <span className="number">{this.state.ecoinOption * odds[this.state.type]}</span>
                                    <img className="ecoin" src={ecoin} alt="ecoin"></img>
                                </span>
                            </div>

                            <button ref="buttonFifa20Bet" className="e-button" onClick={this.addFifa20Bet}>Parier</button>
                            <DotsLoader loading={this.state.loading} />

                            <p ref="reponseError" className="error-input"></p>
                            <p ref="notifFifa20Bet" className="notif">
                                Pari en cours... il vous reste&nbsp;
                                <span ref="countDown"></span>&nbsp;
                                pour rejoindre un match compétitif
                            </p>

                            <p ref="notifFifa20Estimation" className="notif">Estimation : 05:21</p>
                            <p ref="notifFifa20Search" className="notif search">Recherche d'une partie...<span ref="chrono">00:00</span></p>

                            <p ref="notifGameFound" className="notif">Partie trouvée !</p>
                            <p ref="notifFifa20Creation" className="notif">En cours de création...</p>

                            <p ref="notifFifa20SvInfo" className="notif">Rejoignez Excite #2&nbsp;&nbsp;Mdp : 789625</p>

                            <p ref="notifFifa20Console" className="notif">
                                Ou via la console :<br/>
                                connect 35.177.187.64:27010; password 789625
                            </p>

                            <p ref="notifDiscord" className="notif">Une question ? venez sur&nbsp;
                                <a 
                                    ref="discordLink"
                                    className="grey-link"
                                    title="Où cà ?"
                                    href="https://discord.com/channels/704630064242753577/704630064242753580"
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
                                    <label htmlFor="accountId">
                                        <span>Identifiant</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={placeholders[this.state.plateform]}
                                        name="accountId"
                                        onChange={this.onChange}
                                        value={this.state.accountId}
                                        spellCheck={false}
                                        required
                                    ></input>
                                </div>

                                <div>
                                    <label htmlFor="plateformSelect">
                                        <span>Plateforme</span>
                                    </label>
                                    <Select
                                        className="select"
                                        options={fifaPlateformsOptions}
                                        defaultValue={fifaPlateformsOptions[0]}
                                        blurInputOnSelect={true}
                                        isSearchable={false}
                                        onChange={obj => this.selectChange('plateform', obj.value)}
                                    />
                                </div>
                            </div>

                            <button className="e-button" onClick={this.confirmFifa20Account}>Valider</button>
                            <p ref="errorInputId" className="error-input wrong-id">{placeholders[this.state.plateform]} invalide</p>
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
        confirmFifa20Account: function(summonerName, region) {
            return dispatch(confirmFifa20Account(summonerName, region));
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
export default connect(mapStateToProps, mapDispatchToProps)(Fifa20);