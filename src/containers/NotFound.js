import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

import forestBG from "../images/forest.jpg";
import teemo from "../images/teemo.png";

export default class Play extends Component {
    render() {
        return (
            <div className="NotFound" style={{ backgroundImage: `url(${forestBG})` }}>
                <span>404</span>
                <span>Page introuvable.</span>
                <img src={teemo}></img>
                <Link to="/">Retour à la page d'accueil</Link>
            </div>
        );
    }
}