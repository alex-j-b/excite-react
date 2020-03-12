//React
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./Shop.css";
//Redux
import { connect } from "react-redux";
import { getShopArticles, getCart, getCommand } from "../actions";
//Components
import Articles from '../components/Articles';
import ArticleId from '../components/ArticleId';
import Cart from '../components/Cart';
import Commands from '../components/Commands';
//Images
import ecoin from "../images/e-coin.png";
import backArrow from "../images/back-arrow.png";

import articlesIcon from "../images/articles.png";
import commandesIcon from "../images/commandes.png";
import panierIcon from "../images/panier.png";


class Shop extends Component {
    state = {
        tab: 'articles',
        id: false,
        currentUrl: document.location.href
    }

    componentDidUpdate() {
        if (this.state.currentUrl !== document.location.href) {
            let urlParams = (new URL(document.location)).searchParams;
            if (urlParams.get('tab') !== null) {
                this.setState({ 
                    tab: urlParams.get('tab'),
                    id: urlParams.get('id')
                });
            }
            else {
                this.setState({ tab: 'articles' });
                this.props.history.push('/boutique?tab=articles');
            }
            this.setState({ currentUrl: document.location.href });
        }
    }

    componentDidMount() {
        let urlParams = (new URL(document.location)).searchParams;
        if (urlParams.get('tab') !== null) {
            this.setState({ 
                tab: urlParams.get('tab'),
                id: urlParams.get('id')
            });
        }
        else {
            this.setState({ tab: 'articles' });
            this.props.history.push('/boutique?tab=articles');
        }
        this.props.getShopArticles();
        this.props.getCart();
        this.props.getCommand();
    }

    render() {

        let articleIdObj = false;
        if (this.state.id) {
            const articleIndex = this.props.shopArticles.findIndex(el => el.articleId === this.state.id);
            articleIdObj = this.props.shopArticles[articleIndex];
        }

        return (
            <div className="shop">

                <div className="shop-header">
                    { this.state.id && <NavLink
                        to="/boutique?tab=articles"
                        className="back-button"
                        ><img src={backArrow} alt="backArrow"></img>
                    </NavLink>}

                    { this.props.isLogged && 
                        <span className="wallet-ecoin">
                            <label>Mes e-Coins : </label><span className="number">{this.props.user['custom:ecoin']}</span>
                            <img className="ecoin" src={ecoin} alt="ecoin"></img>
                        </span>
                    }

                    <div className="tabs">
                        <NavLink 
                            to="/boutique?tab=articles"
                            className={this.state.tab === 'articles' ? 'current-shop-tab' : ''}
                            style={{ backgroundColor: `${this.state.tab === 'articles' ? 'white' : 'transparent'}` }}
                            ><span>Articles</span>
                            <img src={articlesIcon} alt="articlesIcon" style={{ filter: `${this.state.tab === 'articles' ? '' : 'invert(100%)'}` }}></img>
                        </NavLink>
                        <NavLink 
                            to="/boutique?tab=commandes"
                            className={this.state.tab === 'commandes' ? 'current-shop-tab' : ''}
                            style={{ backgroundColor: `${this.state.tab === 'commandes' ? 'white' : 'transparent'}` }}
                            ><span>Mes commandes</span>
                            <img src={commandesIcon} alt="commandesIcon" style={{ filter: `${this.state.tab === 'commandes' ? '' : 'invert(100%)'}` }}></img>
                        </NavLink>
                        <NavLink 
                            to="/boutique?tab=panier"
                            className={this.state.tab === 'panier' ? 'current-shop-tab' : ''}
                            style={{ backgroundColor: `${this.state.tab === 'panier' ? 'white' : 'transparent'}` }}
                            ><span>Mon panier</span>
                            <img src={panierIcon} alt="panierIcon" style={{ filter: `${this.state.tab === 'panier' ? '' : 'invert(100%)'}` }}></img>
                            {this.props.cartArticles.length > 0 && <span className="dot">{this.props.cartArticles.length}</span>}
                        </NavLink>
                    </div>
                </div>

                { this.state.tab === 'articles' && !this.state.id && <Articles shopArticles={this.props.shopArticles}/>}
                { articleIdObj && <ArticleId articleIdObj={articleIdObj}/>}
                { this.state.tab === 'panier' && !this.state.id && <Cart history={this.props.history}/>}
                { this.state.tab === 'commandes' && <Commands/>}

            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getShopArticles: function () {
            dispatch(getShopArticles());
        },
        getCart: function () {
            dispatch(getCart());
        },
        getCommand: function () {
            dispatch(getCommand());
        }
    }
}
function mapStateToProps(reduxState) {
    return {
        user: reduxState.user,
        isLogged: reduxState.isLogged,
        shopArticles: reduxState.shopArticles,
        cartArticles: reduxState.cartArticles
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Shop);