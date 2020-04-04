//React
import React, { Component } from "react";
import { Link } from "react-router-dom";
//Images
import ecoin from "../images/e-coin.png";


export default class Articles extends Component {

    render() {
        const shopArticles = this.props.shopArticles.map((el, idx) => {
            return (
                <Link to={`/boutique?tab=articles&id=${el.articleId}`} className="article" key={el.articleId+idx}>
                    <div className="shop-img">
                        <img src={`${el.image[0]}`} alt="mouse"></img>
                    </div>
                    <span>{el.name}</span>
                    <span>{el.price}<img className="ecoin" src={ecoin} alt="ecoin"></img></span>
                </Link>
            );
        });

        return (
            <div>
                <p className="title"><span className="purple">A</span>rticles</p>
                <div className="shop-articles">
                    {shopArticles}
                </div>
            </div>
        );
    }
}