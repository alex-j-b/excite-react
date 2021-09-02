//React
import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import "./Auth.css";
//Redux
import { connect } from "react-redux";
import { updateUser, deleteUser } from '../../redux/actions/authActions';
//Libs
import { Auth } from "aws-amplify";
import DotsLoader from '../../components/loaders/DotsLoader';
import LocationSearchInput from "../../components/auth/LocationSearchInput";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
//Images
import {
    generalBG,
    lolLogo,
    fortniteLogo,
    csgoLogo,
    fifa20Logo
} from "../../assets/export.js";



class Sign extends Component {
    onChange = this.onChange.bind(this);
    onLocationChange = this.onLocationChange.bind(this);
    onSubmit = this.onSubmit.bind(this);
    state = {
        email: '',
        password: '',
        bd_day: '',
        bd_month: '01',
        bd_year: '',
        confCode: '',
        givenName: '',
        familyName: '',
        phoneNumber: '',
        address: '',
        emailVerified: false,
        stepTwo: false,
        loading: false
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
        switch (e.target.name) {
            case 'email':
                let errorMail = document.querySelector('.error-input.email').style.display;
                if (errorMail==="inline") {
                    const mailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;
                    const validMail = mailRegex.test(this.state.email.toLowerCase());
                    if (validMail) document.querySelector('.error-input.email').style.display = "none";
                }
                break;
            case 'password':
                let errorPassword = document.querySelector('.error-input.password').style.display;
                if (errorPassword==="inline") {
                    const passwordRegex = /[^\s]{7,50}/;
                    const validPassword = passwordRegex.test(this.state.password);
                    if (validPassword) document.querySelector('.error-input.password').style.display = "none";
                }
                break;
            default:
                return
        }
    }

    onLocationChange(address) {
        this.setState({ address: address });
    }

    async onSubmit(e) {
        e.preventDefault();
        if (!this.state.stepTwo) {
            const { email, password, bd_month, bd_year } = this.state;
            let bd_day = this.state.bd_day.length === 1 ? '0' + this.state.bd_day : this.state.bd_day;

            const mailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const validMail = mailRegex.test(email.toLowerCase());
            let errorMail = document.querySelector('.error-input.email');
            errorMail.style.display = validMail ? "none" : "inline";

            const passwordRegex = /[^\s]{8,50}/;
            const validPassword = passwordRegex.test(password);
            let errorPassword = document.querySelector('.error-input.password');
            errorPassword.style.display = validPassword ? "none" : "inline";

            const validDate = new Date(bd_year, bd_month, 0).getDate() >= bd_day && bd_year > 1900;
            let errorDate = document.querySelector('.error-input.birthdate');
            errorDate.style.display = validDate ? "none" : "inline";

            if (validMail && validPassword & validDate){
                this.refs.errorMailExist.style.display = "none";
                this.refs.errorUnknown.style.display = "none";
                this.setState({ loading: true });
                try {
                    await Auth.signUp({
                        'username': email,
                        'password': password,
                        'attributes': {
                            'email': email,
                            'nickname': email,
                            'birthdate': `${bd_year}-${bd_month}-${bd_day}`
                        }
                    });
                    await Auth.signIn(email, password);
                    await Auth.verifyCurrentUserAttribute('email');
                    this.setState({ loading: false, stepTwo: true });
                } catch (e) {
                    this.setState({ loading: false });
                    if (e.code === 'UsernameExistsException') {
                        this.refs.errorMailExist.style.display = "inline";
                    }
                    else {
                        this.refs.errorUnknown.innerHTML = e.message;
                        this.refs.errorUnknown.style.display = "inline";
                    }
                }
            }
        }
        else {
            const { confCode, givenName, familyName, address } = this.state;
            let phoneNumber = this.state.phoneNumber.replace(/\s+/g, '');
            phoneNumber = phoneNumber.startsWith('+') ? phoneNumber : '+' + phoneNumber;

            let errorPhone = document.querySelector('.error-input.phone');
            errorPhone.style.display = phoneNumber.length >= 11 ? "none" : "inline";
            let errorAddress = document.querySelector('.error-input.address');
            errorAddress.style.display = address.length >= 10 ? "none" : "inline";
            document.querySelector('.error-input.conf-code').style.display = "none";

            if (phoneNumber.length >= 11 && address.length >= 10){
                this.setState({ loading: true });
                Auth.verifyCurrentUserAttributeSubmit('email', confCode)
                .then(() => {
                    this.setState({ emailVerified: true }, () => {
                        this.props.updateUser({
                            'given_name': givenName,
                            'family_name': familyName,
                            'phone_number': phoneNumber,
                            'address': address
                        });
                    });
                }).catch(e => {
                    this.setState({ loading: false });
                    document.querySelector('.error-input.conf-code').style.display = "inline";
                });
            }
        }
    }

    componentWillUnmount() {
        if (!this.state.emailVerified && !this.props.isLogged) {
            this.props.deleteUser();
        }
    }

    render() {
        const firstStep =
            <>
                <span><span className="purple">C</span>réez un compte</span>
                <p className="grey-element connexion">Déjà inscrit ?&nbsp;<Link className="grey-link" to="/connexion">Connectez-vous</Link></p>

                <label htmlFor="email">
                    <span><span className="purple">E</span>-mail</span>
                    <span className="error-input email">invalide</span>
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
                    <span className="error-input password">8 caractères minimum</span>
                </label>
                <input
                    type="password"
                    placeholder="Mot de passe"
                    name="password"
                    onChange={this.onChange}
                    value={this.state.password}
                    required
                ></input>

                <label htmlFor="birthdate">
                    <span><span className="purple">D</span>ate de naissance</span>
                    <span className="error-input birthdate">invalide</span>
                </label>
                <div className="wrap-birth-inputs">
                    <input
                        className="day"
                        type="text"
                        placeholder="Jour"
                        name="bd_day"
                        onChange={this.onChange}
                        value={this.state.bd_day}
                        spellCheck={false}
                    ></input>
                    <select
                        className="month"
                        name='bd_month'
                        onChange={this.onChange}
                        value={this.state.bd_month}
                    >
                        <option value='01'>Janvier</option>
                        <option value='02'>Février</option>
                        <option value='03'>Mars</option>
                        <option value='04'>Avril</option>
                        <option value='05'>Mai</option>
                        <option value='06'>Juin</option>
                        <option value='07'>Juillet</option>
                        <option value='08'>Août</option>
                        <option value='09'>Septembre</option>
                        <option value='10'>Octobre</option>
                        <option value='11'>Novembre</option>
                        <option value='12'>Décembre</option>
                    </select>
                    <input
                        className="year"
                        type="text"
                        placeholder="Année"
                        name="bd_year"
                        onChange={this.onChange}
                        value={this.state.bd_year}
                        spellCheck={false}
                    ></input>
                </div>
                <p className="grey-element">En créant ce compte vous acceptez les <a className="grey-link" title="https://excite.world/conditions" href="https://excite.world/conditions" target="_blank" rel="noopener noreferrer">conditions générales d’utilisation</a>.</p>

                <div>
                    <button className="e-button">Démarrer</button>
                    <DotsLoader loading={this.state.loading}/>
                </div>
                <p ref="errorMailExist" className="error-button log-attempt">Cet email existe déjà</p>
                <p ref="errorUnknown" className="error-button log-attempt"></p>
            </>;


        const secondStep =
            <>
                <span><span className="purple">C</span>omplétez vos informations</span>

                <label htmlFor="confCode">
                    <span><span className="purple">C</span>ode de confirmation</span>
                    <span className="error-input conf-code">incorrect</span>
                </label>
                <input
                    type="number"
                    placeholder="Vérifiez votre adresse email"
                    name="confCode"
                    spellCheck={false}
                    onChange={this.onChange}
                    value={this.state.confCode}
                    required
                ></input>

                <label htmlFor="givenName">
                    <span><span className="purple">P</span>rénom</span>
                </label>
                <input
                    type="text"
                    placeholder="Prénom"
                    name="givenName"
                    spellCheck={false}
                    onChange={this.onChange}
                    value={this.state.givenName}
                    required
                ></input>

                <label htmlFor="familyName">
                    <span><span className="purple">N</span>om</span>
                </label>
                <input
                    type="text"
                    placeholder="Nom"
                    name="familyName"
                    spellCheck={false}
                    onChange={this.onChange}
                    value={this.state.familyName}
                    required
                ></input>

                <label htmlFor="phoneNumber">
                    <span><span className="purple">T</span>éléphone</span>
                    <span className="error-input phone">12 caractères requis</span>
                </label>
                <PhoneInput
                    buttonClass="phone-input"
                    dropdownClass="phone-dropdown"
                    country={'fr'}
                    localization={'fr'}
                    value={this.state.phoneNumber}
                    onChange={phoneNumber => this.setState({ phoneNumber: phoneNumber })}
                    inputProps={{
                        name: 'phoneNumber',
                        required: true
                    }}
                />

                <label htmlFor="address">
                    <span><span className="purple">A</span>dresse</span>
                    <span className="error-input address">invalide</span>
                </label>
                <LocationSearchInput
                    address={this.state.address}
                    onLocationChange={this.onLocationChange}
                />
                <div>
                    <button className="e-button">Valider</button>
                    <DotsLoader loading={this.state.loading}/>
                </div>
            </>;


        return (
            <div className="auth log-sign" style={{ backgroundImage: `url(${generalBG})` }}>
                <Helmet><title>{this.props.title}</title></Helmet>
                <form onSubmit={this.onSubmit}>
                    <div className="games-icons">
                        <img className="lol-logo" src={lolLogo} alt="lolLogo"></img>
                        <img className="fortnite-logo" src={fortniteLogo} alt="fortniteLogo"></img>
                        <img className="csgo-logo" src={csgoLogo} alt="csgoLogo"></img>
                        <img className="fifa20-logo" src={fifa20Logo} alt="fifa20Logo"></img>
                    </div>
                    {this.state.stepTwo ? secondStep : firstStep}
                </form>
            </div>
        );
    }
}

const dispatchToProps = {
    updateUser,
    deleteUser,
}
const mapStateToProps = state => {
    return {
        user: state.user,
        isLogged: state.isLogged
    };
}
export default connect(mapStateToProps, dispatchToProps)(Sign);
