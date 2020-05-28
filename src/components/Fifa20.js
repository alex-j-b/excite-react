//React
import React, { Component } from "react";
//Redux
import { connect } from "react-redux";
import {
    loggedInCheck,
    confirmFifa20Account,
    joinFifa20Queue,
    updateBetLost,
    addScreenshot
} from "../actions";
//libs
import { onBetPending, offBetPending } from '../libs/betPending';
import { odds } from '../libs/infos';
import { toBase64 } from '../libs/toBase64';
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
    onImageUpload = this.onImageUpload.bind(this);
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
        popUpBetWin: false,
        popUpBetLost: false,
        uploadLoading: false,
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
                console.log(response);
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
        else if (true) {
            this.setState({ searching: false });
            this.refs.notifFifa20Search.style.display = 'none';
            this.refs.notifFifa20Estimation.style.display = 'none';

            this.refs.buttonFifa20Bet.style.display = 'none';
            this.refs.buttonFifa20Bet.innerHTML = 'Parier';
            this.refs.buttonFifa20Bet.classList.remove('grey');

            this.refs.chrono.innerHTML = '00:00';
            clearInterval(window.intervalFifa20Bet);

            this.refs.notifGameFound.style.display = 'inline';
            this.refs.notifFifa20Screenshot.style.display = 'inline';
            this.refs.notifFifa20Opponent.style.display = 'inline';
            this.refs.notifFifa20Opponent.innerHTML = `Ajoutez et Affrontez ${'bet.opponentAccountId'}`;

            this.refs.notifDiscord.style.display = 'inline';
            this.refs.discordLink.style.display = 'inline';
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

    togglePopUp(popUpType) {
        this.setState({ [popUpType]: !this.state[popUpType] });
    }

    betLost() {
        this.setState({
            loading: true,
            popUpBetLost: false
        });
        console.log(this.props.pendingBets.fifa20.betId)
        this.props.updateBetLost('fifa20', this.props.pendingBets.fifa20.betId).then(response => {
            this.setState({ loading: false });
        });
    }

    async onImageUpload() {
        const file = this.refs.uploadInput.files[0];
        console.log('file:', file)
        if (file) {
            const size = ((file.size/1024)/1024).toFixed(4);
            console.log('size:', size)

            if (size > 5) {
                this.refs.popUpError.style.display = 'inline';
                this.refs.popUpError.innerHTML = 'Fichier trop gros (5MB max)';
                return;
            }

            this.refs.popUpError.style.display = 'none';
            this.setState({ uploadLoading: true });

            const userId = this.props.user.sub;
            const betId = this.props.pendingBets.fifa20.betId;
            const fileExtension = file.name.split('.').pop();
            const name = `${userId}_${betId}.${fileExtension}`;
            const fileBase64 = await toBase64(file);

            const fileObj = {
                name: name,
                base64: fileBase64,
                type: file.type,
            };
            this.props.addScreenshot(betId, 'fifa20', fileObj).then(response => {
                this.setState({ uploadLoading: false });
                if (response.statusCode === 500) {
                    this.refs.popUpError.style.display = 'inline';
                    this.refs.popUpError.innerHTML = response.body.error;
                }
                else {
                    this.setState({ popUpBetWin: false });
                }
            })
        }
        else {
            this.refs.popUpError.style.display = 'inline';
            this.refs.popUpError.innerHTML = 'Veuillez sélectionner un fichier';
        }
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


                            <div>
                                <button ref="buttonFifa20Win" className="yes" onClick={() => this.togglePopUp('popUpBetWin')}>Gagné</button>
                                <button ref="buttonFifa20Lose" className="no" onClick={() => this.togglePopUp('popUpBetLost')}>Perdu</button>
                            </div>
                            <Popup
                                open={this.state.popUpBetWin}
                                contentStyle={{ width: 'fit-content' }}
                                closeOnDocumentClick
                            >
                                <div className="yes-no-popup">
                                    <div className="close" onClick={() => this.togglePopUp('popUpBetWin')}>
                                        &times;
                                    </div>
                                    <p>Afin de confirmer votre <b>victoire</b>, veuillez envoyer une photo ou capture d'écran du résultat du match.</p>
                                    <p>Vos eCoins vous seront envoyés rapidement.</p>
                                    <div className="wrap-buttons">
                                        <input
                                            ref="uploadInput"
                                            id="file-input"
                                            type="file"
                                            accept="image/*"
                                        />
                                        <button className="e-button" onClick={this.onImageUpload}>Envoyer</button>
                                        <DotsLoader loading={this.state.uploadLoading} />
                                        <p ref="popUpError" className="error-input"></p>
                                    </div>
                                </div>
                            </Popup>
                            <Popup
                                open={this.state.popUpBetLost}
                                contentStyle={{ width: 'fit-content' }}
                                closeOnDocumentClick
                            >
                                <div className="yes-no-popup">
                                    <div className="close" onClick={() => this.togglePopUp('popUpBetLost')}>
                                        &times;
                                    </div>
                                    <p>Voulez-vous vraiment confirmer votre <b>défaite</b> ?</p>
                                    <div className="wrap-buttons">
                                        <button className="yes" type="button" onClick={this.betLost}>Oui</button>
                                        <button className="no" type="button" onClick={() => this.togglePopUp('popUpBetLost')}>Non</button>
                                    </div>
                                </div>
                            </Popup>

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
                            <p ref="notifFifa20Opponent" className="notif"></p>
                            <p ref="notifFifa20Screenshot" className="notif">En cas de victoire n'oubliez pas de prendre une photo ou capture d'écran du résultat du match</p>

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
        addScreenshot: function(betId, game, file) {
            return dispatch(addScreenshot(betId, game, file));
        },
        updateBetLost: function(game, betId) {
            return dispatch(updateBetLost(game, betId));
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