//React
import React, { Component } from "react";
import { Helmet } from "react-helmet";
import "./Auth.css";
//Redux
import { connect } from "react-redux";
import { updateUser, logOut, disableUser, updatePassword } from '../../redux/actions/authActions';
//Libs
import DotsLoader from '../../components/loaders/DotsLoader';
import Popup from "reactjs-popup";
import LocationSearchInput from "../../components/auth/LocationSearchInput";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
//Images
import { generalBG } from "../../assets/export.js";


class Account extends Component {
    onChange = this.onChange.bind(this);
    onLocationChange = this.onLocationChange.bind(this);
    onSubmit = this.onSubmit.bind(this);
    togglePopUp = this.togglePopUp.bind(this);
    state = {
        nickname: '',
        givenName: '',
        familyName: '',
        bdDay: '',
        bdMonth: '01',
        bdYear: '',
        phoneNumber: '',
        address: '',
        currentPassword: '',
        newPassword: '',
        newPasswordRepeat: '',
        userLoaded: false,
        popUpDeleteAccount: false,
        loading: false
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
            nickname,
            bdMonth,
            bdYear,
            address,
            currentPassword,
            newPassword,
            newPasswordRepeat,
            givenName,
            familyName,
        } = this.state;
        let bdDay = this.state.bdDay.length === 1 ? '0' + this.state.bdDay : this.state.bdDay;
        let phoneNumber = this.state.phoneNumber.replace(/\s/g, '');
        phoneNumber = phoneNumber.startsWith('+') ? phoneNumber : '+' + phoneNumber;

        const currentNickname = this.props.user.nickname;
        const currentGivenName = this.props.user.given_name;
        const currentFamilyName = this.props.user.family_name;
        const currentBdDay = this.props.user.bdDay;
        const currentBdMonth = this.props.user.bdMonth;
        const currentBdYear = this.props.user.bdYear;
        const currentPhoneNumber = this.props.user.phone_number;
        const currentAddress = this.props.user.address;

        const attributesKeys = ['nickname', 'given_name', 'family_name', 'birthdate', 'phone_number', 'address']
        attributesKeys.forEach(key => {
            document.querySelector(`.confirmation-input.${key}`).style.display = "none";
        })

        let errorNickname = document.querySelector('.error-input.nickname');
        errorNickname.style.display = nickname.length >= 3 ? "none" : "inline";

        const validDate = new Date(bdYear, bdMonth, 0).getDate() >= bdDay && bdYear > 1900;
        let errorDate = document.querySelector('.error-input.birthdate');
        errorDate.style.display = validDate ? "none" : "inline";

        let errorPhoneNumber = document.querySelector('.error-input.phone_number');
        errorPhoneNumber.style.display = phoneNumber.length >= 11 ? "none" : "inline";

        let errorAddress = document.querySelector('.error-input.address');
        errorAddress.style.display = address.length >= 10 ? "none" : "inline";

        if (currentPassword!=='') {
            let errorCurrentPassword = document.querySelector('.error-input.current-password');
            let errorNewPassword = document.querySelector('.error-input.new-password');
            let errorpasswordRepeat = document.querySelector('.error-input.new-password-repeat');
            document.querySelector('.confirmation-input.password').style.display = "none";
            errorCurrentPassword.style.display = "none";
            errorNewPassword.style.display = "none";
            errorpasswordRepeat.style.display = "none";

            const passwordRegex = /[^\s]{8,50}/;
            const validPassword = passwordRegex.test(currentPassword);
            const validNewPassword = passwordRegex.test(newPassword);
            if (!validPassword) {
                errorCurrentPassword.style.display = "inline";
            }
            else if (!validNewPassword) {
                errorNewPassword.style.display = "inline";
            }
            else if (newPassword!==newPasswordRepeat) {
                errorpasswordRepeat.style.display = "inline";
            }
            else {
                this.props.updatePassword(currentPassword, newPassword);
                this.setState({ loading: true });
            }
        }

        const updateNickname = (nickname.length >= 3 && (nickname!==currentNickname));
        const updateGivenName = (givenName!=='' && givenName!==currentGivenName);
        const updateFamilyName = (familyName!=='' && familyName!==currentFamilyName);
        const updateDate = (validDate && (bdDay!==currentBdDay || bdMonth!==currentBdMonth || bdYear!==currentBdYear));
        const updatePhoneNumber = (phoneNumber.length >= 11 && phoneNumber!==currentPhoneNumber);
        const updateAddress = (address.length >= 10 && address!==currentAddress);

        if (updateNickname || updateGivenName || updateFamilyName || updateDate || updatePhoneNumber || updateAddress) {
            this.props.updateUser({
                'nickname': updateNickname ? nickname : '',
                'given_name': updateGivenName ? givenName : '',
                'family_name': updateFamilyName ? familyName : '',
                'birthdate': updateDate ? `${bdYear}-${bdMonth}-${bdDay}` : '',
                'phone_number': updatePhoneNumber ? phoneNumber : '',
                'address': updateAddress ? address : ''
            });
            this.setState({ loading: true });
        }

    }

    componentDidUpdate(prevProps) {
        if (!this.state.userLoaded) {
            this.setState({
                userLoaded: true,
                nickname: this.props.user.nickname || '',
                givenName: this.props.user.given_name || '',
                familyName: this.props.user.family_name || '',
                bdYear: this.props.user.bdYear || '',
                bdMonth: this.props.user.bdMonth || '',
                bdDay: this.props.user.bdDay || '',
                phoneNumber: this.props.user.phone_number || '',
                address: this.props.user.address || ''
            })
        }
        //Attribute Update -> Confirmation
        if (this.state.loading && prevProps.user !== this.props.user) {
            this.setState({ loading: false });
            const attributesKeys = ['nickname', 'given_name', 'family_name', 'birthdate', 'phone_number', 'address']
            attributesKeys.forEach(key => {
                if (prevProps.user[key] !== this.props.user[key]) {
                    document.querySelector(`.confirmation-input.${key}`).style.display = "inline";
                }
                else {
                    document.querySelector(`.confirmation-input.${key}`).style.display = "none";
                }
            })
        }
        //Password Update -> Error + Confirmation
        let errorPassword = document.querySelector('.error-input.current-password');
        let confirmationPassword = document.querySelector('.confirmation-input.password');
        if (this.state.loading && prevProps.forceUpdate !== this.props.forceUpdate) {
            if (this.props.authStatus === 'errorPassword') {
                this.setState({ loading: false }, () => {
                    errorPassword.style.display = "inline";
                    confirmationPassword.style.display = "none";
                });
            }
            else if (this.props.authStatus === 'confirmationPassword') {
                this.setState({
                    loading: false,
                    currentPassword: '',
                    newPassword: '',
                    newPasswordRepeat: ''
                }, () => {
                    confirmationPassword.style.display = "inline";
                    errorPassword.style.display = "none";
                });
            }
        }
    }

    componentDidMount() {
        if (this.props.isLogged) {
            this.setState({
                userLoaded: true,
                nickname: this.props.user.nickname || '',
                givenName: this.props.user.given_name || '',
                familyName: this.props.user.family_name || '',
                bdYear: this.props.user.bdYear || '',
                bdMonth: this.props.user.bdMonth || '',
                bdDay: this.props.user.bdDay || '',
                phoneNumber: this.props.user.phone_number || '',
                address: this.props.user.address || ''
            })
        }
    }

    render() {
        return (
            <div className="auth account" style={{ backgroundImage: `url(${generalBG})` }}>
                <Helmet><title>{this.props.title}</title></Helmet>
                <form className="account-form" onSubmit={this.onSubmit}>
                    <span><span className="purple">M</span>on Compte</span>
                    <div className="wrap-columns">
                        <div>
                            <label htmlFor="email">
                                <span><span className="purple">E</span>mail</span>
                            </label>
                            <cite>{this.props.user.email}</cite>

                            <label htmlFor="nickname">
                                <span><span className="purple">P</span>seudo</span>
                                <span className="error-input nickname">3 caract??res minimum</span>
                                <span className="confirmation-input nickname">modifi?? &#10004;</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Pseudo"
                                name="nickname"
                                spellCheck={false}
                                onChange={this.onChange}
                                value={this.state.nickname}
                                required
                            ></input>

                            <label htmlFor="givenName">
                                <span><span className="purple">P</span>r??nom</span>
                                <span className="confirmation-input given_name">modifi?? &#10004;</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Pr??nom"
                                name="givenName"
                                spellCheck={false}
                                onChange={this.onChange}
                                value={this.state.givenName}
                                required
                            ></input>

                            <label htmlFor="familyName">
                                <span><span className="purple">N</span>om</span>
                                <span className="confirmation-input family_name">modifi?? &#10004;</span>
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

                            <label htmlFor="birthdate">
                                <span><span className="purple">D</span>ate de naissance</span>
                                <span className="error-input birthdate">invalide</span>
                                <span className="confirmation-input birthdate">modifi?? &#10004;</span>
                            </label>
                            <div className="wrap-birth-inputs">
                                <input
                                    className="day"
                                    type="text"
                                    placeholder="Jour"
                                    name="bdDay"
                                    onChange={this.onChange}
                                    value={this.state.bdDay}
                                    spellCheck={false}
                                ></input>
                                <select
                                    className="month"
                                    name='bdMonth'
                                    onChange={this.onChange}
                                    value={this.state.bdMonth}
                                >
                                    <option value='01'>Janvier</option>
                                    <option value='02'>F??vrier</option>
                                    <option value='03'>Mars</option>
                                    <option value='04'>Avril</option>
                                    <option value='05'>Mai</option>
                                    <option value='06'>Juin</option>
                                    <option value='07'>Juillet</option>
                                    <option value='08'>Ao??t</option>
                                    <option value='09'>Septembre</option>
                                    <option value='10'>Octobre</option>
                                    <option value='11'>Novembre</option>
                                    <option value='12'>D??cembre</option>
                                </select>
                                <input
                                    className="year"
                                    type="text"
                                    placeholder="Ann??e"
                                    name="bdYear"
                                    onChange={this.onChange}
                                    value={this.state.bdYear}
                                    spellCheck={false}
                                ></input>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="phoneNumber">
                                <span><span className="purple">T</span>??l??phone</span>
                                <span className="error-input phone_number">12 caract??res requis</span>
                                <span className="confirmation-input phone_number">modifi?? &#10004;</span>
                            </label>
                            <PhoneInput
                                buttonClass="phone-input"
                                dropdownClass="phone-dropdown"
                                country={'fr'}
                                localization={'fr'}
                                value={this.state.phoneNumber}
                                onChange={phoneNumber => this.setState({ phoneNumber: phoneNumber })}
                                inputProps={{
                                    name: 'phoneNumber'
                                }}
                            />

                            <label htmlFor="address">
                                <span><span className="purple">A</span>dresse</span>
                                <span className="error-input address">invalide</span>
                                <span className="confirmation-input address">modifi?? &#10004;</span>
                            </label>
                            <LocationSearchInput
                                address={this.state.address}
                                onLocationChange={this.onLocationChange}
                            />

                            <label htmlFor="password">
                                <span><span className="purple">M</span>odifier mot de passe</span>
                                <span className="error-input current-password">incorrect.</span>
                                <span className="error-input new-password">doit faire 8 caract??res minimum</span>
                                <span className="error-input new-password-repeat">ne correspond pas.</span>
                                <span className="confirmation-input password">modifi?? &#10004;</span>
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
                        </div>
                    </div>

                    <div className="wrap-account-buttons">
                        <div>
                            <button
                                className="log-out"
                                type="button"
                                onClick={() => this.props.logOut()}
                                >D??connexion
                            </button>

                            <p className="grey-link" onClick={this.togglePopUp}>Supprimer mon compte</p>
                            <Popup
                                open={this.state.popUpDeleteAccount}
                                contentStyle={{ width: 'fit-content' }}
                                closeOnDocumentClick
                            >
                                <div className="yes-no-popup">
                                    <div className="close" onClick={this.togglePopUp}>
                                        &times;
                                    </div>
                                    <p>Voulez-vous vraiment supprimer <b>d??finitivement</b> votre compte Excite ?</p>
                                    <p>??? Vous ne pourrez plus recr??er de compte avec cet email et vos comptes de jeux seront bloqu??s.</p>
                                    <div className="wrap-buttons">
                                        <button className="yes" type="button" onClick={() => this.props.disableUser()}>Oui</button>
                                        <button className="no" type="button" onClick={this.togglePopUp}>Non</button>
                                    </div>
                                </div>
                            </Popup>
                        </div>

                        <div>
                            <button className="e-button">Valider</button>
                            <DotsLoader loading={this.state.loading}/>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

const dispatchToProps = {
    updateUser,
    updatePassword,
    logOut,
    disableUser,
}
const mapStateToProps = state => {
    return {
        user: state.user,
        isLogged: state.isLogged,
        authStatus: state.authStatus,
        forceUpdate: state.forceUpdate
    };
}
export default connect(mapStateToProps, dispatchToProps)(Account);
