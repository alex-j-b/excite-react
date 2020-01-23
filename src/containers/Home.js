import React from "react";
import "./Home.css";
import trophy from "../images/trophy.jpg";
import esportBack from "../images/esport-background.mp4";

export default function Home(props) {
    return (
        <div className="home">
            <div className="home-1">
            <video id="videoBG" poster={trophy} autoPlay muted loop>
                <source src={esportBack} type="video/mp4"></source>
            </video>
                <div>
                    <p>Mise sur ton skill et gagne des cadeaux !</p>
                    <button>Jouer</button>
                </div>
            </div>
            <div className="home-2">

            </div>
        </div>
    );
}