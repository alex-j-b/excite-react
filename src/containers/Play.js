//React
import React, { Component } from "react";
import "./Play.css";
//Redux
import { connect } from "react-redux";
import { getLolBets, getFortniteBets } from "../actions";
//Components
import LeagueOfLegends from '../components/LeagueOfLegends';
import Fortnite from '../components/Fortnite';
import RocketLeague from '../components/RocketLeague';
//Images
import authBG from "../images/mystique-statue.jpg";
import lolLogo from "../images/lol-logo.png";
import fortniteLogo from "../images/fortnite-logo.png";
import rocketLogo from "../images/rocket-logo.png";
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
        this.props.history.push({
            pathname: '/jouer',
            search: `?game=${e.target.name}`
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.tab !== nextState.tab) this.setState({ imageReady: false });
        return true;
    }

    componentDidUpdate(prevProps) {
        //Not Logged Redirection
        if (!this.props.isLogged) {
            this.props.history.push('/connexion');
        }
        else if (this.props.isLogged !== prevProps.isLogged) {
            let urlParams = (new URL(document.location)).searchParams;
            let gameParam = urlParams.get('game');
            console.log(gameParam)
            if (gameParam !== null) {
                this.setState({ tab: gameParam });
            }
            else {
                this.setState({ tab: 'leagueoflegends' });
                this.props.history.push({
                    pathname: '/jouer',
                    search: '?game=leagueoflegends'
                });
            }
            this.props.getLolBets();
            this.props.getFortniteBets();
        }
        if (!this.state.imageReady) this.setState({ imageReady: true });
    }

    componentDidMount() {
        if (this.props.authStatus === 'deleteUser') {
            this.props.history.push('/connexion');
        }
        else if (this.props.isLogged) {
            let urlParams = (new URL(document.location)).searchParams;
            let gameParam = urlParams.get('game');
            console.log(gameParam)
            if (gameParam !== null) {
                this.setState({ tab: gameParam });
            }
            else {
                this.setState({ tab: 'leagueoflegends' });
                this.props.history.push({
                    pathname: '/jouer',
                    search: '?game=leagueoflegends'
                });
            }
            this.props.getLolBets();
            this.props.getFortniteBets();
        }
    }

    render() {
        let betsHistoryList = this.props.betsHistory.map(el => {
            return (
                <div className={`item ${el.status}`} key={el.betId}>
                    <div className="wrap-date-game">
                        <span>{el.date}</span>
                        <span>{el.game}</span>
                    </div>
                    <div className="wrap-bet-result">
                        <span>{el.goal}</span>
                        <span>{el.message + el.ecoinBet} <img className="ecoin" src={ecoin} alt="ecoin"></img></span>
                    </div>
                </div>
            );
        });
        betsHistoryList = [];
        if (betsHistoryList.length === 0) {
            betsHistoryList = <span>Aucun pari pour l'instant</span>;
        }

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
                            className="rocket-button" 
                            style={{
                                backgroundImage: `url(${rocketLogo})`,
                                backgroundColor: `${this.state.tab === 'rocketleague' ? '#f9f9f9' : 'transparent'}`
                            }}
                            name="rocketleague"
                            onClick={this.switchTab}
                        ></button>

                        { this.props.isLogged && 
                            <div>
                                <span><label className="ecoin-label">E-coins : </label>{this.props.user['custom:ecoin']}</span>
                                <img className="ecoin" src={ecoin} alt="ecoin"></img>
                            </div>
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
                            <RocketLeague
                                display={this.state.tab === 'rocketleague'}
                                imageReady={this.state.imageReady}
                            />
                        </div>
                        
                        <div
                            className="history"
                            style={{
                                display: this.state.tab === 'history' ? 'flex' : 'none',
                                width: this.state.historyScrollBar ? '99.25%' : '99.26%'
                            }}
                        >
                            <h1><span className="purple">H</span>istorique</h1>
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