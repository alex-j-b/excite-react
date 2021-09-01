//React
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "./Play.css";
//Redux
import { connect } from 'react-redux';
import {
    getLolBets,
    getFortniteBets,
    getCsgoBets,
    getFifa20Bets,
    checkQueue
} from '../../redux/actions/gameActions';
//Libs
import { odds, goals, gameNames } from '../../libs/infos';
//Components
import LeagueOfLegends from '../../components/games/LeagueOfLegends';
import Fortnite from '../../components/games/Fortnite';
// import CounterStrike from '../../components/games/CounterStrike';
import Fifa20 from '../../components/games/Fifa20.js';
import CircleLoader from '../../components/loaders/CircleLoader';
//Images
import {
    generalBG,
    lolLogo,
    fortniteLogo,
    //csgoLogo,
    fifa20Logo,
    historyBlack,
    ecoin
} from "../../assets/export.js";


class Play extends Component {
    onChange = this.onChange.bind(this);
    switchTab = this.switchTab.bind(this);
    state = {
        tab: '',
        historyScrollBar: false,
        imageReady: true,
        queue: {}
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    switchTab(e) {
        this.setState({ tab: e.target.name });
        if (e.target.name === 'history') {
            setTimeout(() => {
                this.setState({ historyScrollBar: !this.state.historyScrollBar })
            }, 1)
        }
        else {
            localStorage.setItem('gameTab', e.target.name);
        }
        this.props.history.push(`/jouer?game=${e.target.name}`);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.tab !== nextState.tab) this.setState({ imageReady: false });
        return true;
    }

    componentDidUpdate(prevProps, prevState) {
        if (!this.state.imageReady) this.setState({ imageReady: true });

        if (this.props.isLogged !== prevProps.isLogged) {
            let urlParams = (new URL(document.location)).searchParams;
            let tab = urlParams.get('game') ? urlParams.get('game') : 'leagueoflegends';
            tab = localStorage.getItem('gameTab') && !urlParams.get('game') ? localStorage.getItem('gameTab') : tab;
            this.setState({ tab: tab });
            if (!urlParams.get('game')) {
                this.props.history.push(`/jouer?game=${tab}`);
            }

            this.props.getLolBets();
            this.props.getFortniteBets();
            this.props.getCsgoBets();
            this.props.getFifa20Bets();
            checkQueue().then(response => {
                if (Number(response.statusCode) === 200) {
                    this.setState({ queue: response.body.game });
                    if (tab !== response.body.game) {
                        this.setState({ tab: tab });
                        this.props.history.push(`/jouer?game=${tab}`);
                    }
                }
            })
        }

        if (this.state.tab !== prevState.tab) {
            const displayGameFunc = ({
                leagueoflegends: 'League of legends',
                fortnite: 'Fortnite',
                counterstrikego: 'Counter Strike',
                fifa20: 'Fifa 21',
                history: 'Historique'
            })[this.state.tab] || 'undefined';
            let title = document.querySelector('head > title');
            title.innerHTML = `Excite | ${displayGameFunc}`;
        }
    }

    componentDidMount() {
        if (this.props.isLogged) {
            let urlParams = (new URL(document.location)).searchParams;
            let tab = urlParams.get('game') ? urlParams.get('game') : 'leagueoflegends';
            tab = localStorage.getItem('gameTab') && !urlParams.get('game') ? localStorage.getItem('gameTab') : tab;
            this.setState({ tab: tab });
            if (!urlParams.get('game')) {
                this.props.history.push(`/jouer?game=${tab}`);
            }

            const displayGameFunc = ({
                leagueoflegends: 'League of legends',
                fortnite: 'Fortnite',
                counterstrikego: 'Counter Strike',
                fifa20: 'Fifa 21',
                history: 'Historique'
            })[tab] || 'undefined';

            let title = document.querySelector('head > title');
            title.innerHTML = `Excite | ${displayGameFunc}`;

            this.props.getLolBets();
            this.props.getFortniteBets();
            this.props.getCsgoBets();
            this.props.getFifa20Bets();
            checkQueue().then(response => {
                console.log('checkQueue(): ', response)
                if (Number(response.statusCode) === 200) {
                    const game = response.body.game;
                    let newQueue = this.state.queue;
                    newQueue[game] = response.body;
                    this.setState({ queue: newQueue });
                    if (tab !== game) {
                        tab = game;
                        this.setState({ tab: tab });
                        this.props.history.push(`/jouer?game=${tab}`);
                    }
                }
            })
        }
    }

    render() {
        let betsHistoryList = this.props.betsHistory.map(el => {
            let goal = goals[el.type];
            let netResult = (el.ecoin * odds[el.type]) - el.ecoin;
            let game = gameNames[el.game];
            return (
                <div className={`item ${el.status}`} key={el.betId}>
                    <div className="wrap-date-game">
                        <span className="number">{el.date}</span>
                        <span>{game}</span>
                    </div>
                    <div className="wrap-bet-result">
                        <span>{goal}</span>
                        <span className="number">{el.message + netResult} <img className="ecoin" src={ecoin} alt="ecoin"></img></span>
                    </div>
                </div>
            );
        });
        if (betsHistoryList.length === 0) betsHistoryList = <span>Aucun pari pour l'instant</span>;

        return (
            <div className="play" style={{ backgroundImage: `url(${generalBG})` }}>
                <div>
                    <div className="header">
                        <button
                            className="lol-button"
                            style={{
                                backgroundImage: `url(${lolLogo})`,
                                backgroundColor: `${this.state.tab === 'leagueoflegends' ? '#f9f9f9' : 'transparent'}`
                            }}
                            name="leagueoflegends"
                            onClick={this.switchTab}
                        ></button>
                        <button
                            className="fortnite-button"
                            style={{
                                backgroundImage: `url(${fortniteLogo})`,
                                backgroundColor: `${this.state.tab === 'fortnite' ? '#f9f9f9' : 'transparent'}`
                            }}
                            name="fortnite"
                            onClick={this.switchTab}
                        ></button>
                        {/* <button
                            className="csgo-button"
                            style={{
                                filter: `${this.state.tab === 'counterstrikego' ? '' : 'invert(100%)'}`,
                                backgroundImage: `url(${csgoLogo})`,
                                backgroundColor: `${this.state.tab === 'counterstrikego' ? '#f9f9f9' : 'transparent'}`
                            }}
                            name="counterstrikego"
                            onClick={this.switchTab}
                        ></button> */}

                        <button
                            className="fifa20-button"
                            style={{
                                filter: `${this.state.tab === 'fifa20' ? '' : 'invert(100%)'}`,
                                backgroundImage: `url(${fifa20Logo})`,
                                backgroundColor: `${this.state.tab === 'fifa20' ? '#f9f9f9' : 'transparent'}`
                            }}
                            name="fifa20"
                            onClick={this.switchTab}
                        ></button>

                        { this.props.isLogged &&
                            <Link
                                to={`/ecoin?redirect=${window.location.pathname+window.location.search}`}
                                className="wallet-ecoin"
                            >
                                <span><label>eCoins : </label><span className="number">{this.props.user['custom:ecoin']}</span></span>
                                <img className="ecoin" src={ecoin} alt="ecoin"></img>
                            </Link>
                        }

                        <button
                            className="history-button"
                            style={{
                                filter: `${this.state.tab === 'history' ? '' : 'invert(100%)'}`,
                                backgroundImage: `url(${historyBlack})`,
                                backgroundColor: `${this.state.tab === 'history' ? '#f9f9f9' : 'transparent'}`
                            }}
                            name="history"
                            onClick={this.switchTab}
                        ></button>
                    </div>

                    <CircleLoader loading={!this.props.isLogged}/>
                    { this.props.isLogged &&
                        <>
                        <div className="wrap-games" style={{ display: this.state.tab !== 'history' ? 'flex' : 'none' }}>
                            <LeagueOfLegends
                                display={this.state.tab === 'leagueoflegends'}
                                imageReady={this.state.imageReady}
                                accountConfirmed={this.props.isLogged && 'leagueoflegends' in this.props.user['game_accounts']}
                            />
                            <Fortnite
                                display={this.state.tab === 'fortnite'}
                                imageReady={this.state.imageReady}
                                accountConfirmed={this.props.isLogged && 'fortnite' in this.props.user['game_accounts']}
                            />
                            {/* <CounterStrike
                                display={this.state.tab === 'counterstrikego'}
                                imageReady={this.state.imageReady}
                                accountConfirmed={this.props.isLogged && 'counterstrikego' in this.props.user['game_accounts']}
                                queue={this.state.queue.counterstrikego ? this.state.queue.counterstrikego : {}}
                            /> */}
                            <Fifa20
                                display={this.state.tab === 'fifa20'}
                                imageReady={this.state.imageReady}
                                accountConfirmed={this.props.isLogged && 'fifa20' in this.props.user['game_accounts']}
                                queue={this.state.queue.fifa20 ? this.state.queue.fifa20 : {}}
                            />
                        </div>

                        <div
                            className="history"
                            style={{
                                display: this.state.tab === 'history' ? 'flex' : 'none',
                                width: this.state.historyScrollBar ? '99.25%' : '99.26%'
                            }}
                        >
                            <p className="title"><span className="purple">H</span>istorique</p>
                            {betsHistoryList}
                        </div>
                        </>
                    }
                </div>
            </div>
        );
    }
}

const dispatchToProps = {
    getLolBets,
    getFortniteBets,
    getCsgoBets,
    getFifa20Bets,
}
const mapStateToProps = state => {
    return {
        user: state.user,
        isLogged: state.isLogged,
        betsHistory: state.betsHistory,
        pendingBets: state.pendingBets
    };
}
export default connect(mapStateToProps, dispatchToProps)(Play);
