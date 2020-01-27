import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

import authBG from "../images/mystique-statue.jpg";
import lolLogo from "../images/lol-logo.png";
import fortniteLogo from "../images/fortnite-logo.png";
import rocketLogo from "../images/rocket-logo.png";


export default class Log extends Component {
    onChange = this.onChange.bind(this);
    onSubmit = this.onSubmit.bind(this);
    state = {
        email: '',
        password: '',
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit(e) {
        e.preventDefault();
        const { email, password } = this.state;

        const mailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const validMail = mailRegex.test(email.toLowerCase());

        const passwordRegex = /[^\s]{8,50}/;
        const validPassword = passwordRegex.test(password);
        
        let errorAttempt = document.querySelector('.error-input.log-attempt');
        if (validMail && validPassword){
            errorAttempt.style.display = "none";
            //handle connexion
        }
        else {
            errorAttempt.style.display = "inline";
        }
    }

    render() {
        return (
            <div className="auth log-sign" style={{ backgroundImage: `url(${authBG})` }}>
                <form onSubmit={this.onSubmit}>
                    <div className="games-icons">
                        <img className="lol-logo" src={lolLogo} alt="lolLogo"></img>
                        <img className="fortnite-logo" src={fortniteLogo} alt="fortniteLogo"></img>
                        <img className="rocket-logo" src={rocketLogo} alt="rocketLogo"></img>
                    </div>
                    
                    <span><span className="purple">C</span>onnexion</span>
                    <p className="manual-redirection"><Link to="/inscription">Créer un compte</Link></p>

                    <label htmlFor="email">
                        <span><span className="purple">E</span>-mail</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Adresse e-mail"
                        name="email"
                        onChange={this.onChange}
                        value={this.state.email}
                        spellCheck={false}
                        required
                    ></input>

                    <label htmlFor="password">
                        <span><span className="purple">M</span>ot de passe</span>
                        
                    </label>
                    <input 
                        type="password"
                        placeholder="Mot de passe"
                        name="password"
                        onChange={this.onChange}
                        value={this.state.password}
                        required
                    ></input>
                    
                    <p className="manual-redirection forgot"><Link to="/inscription">Mot de passe oublié ?</Link></p>
                    <p className="error-input log-attempt">Mot de passe ou email invalide</p>

                    <button>Connexion</button>

                </form>
            </div>
        );
    }
}