//React
import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";
//Redux
import { connect } from "react-redux";
import { logIn } from '../../redux/actions/authActions';
//Components
import DotsLoader from '../../components/loaders/DotsLoader';
//Libs
import { Auth } from "aws-amplify";
//Images
import {
    generalBG,
    lolLogo,
    fortniteLogo,
    csgoLogo,
    fifa20Logo
} from "../../assets/export.js";


class Log extends Component {
    onChange = this.onChange.bind(this);
    onLogSubmit = this.onLogSubmit.bind(this);
    onForgotSubmit = this.onForgotSubmit.bind(this);
    state = {
        email: '',
        password: '',
        forgotEmail: '',
        forgotCode: '',
        forgotPassword: '',
        loading: false,
        forgotForm: false
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onLogSubmit(e) {
        e.preventDefault();
        const { email, password } = this.state;

        const mailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const validMail = mailRegex.test(email.toLowerCase());

        const passwordRegex = /[^\s]{8,50}/;
        const validPassword = passwordRegex.test(password);

        let errorAttempt = document.querySelector('.error-button.log-attempt');
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

    async onForgotSubmit(e) {
        e.preventDefault();
        const { forgotEmail, forgotCode, forgotPassword } = this.state;

        switch(this.state.forgotForm) {
            case 1:
                document.querySelector('.error-input.forgot-email').style.display = "none";
                this.setState({ loading: true });
                try {
                    await Auth.forgotPassword(forgotEmail);
                    this.setState({ forgotForm: 2 });
                } catch (e) {
                    document.querySelector('.error-input.forgot-email').style.display = "inline";
                }
                this.setState({ loading: false });
                break;
            case 2:
                document.querySelector('.error-input.forgot-code').style.display = "none";
                const passwordRegex = /[^\s]{8,50}/;
                const validPassword = passwordRegex.test(forgotPassword);
                document.querySelector('.error-input.forgot-password').style.display = validPassword ? "none" : "inline";
                if (!validPassword) break;

                this.setState({ loading: true });
                try {
                    await Auth.forgotPasswordSubmit(forgotEmail, forgotCode, forgotPassword);
                    this.setState({ forgotForm: false });
                } catch (e) {
                    document.querySelector('.error-input.forgot-code').style.display = "inline";
                }
                this.setState({ loading: false });
                break;
            default:
                return;
        }
    }

    componentDidUpdate() {
        let errorAttempt = document.querySelector('.error-button.log-attempt');
        if (errorAttempt && this.props.authStatus === 'errorPassword' && errorAttempt.style.display !== "inline") {
            this.setState({ loading: false }, () => errorAttempt.style.display = "inline");
        }
    }

    componentDidMount() {
        let title = document.querySelector('head > title');
        title.innerHTML = 'Excite | Connexion';
    }

    render() {
        return (
            <div className="auth log-sign" style={{ backgroundImage: `url(${generalBG})` }}>
                {!this.state.forgotForm &&
                    <form onSubmit={this.onLogSubmit}>
                        <div className="games-icons">
                            <img className="lol-logo" src={lolLogo} alt="lolLogo"></img>
                            <img className="fortnite-logo" src={fortniteLogo} alt="fortniteLogo"></img>
                            <img className="csgo-logo" src={csgoLogo} alt="csgoLogo"></img>
                            <img className="fifa20-logo" src={fifa20Logo} alt="fifa20Logo"></img>


                        </div>

                        <span><span className="purple">C</span>onnexion</span>
                        <p className="grey-link"><Link to="/inscription">Créer un compte</Link></p>

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
                            className="grey-link forgot"
                            onClick={() => this.setState({ forgotForm: 1 })}
                            >Mot de passe oublié ?
                        </p>

                        <div>
                            <button className="e-button">Connexion</button>
                            <DotsLoader loading={this.state.loading}/>
                        </div>
                        <p className="error-button log-attempt">Mot de passe ou email invalide</p>
                    </form>
                }
                {this.state.forgotForm &&
                    <form onSubmit={this.onForgotSubmit}>
                        <div className="games-icons">
                            <img className="lol-logo" src={lolLogo} alt="lolLogo"></img>
                            <img className="fortnite-logo" src={fortniteLogo} alt="fortniteLogo"></img>
                            <img className="csgo-logo" src={csgoLogo} alt="csgoLogo"></img>
                        </div>

                        <span><span className="purple">M</span>ot de passe oublié</span>

                        {this.state.forgotForm === 1 &&
                            <>
                            <label htmlFor="forgotEmail">
                                <span><span className="purple">E</span>-mail</span>
                                <span className="error-input forgot-email">inexistant</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Adresse e-mail"
                                name="forgotEmail"
                                onChange={this.onChange}
                                value={this.state.forgotEmail}
                                spellCheck={false}
                                required
                            ></input>
                            </>
                        }

                        {this.state.forgotForm === 2 &&
                            <>
                            <label htmlFor="forgotCode">
                                <span><span className="purple">C</span>ode</span>
                                <span className="error-input forgot-code">incorrect</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Code de confirmation"
                                name="forgotCode"
                                onChange={this.onChange}
                                value={this.state.forgotCode}
                                required
                            ></input>

                            <label htmlFor="forgotPassword">
                                <span><span className="purple">N</span>ouveau mot de passe</span>
                                <span className="error-input forgot-password">8 caractères minimum</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Mot de passe"
                                name="forgotPassword"
                                onChange={this.onChange}
                                value={this.state.forgotPassword}
                                required
                            ></input>
                            </>
                        }

                        <div>
                            <button className="e-button">Envoyer</button>
                            <DotsLoader loading={this.state.loading}/>
                        </div>
                    </form>
                }
            </div>
        );
    }
}

const dispatchToProps = {
    logIn,
}
const mapStateToProps = state => {
    return {
        authStatus: state.authStatus,
        isLogged: state.isLogged,
        user: state.user,
        forceUpdate: state.forceUpdate
    };
}
export default connect(mapStateToProps, dispatchToProps)(Log);
