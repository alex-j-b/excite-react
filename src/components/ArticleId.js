//React
import React, { Component } from "react";
//Redux
import { connect } from "react-redux";
import { addCart } from "../actions";
//libs
import DotsLoader from '../components/DotsLoader';
import Slider from 'react-slick';
import "../../node_modules/slick-carousel/slick/slick.css"; 
import "../../node_modules/slick-carousel/slick/slick-theme.css";
//Images
import ecoin from "../images/e-coin.png";


class ArticleId extends Component {
    onChange = this.onChange.bind(this);
    addCart = this.addCart.bind(this);
    state = {
        loading: false,
        quantity: 1
    }

    onChange(e) {
        console.log(e.target.value);
        this.setState({ [e.target.name]: e.target.value });
    }

    addCart() {
        if (this.props.isLogged) {
            this.setState({ loading: true });
            this.props.addCart(this.props.articleIdObj.articleId, this.state.quantity).then(response => {
                this.setState({ loading: false });
            });
        }
        else {
            this.props.history.push('/inscription');
        }
    }

    render() {
        const settings = {
            className: 'slider-img',
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1
        };

        const articleIdObj = this.props.articleIdObj;
        const articleImages = articleIdObj.image.map((el, idx) => {
            return (
                <img src={el} alt={el} key={el+idx}></img>
            );
        });

        return (
            <div className="shop-article-id">
                <div>
                    <div className="slider-wrap">
                        <Slider {...settings}>
                            {articleImages}
                        </Slider>
                    </div>

                    <div className="article-infos">
                        <h3>{articleIdObj.name}</h3>
                        <span className="number">{articleIdObj.price}<img className="ecoin" src={ecoin} alt="ecoin"></img></span>
                        <p>{articleIdObj.description}</p>

                        <div className="options">
                            <div className="quantity-picker">
                                <label htmlFor="quantity">Quantité</label>
                                <input 
                                    type="number"
                                    name="quantity"
                                    id="quantity"
                                    defaultValue="1"
                                    min="1"
                                    onChange={this.onChange}
                                ></input>
                            </div>
                            <div>
                                <button className="e-button" onClick={this.addCart}>Ajouter au panier</button>
                                <DotsLoader loading={this.state.loading} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(reduxState) {
    return {
        isLogged: reduxState.isLogged
    };
}
function mapDispatchToProps(dispatch) {
    return {
        addCart: function (articleId, quantity, changeQuantity) {
            return dispatch(addCart(articleId, quantity, changeQuantity));
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ArticleId);