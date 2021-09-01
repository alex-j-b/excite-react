//React
import React, { Component } from "react";
import Switch from "react-switch";
import './SwitchPlay.css';
//Images
import {
    soloAvatar,
    teamAvatar
} from "../../assets/export.js";


export default class SwitchPlay extends Component {
    render() {
        return (
            <label className="switch-play" style={{ visibility: this.props.display ? 'visible' : 'hidden' }}>
                <Switch
                    onChange={this.props.onSwitch}
                    checked={this.props.multiplayer}
                    disabled={this.props.disabled}
                    height={26}
                    width={60}
                    activeBoxShadow="0 0 0 0"

                    offColor="#800080"
                    uncheckedIcon={
                        <img
                            className="solo-avatar"
                            src={soloAvatar}
                            alt="soloAvatar"
                        ></img>
                    }

                    onColor="#800080"
                    checkedIcon={
                        <img
                            className="team-avatar"
                            src={teamAvatar}
                            alt="teamAvatar"
                        ></img>
                    }
                />
            </label>
        );
    }
}
