import React from "react";
import "./Home.css";
import trophy from "../images/trophy.jpg";
import trophyBack from "../images/trophy-background.jpg";

export default function Home(props) {
    return (
        <div className="home">
            <div className="home-1" style={{ backgroundImage: `url(${trophyBack})` }}>
                <div>
                    <p>Mise sur ton skill et gagne des cadeaux !</p>
                    <button>Jouer</button>
                </div>
                <img className="trophy" src={trophy} alt="trophy"></img>
            </div>
            <div className="home-2">

            </div>
        </div>
    );
}