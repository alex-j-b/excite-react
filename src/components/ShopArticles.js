//React
import React, { Component } from "react";
import { Link } from "react-router-dom";
//Images
import ecoin from "../images/e-coin.png";
import mouse from "../images/gamer-mouse.jpg";


export default class ShopArticles extends Component {
    render() {
        return (
            <div>
                <h1><span className="purple">A</span>rticles</h1>
                <div className="shop-articles">
                    <Link to="/boutique?tab=articles&id=1" className="article">
                        <div className="shop-img">
                            <img src={mouse} alt="mouse"></img>
                        </div>
                        <span>Souris Gamer</span>
                        <span>1000<img className="ecoin" src={ecoin} alt="ecoin"></img></span>
                    </Link>
                    <Link className="article">
                        <div className="shop-img">
                            <img src={mouse} alt="mouse"></img>
                        </div>
                        <span>Souris Gamer</span>
                        <span>1000<img className="ecoin" src={ecoin} alt="ecoin"></img></span>
                    </Link>
                    <Link className="article">
                        <div className="shop-img">
                            <img src={mouse} alt="mouse"></img>
                        </div>
                        <span>Souris Gamer</span>
                        <span>1000<img className="ecoin" src={ecoin} alt="ecoin"></img></span>
                    </Link>
                    <Link className="article">
                        <div className="shop-img">
                            <img src={mouse} alt="mouse"></img>
                        </div>
                        <span>Souris Gamer</span>
                        <span>1000<img className="ecoin" src={ecoin} alt="ecoin"></img></span>
                    </Link>
                    <Link className="article">
                        <div className="shop-img">
                            <img src={mouse} alt="mouse"></img>
                        </div>
                        <span>Souris Gamer</span>
                        <span>1000<img className="ecoin" src={ecoin} alt="ecoin"></img></span>
                    </Link>
                    <Link className="article">
                        <div className="shop-img">
                            <img src={mouse} alt="mouse"></img>
                        </div>
                        <span>Souris Gamer</span>
                        <span>1000<img className="ecoin" src={ecoin} alt="ecoin"></img></span>
                    </Link>
                    <Link className="article">
                        <div className="shop-img">
                            <img src={mouse} alt="mouse"></img>
                        </div>
                        <span>Souris Gamer</span>
                        <span>1000<img className="ecoin" src={ecoin} alt="ecoin"></img></span>
                    </Link>
                    <Link className="article">
                        <div className="shop-img">
                            <img src={mouse} alt="mouse"></img>
                        </div>
                        <span>Souris Gamer</span>
                        <span>1000<img className="ecoin" src={ecoin} alt="ecoin"></img></span>
                    </Link>
                    <Link className="article">
                        <div className="shop-img">
                            <img src={mouse} alt="mouse"></img>
                        </div>
                        <span>Souris Gamer</span>
                        <span>1000<img className="ecoin" src={ecoin} alt="ecoin"></img></span>
                    </Link>
                    <Link className="article">
                        <div className="shop-img">
                            <img src={mouse} alt="mouse"></img>
                        </div>
                        <span>Souris Gamer</span>
                        <span>1000<img className="ecoin" src={ecoin} alt="ecoin"></img></span>
                    </Link>
                    <Link className="article">
                        <div className="shop-img">
                            <img src={mouse} alt="mouse"></img>
                        </div>
                        <span>Souris Gamer</span>
                        <span>1000<img className="ecoin" src={ecoin} alt="ecoin"></img></span>
                    </Link>
                    <Link className="article">
                        <div className="shop-img">
                            <img src={mouse} alt="mouse"></img>
                        </div>
                        <span>Souris Gamer</span>
                        <span>1000<img className="ecoin" src={ecoin} alt="ecoin"></img></span>
                    </Link>
                </div>
            </div>
        );
    }
}