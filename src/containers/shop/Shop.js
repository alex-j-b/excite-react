//React
import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Shop.css";
//Redux
import { connect } from "react-redux";
import { getShopArticles, getCart, getCommand } from '../../redux/actions/shopActions';
//Components
import Articles from '../../components/shop/Articles';
import ArticleId from '../../components/shop/ArticleId';
import Cart from '../../components/shop/Cart';
import Commands from '../../components/shop/Commands';
import CircleLoader from '../../components/loaders/CircleLoader';
//Images
import {
    ecoin,
    backArrow,
    articlesIcon,
    commandesIcon,
    panierIcon
} from "../../assets/export.js";


class Shop extends Component {
    switchTab = this.switchTab.bind(this);
    state = {
        loading: false,
        tab: 'articles',
        id: false
    }

    switchTab(tab) {
        this.setState({ tab: tab });
    }

    componentDidUpdate(prevProps) {
        if (this.props.isLogged !== prevProps.isLogged) {
            this.props.getCart().then(response => {
                if (this.state.tab === 'panier') this.setState({ loading: false });
            });
            this.props.getCommand().then(response => {
                if (this.state.tab === 'commandes') this.setState({ loading: false });
            });
        }

        let urlParams = (new URL(document.location)).searchParams;
        if ((urlParams.get('tab') !== this.state.tab) || (urlParams.get('id') !== this.state.id)) {
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

        if ((this.state.tab !== 'articles') || (this.state.tab === 'articles' && this.props.shopArticles.length === 0)) {
            this.setState({ loading: true });
        }

        this.props.getShopArticles().then(response => {
            if (this.state.tab === 'articles') this.setState({ loading: false });
        });

        if (this.props.isLogged) {
            this.props.getCart().then(response => {
                if (this.state.tab === 'panier') this.setState({ loading: false });
            });
            this.props.getCommand().then(response => {
                if (this.state.tab === 'commandes') this.setState({ loading: false });
            });
        }
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
                    { this.state.id && <Link
                        to="/boutique?tab=articles"
                        className="back-button"
                        ><img src={backArrow} alt="backArrow"></img>
                    </Link>}

                    { this.props.isLogged &&
                        <Link
                            to={`/ecoin?redirect=${window.location.pathname+window.location.search}`}
                            className="wallet-ecoin"
                        >
                            <label>Mes eCoins : </label><span className="number">{this.props.user['custom:ecoin']}</span>
                            <img className="ecoin" src={ecoin} alt="ecoin"></img>
                        </Link>
                    }

                    <div className="tabs">
                        <Link
                            to="/boutique?tab=articles"
                            className={this.state.tab === 'articles' ? 'current-shop-tab' : ''}
                            style={{ backgroundColor: `${this.state.tab === 'articles' ? 'white' : 'transparent'}` }}
                            onClick={() => this.switchTab('articles')}
                            ><span>Articles</span>
                            <img src={articlesIcon} alt="articlesIcon" style={{ filter: `${this.state.tab === 'articles' ? '' : 'invert(100%)'}` }}></img>
                        </Link>
                        <Link
                            to="/boutique?tab=commandes"
                            className={this.state.tab === 'commandes' ? 'current-shop-tab' : ''}
                            style={{ backgroundColor: `${this.state.tab === 'commandes' ? 'white' : 'transparent'}` }}
                            onClick={() => this.switchTab('commandes')}
                            ><span>Mes commandes</span>
                            <img src={commandesIcon} alt="commandesIcon" style={{ filter: `${this.state.tab === 'commandes' ? '' : 'invert(100%)'}` }}></img>
                        </Link>
                        <Link
                            to="/boutique?tab=panier"
                            className={this.state.tab === 'panier' ? 'current-shop-tab' : ''}
                            style={{ backgroundColor: `${this.state.tab === 'panier' ? 'white' : 'transparent'}` }}
                            onClick={() => this.switchTab('panier')}
                            ><span>Mon panier</span>
                            <img src={panierIcon} alt="panierIcon" style={{ filter: `${this.state.tab === 'panier' ? '' : 'invert(100%)'}` }}></img>
                            {this.props.cartArticles.length > 0 && <span className="dot">{this.props.cartArticles.length}</span>}
                        </Link>
                    </div>
                </div>

                { this.state.tab === 'articles' && !this.state.id && <Articles shopArticles={this.props.shopArticles}/> }
                { this.state.tab === 'panier' && <Cart switchTab={this.switchTab} cartArticles={this.props.cartArticles} history={this.props.history}/> }
                { this.state.tab === 'commandes' && <Commands commandArticles={this.props.commandArticles}/> }
                { articleIdObj && <ArticleId articleIdObj={articleIdObj} history={this.props.history} /> }
                <CircleLoader loading={this.state.loading}/>

            </div>
        );
    }
}

const dispatchToProps = {
    getShopArticles,
    getCart,
    getCommand
}
const mapStateToProps = state => {
    return {
        user: state.user,
        isLogged: state.isLogged,
        shopArticles: state.shopArticles,
        cartArticles: state.cartArticles,
        commandArticles: state.commandArticles
    };
}
export default connect(mapStateToProps, dispatchToProps)(Shop);
