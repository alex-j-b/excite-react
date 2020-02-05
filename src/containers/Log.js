//React
import React, { Component } from "react";
import { Link } from "react-router-dom";
import DotsLoader from '../components/DotsLoader';
import "./Auth.css";
//Redux
import { connect } from "react-redux";
import { logIn } from "../actions";
//Images
import authBG from "../images/mystique-statue.jpg";
import lolLogo from "../images/lol-logo.png";
import fortniteLogo from "../images/fortnite-logo.png";
import rocketLogo from "../images/rocket-logo.png";


class Log extends Component {
    onChange = this.onChange.bind(this);
    onSubmit = this.onSubmit.bind(this);
    state = {
        email: '',
        password: '',
        loading: false,
        forgotPassword: false
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
            this.setState({ loading: true }, () => errorAttempt.style.display = "none");
            this.props.logIn({
                email: email,
                password: password
            });
        }
        else {
            errorAttempt.style.display = "inline";
        }
    }

    componentDidUpdate() {
        let errorAttempt = document.querySelector('.error-input.log-attempt');
        if (this.props.isLogged) {
            this.props.history.push('/jouer');
        }
        else if (this.props.authStatus === 'errorPassword' && errorAttempt.style.display !== "inline") {
            this.setState({ loading: false }, () => errorAttempt.style.display = "inline");
        }
    }

    componentDidMount() {
        if (this.props.isLogged) this.props.history.push('/jouer');
    }

    render() {
        return (
            <div className="auth log-sign" style={{ backgroundImage: `url(${authBG})` }}>
                {!this.state.forgotPassword &&
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
                        
                        <p 
                            className="manual-redirection forgot"
                            onClick={() => this.setState({ forgotPassword: 1 })}
                            ><Link to="#">Mot de passe oublié ?</Link>
                        </p>
                        <p className="error-input log-attempt">Mot de passe ou email invalide</p>

                        <div>
                            <button>Connexion</button>
                            <DotsLoader loading={this.state.loading}/>
                        </div>
                    </form>
                }
                {this.state.forgotPassword &&
                    <form onSubmit={this.onSubmit}>
                        <div className="games-icons">
                            <img className="lol-logo" src={lolLogo} alt="lolLogo"></img>
                            <img className="fortnite-logo" src={fortniteLogo} alt="fortniteLogo"></img>
                            <img className="rocket-logo" src={rocketLogo} alt="rocketLogo"></img>
                        </div>
                        
                        <span><span className="purple">M</span>ot de passe oublié</span>

                        {this.state.forgotPassword === 1 &&
                            <>
                            <label htmlFor="emailForgot">
                                <span><span className="purple">E</span>-mail</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Adresse e-mail"
                                name="emailForgot"
                                onChange={this.onChange}
                                value={this.state.emailForgot}
                                spellCheck={false}
                                required
                            ></input>
                            </>
                        }

                        {this.state.forgotPassword === 2 &&
                            <>
                            <label htmlFor="confCode">
                                <span><span className="purple">C</span>ode</span>
                            </label>
                            <input 
                                type="text"
                                placeholder="Code de confirmation"
                                name="confCode"
                                onChange={this.onChange}
                                value={this.state.confCode}
                                required
                            ></input>
                            </>
                        }

                        {this.state.forgotPassword === 3 &&
                            <>
                            <label htmlFor="newPassword">
                                <span><span className="purple">N</span>ouveau mot de passe</span>
                                
                            </label>
                            <input 
                                type="text"
                                placeholder="Mot de passe"
                                name="newPassword"
                                onChange={this.onChange}
                                value={this.state.newPassword}
                                required
                            ></input>
                            </>
                        }

                        <p className="error-input log-attempt">Mot de passe ou email invalide</p>

                        <div>
                            <button>Envoyer</button>
                            <DotsLoader loading={this.state.loading}/>
                        </div>
                    </form>
                }
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        logIn: function(userCredentials){
            dispatch(logIn(userCredentials));
        }
    }
};
function mapStateToProps(reduxState) {
    return {
        authStatus: reduxState.authStatus,
        isLogged: reduxState.isLogged,
        user: reduxState.user
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Log);