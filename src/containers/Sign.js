import React, { Component } from "react";
import "./Sign.css";

import LocationSearchInput from "../components/LocationSearchInput";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

import signBG from "../images/mystique-statue.jpg";
import lolLogo from "../images/lol-logo.png";
import fortniteLogo from "../images/fortnite-logo.png";
import rocketLogo from "../images/rocket-logo.png";


export default class Sign extends Component {
    onSubmit = this.onSubmit.bind(this);
    onChange = this.onChange.bind(this);
    state = {
        stepTwo: true,
        email: '',
        password: '',
        bd_day: '',
        bd_year: '',
        firstname: '',
        lastname: '',
        phone: '',
        address: ''
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

    onSubmit(e) {
        e.preventDefault();
        if (!this.state.stepTwo) {
            const mailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const validMail = mailRegex.test(this.state.email.toLowerCase());
            let errorMail = document.querySelector('.error-input.email');
            errorMail.style.display = validMail ? "none" : "inline";

            const passwordRegex = /[^\s]{8,50}/;
            const validPassword = passwordRegex.test(this.state.password);
            let errorPassword = document.querySelector('.error-input.password');
            errorPassword.style.display = validPassword ? "none" : "inline";

            const bd_day = this.state.bd_day;
            const bd_year = this.state.bd_year;
            let bd_month = this.state.bd_month;
            const validDate = new Date(bd_year, bd_month, 0).getDate() >= bd_day && bd_year > 1900;
            let errorDate = document.querySelector('.error-input.birthdate');
            errorDate.style.display = validDate ? "none" : "inline";

            if (validMail && validPassword & validDate){
                this.setState({ stepTwo: true });
            }
        }
        else {
            console.log(this.state.phone)
            console.log(this.state.address)
            let errorPhone = document.querySelector('.error-input.phone');
            errorPhone.style.display = this.state.phone.length >= 10 ? "none" : "inline";

            let errorAddress = document.querySelector('.error-input.address');
            errorAddress.style.display = this.state.address.length >= 10 ? "none" : "inline";

            if (this.state.phone.length >= 10 && this.state.address.length >= 10){
                this.setState({ stepTwo: false });
            }
        }
    }

    render() {
        const firstStep =
            <>
                <span><span className="purple">C</span>réez un compte</span>

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
                <p className="legal">En créant se compte vous acceptez les conditions générales d’utilisation.</p>
                <button>Démarrer</button>
            </>;


        const secondStep =
            <>
                <span><span className="purple">C</span>omplétez vos informations</span>

                <label htmlFor="firstname">
                    <span><span className="purple">P</span>rénom</span>
                </label>
                <input
                    type="text"
                    placeholder="Prénom"
                    name="firstname"
                    spellCheck={false}
                    onChange={this.onChange}
                    value={this.state.firstname}
                    required
                ></input>

                <label htmlFor="lastname">
                    <span><span className="purple">N</span>om</span>
                </label>
                <input
                    type="text"
                    placeholder="Nom"
                    name="lastname"
                    spellCheck={false}
                    onChange={this.onChange}
                    value={this.state.lastname}
                    required
                ></input>

                <label htmlFor="phone">
                    <span><span className="purple">T</span>éléphone</span>
                    <span className="error-input phone">invalide</span>
                </label>
                <PhoneInput
                    buttonClass="phone-input"
                    dropdownClass="phone-dropdown"
                    country={'fr'}
                    localization={'fr'}
                    value={this.state.phone}
                    onChange={phone => this.setState({ phone: phone })}
                    inputProps={{
                        name: 'phone',
                        required: true
                    }}
                />

                <label htmlFor="address">
                    <span><span className="purple">A</span>dresse</span>
                    <span className="error-input address">invalide</span>
                </label>
                <LocationSearchInput />

                <button>Valider</button>
            </>;


        return (
            <div className="sign" style={{ backgroundImage: `url(${signBG})` }}>
                <form onSubmit={this.onSubmit}>
                    <div className="games-icons">
                        <img className="lol-logo" src={lolLogo} alt="lolLogo"></img>
                        <img className="fortnite-logo" src={fortniteLogo} alt="fortniteLogo"></img>
                        <img className="rocket-logo" src={rocketLogo} alt="rocketLogo"></img>
                    </div>
                    {this.state.stepTwo ? secondStep : firstStep}
                </form>
            </div>
        );
    }
}