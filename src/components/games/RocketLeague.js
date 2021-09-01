//React
import React, { Component } from "react";
//Redux
//import { connect } from "react-redux";
//import { getLolBets, addLolBet } from '../../redux/actions/gameActions';
//libs
import { isEqual } from 'lodash';
import Select from 'react-select';
import ImageFadeIn from 'react-image-fade-in';
import DotsLoader from '../../components/loaders/DotsLoader';

//Images
import {
    ecoin,
    rocketCrash
} from "../../assets/export.js";

const ecoinOptions = [
    { value: 50, label: '50' },
    { value: 100, label: '100' },
    { value: 200, label: '200' },
    { value: 500, label: '500' },
    { value: 1000, label: '1000' }
]

const CustomSingleValue = ({ data }) => (
    <div className="input-select">
        <div className="input-select__single-value">
            <span>{ data.label }</span>
            <span className="input-select__icon"><img className="ecoin" src={ecoin} alt="ecoin"></img></span>
        </div>
    </div>
);


export default class RocketLeague extends Component {
    onChange = this.onChange.bind(this);
    steamUser = this.steamUser.bind(this);
    state = {
        ecoinOption: 5,
        imageReady: true,
        loading: false
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    selectChange(name, value) {
        this.setState({ [name]: value });
    }

    steamUser() {

    }

    render() {
        return (
            <div className="wrap-rocketleague" style={{ display: this.props.display ? 'flex' : 'none' }}>
                <div className="left">
                    {this.props.imageReady && <ImageFadeIn src={rocketCrash} />}
                </div>
                <div className="right">
                <p className="title"><span className="purple">R</span>ocket League</p>

                { false /*'lol' in this.props.user['custom:games_account']*/ ?
                    <>
                    <Select
                        className="select-ecoin"
                        options={ecoinOptions}
                        defaultValue={ecoinOptions[0]}
                        components={{ SingleValue: CustomSingleValue }}
                        blurInputOnSelect={true}
                        isSearchable={false}
                        onChange={obj => this.selectChange('ecoinOption', obj.value)}
                    />
                    <div>
                        <span className="goal-price">Gagne une partie classée : {this.state.ecoinOption*2}</span>
                        <img className="ecoin" src={ecoin} alt="ecoin"></img>
                    </div>
                    <button className="e-button lol-bet" onClick={this.addLolBet}>Parier</button>
                    <p className="notif lol-bet">Pari en cours... il vous reste <span></span> pour lancer une partie classée</p>
                    <DotsLoader loading={this.state.loading}/>
                    </>
                    :
                    <>
                    <div className="confirm-game-account">
                        <div>
                            <label htmlFor="summonerName">
                                <span><span className="purple">N</span>om d'invocateur</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Nom d'invocateur"
                                name="summonerName"
                                onChange={this.onChange}
                                value={this.state.summonerName}
                                spellCheck={false}
                                required
                            ></input>
                        </div>

                        <div>
                            <label htmlFor="regionSelect">
                                <span><span className="purple">R</span>égion</span>
                            </label>
                        </div>
                    </div>
                    
                    <div className="lol-confirm-icon">
                        <p>Veuillez changer votre icon afin de valider votre compte</p>
                    </div>

                    <button className="e-button" onClick={this.steamUser}>Valider</button>
                    <p className="error-input wrong-pseudo-region">Nom d'invocateur ou région invalide</p>
                    <p className="error-input wrong-icon">Veuillez changer votre icon</p>
                    <DotsLoader loading={this.state.loading}/>
                    </>
                }
                </div>
            </div>
        );
    }
}