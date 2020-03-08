//React
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./Shop.css";
//Components
import ShopArticles from '../components/ShopArticles';
import ShopArticleId from '../components/ShopArticleId';
import ShopCart from '../components/ShopCart';
import ShopCommands from '../components/ShopCommands';
//Images
import ecoin from "../images/e-coin.png";
import backArrow from "../images/back-arrow.png";


export default class Shop extends Component {
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
    }

    render() {
        return (
            <div className="shop">

                <div className="shop-header">
                    { this.state.id && <NavLink
                        to="/boutique?tab=articles"
                        className="back-button"
                        ><img src={backArrow} alt="backArrow"></img>
                    </NavLink>}
                    <div className="wallet-ecoin">
                        <span><label>Mes e-Coins : </label><span className="number">150</span></span>
                        <img className="ecoin" src={ecoin} alt="ecoin"></img>
                    </div>
                    <div className="tabs">
                        <NavLink 
                            to="/boutique?tab=articles"
                            className={this.state.tab === 'articles' ? 'current-shop-tab' : ''}
                            >Articles
                        </NavLink>
                        <NavLink 
                            to="/boutique?tab=commandes"
                            className={this.state.tab === 'commandes' ? 'current-shop-tab' : ''}
                            >Mes commandes
                        </NavLink>
                        <NavLink 
                            to="/boutique?tab=panier"
                            className={this.state.tab === 'panier' ? 'current-shop-tab' : ''}
                            >Mon panier<span className="dot">3</span>
                        </NavLink>
                    </div>
                </div>

                { this.state.tab === 'articles' && !this.state.id && <ShopArticles/>}
                { this.state.id && <ShopArticleId/>}
                { this.state.tab === 'panier' && !this.state.id && <ShopCart/>}
                { this.state.tab === 'commandes' && <ShopCommands/>}

            </div>
        );
    }
}