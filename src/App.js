import React, { Component } from 'react'
import { withRouter, Link } from "react-router-dom";
import { HamburgerSqueeze } from './custom_hamburger/HamburgerSqueeze/HamburgerSqueeze.js'
import Routes from "./Routes";
import "./App.css";

class App extends Component {
    state = {
        isActive: false
    }

    toggleButton = () => {
        this.setState({
            isActive: !this.state.isActive
        })
    }

    render() {
        return (
            <div className="app-background">
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
                        buttonColor="black"
                        barColor="white"
                    />
                </div>
                <Routes />
                <div className="app-footer"></div>
            </div>
        )
    }
}

export default withRouter(App);