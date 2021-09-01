import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

import {
    forestBG,
    teemo
} from "../../assets/export.js";


export default class NotFound extends Component {

    componentDidMount() {
        let title = document.querySelector('head > title');
        title.innerHTML = 'Excite | Page introuvable';
    }

    render() {
        return (
            <div className="not-found" style={{ backgroundImage: `url(${forestBG})` }}>
                <span>404</span>
                <span>Page introuvable.</span>
                <img src={teemo} alt="teemo"></img>
                <Link to="/">Retour à la page d'accueil</Link>
            </div>
        );
    }
}
