import React, { Component } from "react";
import "./Auth.css";

import Popup from "reactjs-popup";
import LocationSearchInput from "../components/LocationSearchInput";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

import authBG from "../images/mystique-statue.jpg";


export default class Account extends Component {
    onChange = this.onChange.bind(this);
    onLocationChange = this.onLocationChange.bind(this);
    onSubmit = this.onSubmit.bind(this);
    togglePopUp = this.togglePopUp.bind(this);
    state = {
        pseudo: 'example',
        firstname: 'Jean',
        lastname: 'Robert',
        bd_day: '01',
        bd_month: '05',
        bd_year: '1997',
        phone: '+33 6 27 82 25 89',
        address: '2 Rue des Pyramides, Paris, France',
        currentPassword: '',
        newPassword: '',
        newPasswordRepeat: '',
        popUpDeleteAccount: false
    }

    togglePopUp() {
        this.setState({ popUpDeleteAccount: !this.state.popUpDeleteAccount });
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onLocationChange(address) {
        this.setState({ address: address });
    }

    onSubmit(e) {
        e.preventDefault();
        const {
            pseudo,
            bd_day,
            bd_month,
            bd_year,
            phone,
            address,
            currentPassword,
            newPassword,
            newPasswordRepeat,
            firstname,
            lastname,
        } = this.state;

        const currentPseudo = 'this.props.pseudo';
        const currentFirstname = 'this.props.firstname';
        const currentLastname = 'this.props.lastname';
        const currentBdDay = 'this.props.bdDay';
        const currentBdMonth = 'this.props.bdMonth';
        const currentBdYear = 'this.props.bdYear';
        const currentPhone = 'this.props.phone';
        const currentAddress = 'this.props.address';

        let errorPseudo = document.querySelector('.error-input.pseudo');
        errorPseudo.style.display = pseudo === 'disponible?' ? "none" : "inline";

        const validDate = new Date(bd_year, bd_month, 0).getDate() >= bd_day && bd_year > 1900;
        let errorDate = document.querySelector('.error-input.birthdate');
        errorDate.style.display = validDate ? "none" : "inline";

        let errorPhone = document.querySelector('.error-input.phone');
        errorPhone.style.display = phone.length >= 10 ? "none" : "inline";

        let errorAddress = document.querySelector('.error-input.address');
        errorAddress.style.display = address.length >= 10 ? "none" : "inline";

        const passwordRegex = /[^\s]{8,50}/;
        const validPassword = passwordRegex.test(currentPassword);
        const validNewPassword = passwordRegex.test(newPassword);
        if (currentPassword!=='' && (!validPassword || !validNewPassword || newPassword!==newPasswordRepeat)) {
            let errorCurrentPassword = document.querySelector('.error-input.current-password');
            errorCurrentPassword.style.display = "none";
            let errorNewPassword = document.querySelector('.error-input.new-password');
            errorNewPassword.style.display = "none";
            let errorpasswordRepeat = document.querySelector('.error-input.new-password-repeat');
            errorpasswordRepeat.style.display = "none";
            document.querySelector('.confirmation-modif.password').style.display = "none";
            if (!validPassword){
                errorCurrentPassword.style.display = "inline";
            }
            else if (!validNewPassword){
                errorNewPassword.style.display = "inline";
            }
            else if (newPassword!==newPasswordRepeat){
                errorpasswordRepeat.style.display = "inline";
            }
        }
        else if (validPassword && validNewPassword && newPassword===newPasswordRepeat){
            //PatchPassword.then(
            document.querySelector('.confirmation-modif.password').style.display = "inline";
        }

        const updatePseudo = (pseudo.length >= 3 && pseudo!==currentPseudo);
        const updateFirstname = (firstname!=='' && firstname!==currentFirstname);
        const updateLastname = (lastname!=='' && lastname!==currentLastname);
        const updateDate = (validDate && (bd_day!==currentBdDay || bd_month!==currentBdMonth || bd_year!==currentBdYear));
        const updatePhone = (phone.length >= 10 && phone!==currentPhone);
        const updateAddress = (address.length >= 10 && address!==currentAddress);

        if (updatePseudo || updateFirstname || updateLastname || updateDate || updatePhone || updateAddress) {
            //PatchUser.then(
            if (updatePseudo) document.querySelector('.confirmation-modif.pseudo').style.display = "inline";
            if (updateFirstname) document.querySelector('.confirmation-modif.firstname').style.display = "inline";
            if (updateLastname) document.querySelector('.confirmation-modif.lastname').style.display = "inline";
            if (updateDate) document.querySelector('.confirmation-modif.birthdate').style.display = "inline";
            if (updatePhone) document.querySelector('.confirmation-modif.phone').style.display = "inline";
            if (updateAddress) document.querySelector('.confirmation-modif.address').style.display = "inline";
        }

    }

    render() {
        const href = "javascript:void(0);";
        return (
            <div className="auth account" style={{ backgroundImage: `url(${authBG})` }}>
                <form className="account-form" onSubmit={this.onSubmit}>
                    <span><span className="purple">M</span>on Compte</span>
                    <div className="wrap-columns">
                        <div>
                            <label htmlFor="email">
                                <span><span className="purple">E</span>mail</span>
                            </label>
                            <cite>example@gmail.com</cite>

                            <label htmlFor="pseudo">
                                <span><span className="purple">P</span>seudo</span>
                                <span className="error-input pseudo">déjà pris</span>
                                <span className="confirmation-modif pseudo">modifié &#10004;</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Pseudo"
                                name="pseudo"
                                spellCheck={false}
                                onChange={this.onChange}
                                value={this.state.pseudo}
                                required
                            ></input>

                            <label htmlFor="firstname">
                                <span><span className="purple">P</span>rénom</span>
                                <span className="confirmation-modif firstname">modifié &#10004;</span>
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
                                <span className="confirmation-modif lastname">modifié &#10004;</span>
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

                            <label htmlFor="birthdate">
                                <span><span className="purple">D</span>ate de naissance</span>
                                <span className="error-input birthdate">invalide</span>
                                <span className="confirmation-modif birthdate">modifié &#10004;</span>
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
                        </div>

                        <div>
                            <label htmlFor="phone">
                                <span><span className="purple">T</span>éléphone</span>
                                <span className="error-input phone">invalide</span>
                                <span className="confirmation-modif phone">modifié &#10004;</span>
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
                                <span className="confirmation-modif address">modifié &#10004;</span>
                            </label>
                            <LocationSearchInput
                                address={this.state.address}
                                onLocationChange={this.onLocationChange}
                            />

                            <label htmlFor="password">
                                <span><span className="purple">M</span>odifier mot de passe</span>
                                <span className="error-input current-password">incorrect.</span>
                                <span className="error-input new-password">doit faire 8 caractères minimum</span>
                                <span className="error-input new-password-repeat">ne correspond pas.</span>
                                <span className="confirmation-modif password">modifié &#10004;</span>
                            </label>
                            <input 
                                type="password"
                                placeholder="Mot de passe actuel"
                                name="currentPassword"
                                onChange={this.onChange}
                                value={this.state.currentPassword}
                            ></input>
                            <input 
                                type="password"
                                placeholder="Nouveau mot de passe"
                                name="newPassword"
                                onChange={this.onChange}
                                value={this.state.newPassword}
                            ></input>
                            <input 
                                type="password"
                                placeholder="Confirmez nouveau mot de passe"
                                name="newPasswordRepeat"
                                onChange={this.onChange}
                                value={this.state.newPasswordRepeat}
                            ></input>

                            <p className="manual-redirection" onClick={this.togglePopUp}>
                                <a href={href}>Supprimer mon compte</a>
                            </p>
                            <Popup
                                open={this.state.popUpDeleteAccount}
                                contentStyle={{ width: 'fit-content' }}
                                closeOnDocumentClick
                            >
                                <div className="delete-popup">
                                    <a className="close" href={href} onClick={this.togglePopUp}>
                                        &times;
                                    </a>
                                    <p>Voulez-vous vraiment supprimer <b>définitivement</b> votre compte Excite ?</p>
                                    <div className="wrap-buttons">
                                        <button className="yes" onClick={this.togglePopUp}>Oui</button>
                                        <button className="no" onClick={this.togglePopUp}>Non</button>
                                    </div>
                                </div>
                            </Popup>

                        </div>
                    </div>

                    <div className="wrap-account-buttons">
                        <button className="log-out">Déconnexion</button>
                        <button className="validate">Valider</button>
                    </div>
                </form>
            </div>
        );
    }
}