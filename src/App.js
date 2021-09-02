//React
import React, { Component } from 'react'
import { withRouter, Link, NavLink } from 'react-router-dom';
import { HamburgerSqueeze } from './components/hamburger/HamburgerSqueeze/HamburgerSqueeze.js'
import Routes from './routes/Routes';
import './App.css';
//Redux
import { connect } from 'react-redux';
import { loggedInCheck } from './redux/actions/authActions';
//WebSocket
import WebSocketProvider from './WebSocket';
//Google Analytics
import ReactGA from 'react-ga';
//Images
import {
    ecoin,
    fbLogo,
    twitterLogo,
    logoExcite
} from "./assets/export.js";

function initializeReactGA() {
    if (process.env.REACT_APP_STAGE === 'prod') {
        ReactGA.initialize('UA-167772285-1');
        ReactGA.pageview(window.location.pathname + window.location.search);
    }
}
initializeReactGA();


class App extends Component {
    toggleButton = this.toggleButton.bind(this);
    state = {
        phoneMenuActive: false,
        title: 'Excite | Pariez sur vous',
    }

    toggleButton() {
        if (!this.state.phoneMenuActive) {
            this.refs.appMenu.style.display = "flex";
            setTimeout(function() {
                this.refs.appMenu.style.opacity = "1";
            }.bind(this), 10);
        }
        else {
            this.refs.appMenu.style.opacity = "0";
            setTimeout(function() {
                this.refs.appMenu.style.display = "none";
            }.bind(this), 500);
        }

        this.setState({
            phoneMenuActive: !this.state.phoneMenuActive
        })
    }

    componentDidMount () {
        this.props.loggedInCheck();
        this.props.history.listen(() => {
            window.scrollTo(0, 0);
            if (window.swUpdateReady) {
                window.swUpdateReady = false;
                window.stop();
                window.location.reload();
            }
        });
    }

    render() {
        return (
            <WebSocketProvider userId={this.props.isLogged ? this.props.user.sub : null}>
            <div className="app-background">
                <div className="app-main">
                    <div className="app-header">
                        <Link className="logo-excite" to="/">
                            <img src={logoExcite} alt="logoExcite"></img>
                        </Link>

                        {this.props.isLogged &&
                            <NavLink to={`/ecoin?redirect=${window.location.pathname+window.location.search}`} activeClassName="current-route">
                                <span className="number">{this.props.user['custom:ecoin']}</span>&nbsp;
                                <img className="ecoin" src={ecoin} alt="ecoin"></img>
                            </NavLink>
                        }
                        <NavLink to="/jouer" activeClassName="current-route">Jouer</NavLink>
                        <NavLink to="/boutique?tab=articles" activeClassName="current-route">Boutique</NavLink>
                        {this.props.isLogged && <NavLink to="/mon-compte" activeClassName="current-route">Mon Compte</NavLink>}
                        <NavLink to="/faq" activeClassName="current-route">FAQ</NavLink>
                        <NavLink to="/contact" activeClassName="current-route">Contact</NavLink>
                        <HamburgerSqueeze
                            className="hamburger"
                            style={{ height: 'auto' }}
                            isActive={this.state.phoneMenuActive}
                            toggleButton={this.toggleButton}
                            buttonColor="transparent"
                            barColor="white"
                        />
                    </div>

                    <div className="app-menu" ref="appMenu">
                        {this.props.isLogged &&
                            <NavLink to={`/ecoin?redirect=${window.location.pathname+window.location.search}`} onClick={this.toggleButton}>
                                <span className="number">{this.props.user['custom:ecoin']}</span>&nbsp;
                                <img className="ecoin" src={ecoin} alt="ecoin"></img>
                            </NavLink>
                        }
                        <Link to="/jouer" onClick={this.toggleButton}>Jouer</Link>
                        <Link to="/boutique?tab=articles" onClick={this.toggleButton}>Boutique</Link>
                        {this.props.isLogged && <Link to="/mon-compte" onClick={this.toggleButton}>Mon Compte</Link>}
                        <Link to="/faq" onClick={this.toggleButton}>FAQ</Link>
                        <Link to="/contact" onClick={this.toggleButton}>Contact</Link>
                    </div>

                    <Routes authProps={{ isLogging: this.props.isLogging, isLogged: this.props.isLogged }} />

                    <div className="app-footer">
                        <Link className="logo-excite" to="/">
                            <img src={logoExcite} alt="logoExcite"></img>
                        </Link>
                        <Link className="footer-social twitter" to="/">
                            <img src={twitterLogo} alt="twitter-logo"></img>
                        </Link>
                        <Link className="footer-social fb" to="/">
                            <img src={fbLogo} alt="fb-logo"></img>
                        </Link>
                        <div className="footer-links">
                            <Link to="/jouer">Jouer</Link>
                            <Link to="/boutique?tab=articles">Boutique</Link>
                            <Link to={`/ecoin?redirect=${window.location.pathname+window.location.search}`}>Obtenir des eCoins</Link>
                            {this.props.isLogged && <Link to="/mon-compte">Mon Compte</Link>}
                            <Link to="/faq">FAQ</Link>
                            <Link to="/contact">Contact</Link>
                            <Link to="/conditions">Conditions d'utilisations</Link>
                            <Link to="/mentions">Mentions légales</Link>
                        </div>
                    </div>
                </div>
            </div>
            </WebSocketProvider>
        )
    }
}

const dispatchToProps = {
    loggedInCheck,
}
const mapStateToProps = state => {
    return {
        user: state.user,
        isLogged: state.isLogged,
        isLogging: state.isLogging
    };
}
App = withRouter(App);
export default connect(mapStateToProps, dispatchToProps)(App);
