import React, { Component } from "react";
import "./Sign.css";
import signBG from "../images/mystique-statue.jpg";
import lolLogo from "../images/lol-logo.png";
import fortniteLogo from "../images/fortnite-logo.png";
import rocketLogo from "../images/rocket-logo.png";

export default class Sign extends Component {
    render() {
        return (
            <div className="sign" style={{ backgroundImage: `url(${signBG})` }}>
                <form>
                    <div className="games-icons">
                        <img className="lol-logo" src={lolLogo} alt="lolLogo"></img>
                        <img className="fortnite-logo" src={fortniteLogo} alt="fortniteLogo"></img>
                        <img className="rocket-logo" src={rocketLogo} alt="rocketLogo"></img>
                    </div>

                    <span><span className="purple">C</span>réer un compte</span>


                    <label htmlFor="email">
                        <span><span className="purple">E</span>-mail</span>
                        <span className="error-input email">error</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Adresse e-mail"
                        name="email"
                        spellCheck={false}
                        required
                    ></input>


                    <label htmlFor="password">
                        <span><span className="purple">M</span>ot de passe</span>
                        <span className="error-input password">doit faire 8 caractères minimum.</span>
                    </label>
                    <input 
                        type="password"
                        placeholder="Mot de passe"
                        name="password"
                        required
                    ></input>


                    <label htmlFor="birthdate">
                        <span><span className="purple">D</span>ate de naissance</span>
                        <span className="error-input birthdate">non valide.</span>
                    </label>
                    <div className="wrap-birth-inputs">
                        <input
                            className="day"
                            type="text"
                            placeholder="Jour"
                            name="bd_day"
                            spellCheck={false}
                        ></input>
                        <select
                            className="month" 
                            name='bd_month'
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
                            spellCheck={false}
                        ></input>
                    </div>
                    
                    <p className="legal">En créant se compte vous acceptez les conditions générales d’utilisation.</p>

                    <button>Démarrer</button>

                </form>
            </div>
        );
    }
}