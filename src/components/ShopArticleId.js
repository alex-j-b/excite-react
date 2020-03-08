//React
import React, { Component } from "react";
//libs
import Slider from 'react-slick';
import "../../node_modules/slick-carousel/slick/slick.css"; 
import "../../node_modules/slick-carousel/slick/slick-theme.css";
//Images
import ecoin from "../images/e-coin.png";
import mouse from "../images/gamer-mouse.jpg";


export default class ShopArticles extends Component {
    render() {
        const settings = {
            className: 'slider-img',
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1
        };
        
        return (
            <div className="shop-article-id">
                <div>
                    <div className="slider-wrap">
                        <Slider {...settings}>
                            <img src={mouse} alt="mouse"></img>
                            <img src={mouse} alt="mouse"></img>
                        </Slider>
                    </div>

                    <div className="article-infos">
                        <h3>Souris Gamer</h3>
                        <span className="number">1000<img className="ecoin" src={ecoin} alt="ecoin"></img></span>
                        <p>La souris SteelSeries Rival 110 va à l'essentiel ! Performante et précise, elle intègre un capteur optique pouvant aller jusqu'à 7200 dpi pour une précision chirurgicale. Profitez également d'un design ambidextre, de 6 boutons programmables et d'un rétro-éclairage RGB pour devenir le meilleur joueur</p>
                        
                        <div className="options">
                            <div className="quantity-picker">
                                <label htmlFor="quantity">Quantité</label>
                                <input 
                                    type="number"
                                    name="quantity"
                                    defaultValue="1"
                                    min="1"
                                ></input>
                            </div>
                            <button>Ajouter au panier</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}