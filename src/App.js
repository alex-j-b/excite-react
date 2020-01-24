import React, { Component } from 'react'
import { withRouter, Link } from "react-router-dom";
import { HamburgerSqueeze } from './hamburger/HamburgerSqueeze/HamburgerSqueeze.js'
import Routes from "./Routes";
import "./App.css";

import fbLogo from "./images/fb-logo.png";
import twitterLogo from "./images/twitter-logo.svg";

class App extends Component {
    state = {
        isActive: false
    }

    toggleButton = () => {
        if (!this.state.isActive) {
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
            isActive: !this.state.isActive
        })
    }

    render() {
        return (
            <div className="app-background">
                <div className="app-main">
                    <div className="app-header">
                        <Link className="logo-excite" to="/">
                            <span><span className="purple">E</span>xcite.</span>
                        </Link>
                        <Link to="/">Jouer</Link>
                        <Link to="/">Boutique</Link>
                        <Link to="/">FAQ</Link>
                        <Link to="/">Contact</Link>
                        <HamburgerSqueeze
                            className="hamburger"
                            isActive={this.state.isActive}
                            toggleButton={this.toggleButton}
                            buttonColor="transparent"
                            barColor="white"
                        />
                    </div>

                    <div className="app-menu" ref="appMenu">
                        <Link to="/">Jouer</Link>
                        <Link to="/">Boutique</Link>
                        <Link to="/">FAQ</Link>
                        <Link to="/">Contact</Link>
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
                            <Link to="/">Jouer</Link>
                            <Link to="/">Boutique</Link>
                            <Link to="/">FAQ</Link>
                            <Link to="/">Contact</Link>
                            <Link to="/">Conditions d'utilisations</Link>
                            <Link to="/">Politique de cookies</Link>
                            <Link to="/">Politique de confidentialité</Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(App);