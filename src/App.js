//React
import React, { Component } from 'react'
import { Link, NavLink } from "react-router-dom";
import { HamburgerSqueeze } from './hamburger/HamburgerSqueeze/HamburgerSqueeze.js'
import Routes from "./Routes";
import "./App.css";
//Redux
import { connect } from "react-redux";
import { loggedInCheck } from "./actions";
//Images
import fbLogo from "./images/fb-logo.png";
import twitterLogo from "./images/twitter-logo.svg";

class App extends Component {
    toggleButton = this.toggleButton.bind(this);
    state = {
        phoneMenuActive: false
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
    }

    render() {
        return (
            <div className="app-background">
                <div className="app-main">
                    <div className="app-header">
                        <Link className="logo-excite" to="/">
                            <span><span className="purple">E</span>xcite.</span>
                        </Link>
                        <NavLink 
                            to={`/${this.props.isLogged ? 'jouer' : 'inscription'}`}
                            activeClassName="current-route"
                            >Jouer
                        </NavLink>
                        {this.props.isLogged && <NavLink to="/mon-compte" activeClassName="current-route">Mon Compte</NavLink>}
                        <NavLink to="/connexion" activeClassName="current-route">Boutique</NavLink>
                        <NavLink to="/faq" activeClassName="current-route">FAQ</NavLink>
                        <NavLink to="/contact" activeClassName="current-route">Contact</NavLink>
                        <HamburgerSqueeze
                            className="hamburger"
                            isActive={this.state.phoneMenuActive}
                            toggleButton={this.toggleButton}
                            buttonColor="transparent"
                            barColor="white"
                        />
                    </div>

                    <div className="app-menu" ref="appMenu">
                        <Link to={`/${this.props.isLogged ? 'jouer' : 'inscription'}`} onClick={this.toggleButton}>Jouer</Link>
                        {this.props.isLogged && <Link to="/mon-compte" onClick={this.toggleButton}>Mon Compte</Link>}
                        <Link to="/boutique" onClick={this.toggleButton}>Boutique</Link>
                        <Link to="/faq" onClick={this.toggleButton}>FAQ</Link>
                        <Link to="/contact" onClick={this.toggleButton}>Contact</Link>
                    </div>

                    <Routes />

                    <div className="app-footer">
                        <Link className="logo-excite" to="/">
                            <span><span className="purple">E</span>xcite.</span>
                        </Link>
                        <Link className="footer-social twitter" to="/">
                            <img src={twitterLogo} alt="twitter-logo"></img>
                        </Link>
                        <Link className="footer-social fb" to="/">
                            <img src={fbLogo} alt="fb-logo"></img>
                        </Link>
                        <div className="footer-links">
                            <Link to={`/${this.props.isLogged ? 'jouer' : 'inscription'}`}>Jouer</Link>
                            {this.props.isLogged && <Link to="/mon-compte">Mon Compte</Link>}
                            <Link to="/boutique">Boutique</Link>
                            <Link to="/faq">FAQ</Link>
                            <Link to="/contact">Contact</Link>
                            <Link to="/legal">Conditions d'utilisations</Link>
                            <Link to="/legal">Politique de cookies</Link>
                            <Link to="/legal">Politique de confidentialité</Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loggedInCheck: function(){
            dispatch(loggedInCheck());
        }
    }
};
function mapStateToProps(reduxState) {
    return {
        user: reduxState.user,
        isLogged: reduxState.isLogged
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(App);