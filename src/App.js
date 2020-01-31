import React, { Component } from 'react'
import { withRouter, Link } from "react-router-dom";
import { HamburgerSqueeze } from './hamburger/HamburgerSqueeze/HamburgerSqueeze.js'
import Routes from "./Routes";
import "./App.css";

import fbLogo from "./images/fb-logo.png";
import twitterLogo from "./images/twitter-logo.svg";

class App extends Component {
    toggleButton = this.toggleButton.bind(this);
    setUnderline = this.setUnderline.bind(this);
    state = {
        isActive: false
    }

    toggleButton() {
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

    setUnderline() {
        const resetUnderline = document.querySelectorAll('.current-route');
        for (let i = 0; i < resetUnderline.length; ++i) {
            resetUnderline[i].classList.remove("current-route");
        }
        const currentRoute = window.location.href.substring(21); //TO_CHANGE_AFTER_DEPLOY
        let headerRouteElement = document.querySelectorAll(`.app-header > a[href="${currentRoute}"]`);
        if (headerRouteElement[0]) headerRouteElement[0].classList.add("current-route");
    }

    componentDidMount () {
        this.setUnderline();
        this.props.history.listen(() => {
            this.setUnderline();
        });
    }

    render() {
        return (
            <div className="app-background">
                <div className="app-main">
                    <div className="app-header">
                        <Link className="logo-excite" to="/">
                            <span><span className="purple">E</span>xcite.</span>
                        </Link>
                        <Link to="/jouer">Jouer</Link>
                        <Link to="/boutique">Boutique</Link>
                        <Link to="/faq">FAQ</Link>
                        <Link to="/contact">Contact</Link>
                        <HamburgerSqueeze
                            className="hamburger"
                            isActive={this.state.isActive}
                            toggleButton={this.toggleButton}
                            buttonColor="transparent"
                            barColor="white"
                        />
                    </div>

                    <div className="app-menu" ref="appMenu">
                        <Link to="/jouer" onClick={this.toggleButton}>Jouer</Link>
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
                            <Link to="/inscription">Jouer</Link>
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

export default withRouter(App);