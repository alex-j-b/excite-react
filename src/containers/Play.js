//React
import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Play.css";
//Redux
import { connect } from "react-redux";
import {
    getLolBets,
    getFortniteBets,
    getCsgoBets
} from "../actions";
//Components
import LeagueOfLegends from '../components/LeagueOfLegends';
import Fortnite from '../components/Fortnite';
import CounterStrike from '../components/CounterStrike';
import CircleLoader from '../components/CircleLoader';
//Images
import authBG from "../images/mystique-statue.jpg";
import lolLogo from "../images/lol-logo.png";
import fortniteLogo from "../images/fortnite-logo.png";
import csgoLogo from "../images/csgo-logo.png";
import historyBlack from "../images/history-black.png";
import ecoin from "../images/e-coin.png";


class Play extends Component {
    onChange = this.onChange.bind(this);
    switchTab = this.switchTab.bind(this);
    state = {
        tab: '',
        historyScrollBar: false,
        imageReady: true
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

    componentDidUpdate(prevProps) {
        if (this.props.isLogged !== prevProps.isLogged) {
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
                counterstrikego: 'Counter Strike'
            })[tab] || 'undefined';
            let title = document.querySelector('head > title');
            title.innerHTML = `Excite | ${displayGameFunc}`;

            this.props.getLolBets();
            this.props.getFortniteBets();
            this.props.getCsgoBets();
        }
        if (!this.state.imageReady) this.setState({ imageReady: true });
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
                counterstrikego: 'Counter Strike'
            })[tab] || 'undefined';

            let title = document.querySelector('head > title');
            title.innerHTML = `Excite | ${displayGameFunc}`;

            this.props.getLolBets();
            this.props.getFortniteBets();
            this.props.getCsgoBets();
        }
    }

    render() {
        let betsHistoryList = this.props.betsHistory.map(el => {
            return (
                <div className={`item ${el.status}`} key={el.betId}>
                    <div className="wrap-date-game">
                        <span className="number">{el.date}</span>
                        <span>{el.game}</span>
                    </div>
                    <div className="wrap-bet-result">
                        <span>{el.goal}</span>
                        <span className="number">{el.message + el.ecoin} <img className="ecoin" src={ecoin} alt="ecoin"></img></span>
                    </div>
                </div>
            );
        });
        if (betsHistoryList.length === 0) betsHistoryList = <span>Aucun pari pour l'instant</span>;

        return (
            <div className="play" style={{ backgroundImage: `url(${authBG})` }}>
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
                        <button
                            className="csgo-button" 
                            style={{
                                filter: `${this.state.tab === 'counterstrikego' ? '' : 'invert(100%)'}`,
                                backgroundImage: `url(${csgoLogo})`,
                                backgroundColor: `${this.state.tab === 'counterstrikego' ? '#f9f9f9' : 'transparent'}`
                            }}
                            name="counterstrikego"
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
                            <CounterStrike
                                display={this.state.tab === 'counterstrikego'}
                                imageReady={this.state.imageReady}
                                accountConfirmed={this.props.isLogged && 'counterstrikego' in this.props.user['game_accounts']}
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

function mapDispatchToProps(dispatch) {
    return {
        getLolBets: function(){
            dispatch(getLolBets());
        },
        getFortniteBets: function () {
            dispatch(getFortniteBets());
        },
        getCsgoBets: function () {
            dispatch(getCsgoBets());
        }
    }
}
function mapStateToProps(reduxState) {
    return {
        user: reduxState.user,
        isLogged: reduxState.isLogged,
        betsHistory: reduxState.betsHistory,
        pendingBets: reduxState.pendingBets
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Play);