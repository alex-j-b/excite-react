//React
import React, { Component } from "react";
//Redux
import { connect } from "react-redux";
import { addCart } from '../../redux/actions/shopActions';
//libs
import DotsLoader from '../loaders/DotsLoader';
import Slider from 'react-slick';
import Select from 'react-select';
import "../../../node_modules/slick-carousel/slick/slick.css"; 
import "../../../node_modules/slick-carousel/slick/slick-theme.css";
//Images
import { ecoin } from "../../assets/export.js";


class ArticleId extends Component {
    onChange = this.onChange.bind(this);
    addCart = this.addCart.bind(this);
    state = {
        loading: false,
        quantity: 1,
        sizeOption: 'S',
        articleIdError: false,
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    selectChange(name, value) {
        this.setState({ [name]: value });
    }

    addCart() {
        if (this.props.isLogged) {
            this.setState({ loading: true });
            const article = JSON.parse(JSON.stringify(this.props.articleIdObj));
            const quantity = Number(this.state.quantity);

            //Create array of selected options
            let optionObj = {};
            let options = false;
            if (article.options) {
                article.options.forEach(el => {
                    let label = Object.keys(el)[0];
                    let option = this.state[label] ? this.state[label] : el[label][0];
                    optionObj[label] = option;
                });
                options = [...Array(quantity).fill(optionObj)];
                console.log('options: ', options);
            }
            console.log('addCart: ', article)

            this.props.addCart(article.articleId, options, quantity, false).then(response => {
                this.setState({ loading: false });
                if (Number(response.statusCode) === 500) {
                    this.setState({ articleIdError: response.body.error });
                }
            });
        }
        else {
            this.props.history.push('/inscription');
        }
    }

    componentDidMount() {
        let title = document.querySelector('head > title');
        title.innerHTML = `Excite | ${this.props.articleIdObj.name}`;
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

        //Slider images
        const articleImages = articleIdObj.image.map((el, idx) => {
            return (
                <img src={el} alt={el} key={el+idx}></img>
            );
        });

        //Specific article options
        let articleOptions = '';
        if (!articleOptions && articleIdObj.options) {
            articleOptions = articleIdObj.options.map((el) => {
                let label = Object.keys(el)[0];
                let options = el[Object.keys(el)[0]];
                options = options.map((el) => {
                    return { value: el, label: el };
                });

                return (
                    <div className="article-option" key={label}>
                        <label>{label}</label>
                        <Select
                            className="select"
                            options={options}
                            defaultValue={options[0]}
                            blurInputOnSelect={true}
                            isSearchable={false}
                            onChange={obj => this.selectChange(Object.keys(el)[0], obj.value)}
                        />
                    </div>
                );
            });
        }

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
                        <p className="description">{articleIdObj.description}</p>


                        {articleOptions}


                        <div className="final">
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
                            <div className="add-button">
                                <button className="e-button" onClick={this.addCart}>Ajouter au panier</button>
                                <DotsLoader loading={this.state.loading} />
                                <p ref="articleIdError" className={`error-button ${this.state.articleIdError ? "dInline" : "dNone"}`}></p>
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
        addCart: function (articleId, options, quantity, changeQuantity) {
            return dispatch(addCart(articleId, options, quantity, changeQuantity));
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ArticleId);