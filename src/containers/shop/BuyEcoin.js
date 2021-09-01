//React
import React, { Component } from 'react';
import config from '../../config';
import './BuyEcoin.css';
//Component
import BuyEcoinForm from '../../components/shop/BuyEcoinForm';
//libs
import { Elements, StripeProvider } from 'react-stripe-elements';
//Images
import {
    generalBG,
    ecoin
} from "../../assets/export.js";

class BuyEcoin extends Component {

    componentDidMount() {
        let title = document.querySelector('head > title');
        title.innerHTML = 'Excite | Obtenir des eCoins';
    }

    render() {
        return (
            <div className="buy-ecoin" style={{ backgroundImage: `url(${generalBG})` }}>
                <div>
                    <p className="title">
                        <span className="purple">O</span>btenir des eCoins&nbsp;
                        <img className="ecoin" src={ecoin} alt="ecoin"></img>
                    </p>
                    <StripeProvider apiKey={config.stripe.STRIPE_PUBLIC_KEY}>
                        <Elements>
                            <BuyEcoinForm history={this.props.history} />
                        </Elements>
                    </StripeProvider>
                </div>
            </div>
        );
    }
}

export default BuyEcoin;