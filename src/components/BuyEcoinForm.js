//React
import React, { Component } from 'react';
import config from '../config';
//Redux
import { connect } from "react-redux";
import { buyEcoin } from "../actions";
//Components
import DotsLoader from '../components/DotsLoader';
//libs
import Select from 'react-select';
import { CardElement, injectStripe } from 'react-stripe-elements';
import { PayPalButton } from "react-paypal-button-v2";
//Images
import stripeLogo from "../images/stripe-logo.png";
import ecoin from "../images/e-coin.png";
import mastercardLogo from "../images/mastercard-logo.png";
import visaLogo from "../images/visa-logo.jpg";
import paypalLogo from "../images/paypal-logo.png";
import paysafecardLogo from "../images/paysafecard-logo.jpg";

const ecoinOptions = [
    { value: '500', label: '500' },
    { value: '1000', label: '1000' },
    { value: '2000', label: '2000' },
    { value: '5000', label: '5000' }
]

const CustomSingleValue = ({ data }) => (
    <div className="input-select">
        <div className="input-select__single-value">
            <span className="number">{data.label}</span>
            <span className="input-select__icon"><img className="ecoin" src={ecoin} alt="ecoin"></img></span>
        </div>
    </div>
);


class BuyEcoinForm extends Component {
    onChange = this.onChange.bind(this);
    onSubmit = this.onSubmit.bind(this);
    switchMethod = this.switchMethod.bind(this);
    state = {
        loading: false,
        method: 'stripe',
        cardCompleted: false,
        ownersName: '',
        ecoinOption: 500
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    switchMethod(method) {
        this.setState({ method: method });
    }

    async onSubmit(e) {
        if (e) e.preventDefault();
        const { cardCompleted, ownersName, ecoinOption } = this.state;

        this.refs.stripeError.style.display = 'none';
        this.setState({ loading: true });

        let source = false;
        if (this.state.method === 'stripe' && cardCompleted) {
            const {error, token} = await this.props.stripe.createToken({ name: ownersName });
            if (error) {
                this.refs.stripeError.style.display = 'inline';
                return;
            } else {
                source = token.id;
            }
        }
        else if (this.state.method === 'stripe' && !cardCompleted) {
            this.refs.stripeError.style.display = 'inline';
        }

        this.props.buyEcoin(this.state.method, ecoinOption, source).then(response => {
            this.setState({ loading: false });
            if (response.statusCode === 200) {
                let urlParams = (new URL(document.location)).searchParams;
                if (urlParams.get('redirect') !== null) {
                    this.props.history.push(urlParams.get('redirect'));
                }
                else {
                    this.props.history.push('/jouer');
                }
            }
            else {
                this.refs.stripeError.style.display = 'inline';
            }
        })
    }

    render() {
        return (
            <form name="buy-ecoin" onSubmit={this.onSubmit}>

                <div className="select-method">

                    <div onClick={() => this.switchMethod('stripe')}>
                        <label htmlFor="stripe">
                            <div>
                                <img className="mastercard-logo" src={mastercardLogo} alt="mastercardLogo"></img>
                                <img className="visa-logo" src={visaLogo} alt="visaLogo"></img>
                            </div>
                            <input type="radio" name="radio" value="stripe" checked={this.state.method === 'stripe'} readOnly></input>
                        </label>
                    </div>

                    <div onClick={() => this.switchMethod('paypal')}>
                        <label htmlFor="paypal">
                            <img className="paypal-logo" src={paypalLogo} alt="paypalLogo"></img>
                            <input type="radio" name="radio" value="paypal" checked={this.state.method === 'paypal'} readOnly></input>
                        </label>
                    </div>

                    <div onClick={() => this.switchMethod('paysafecard')}>
                        <label htmlFor="paysafecard">
                            <img className="paysafecard-logo" src={paysafecardLogo} alt="paysafecardLogo"></img>
                            <input type="radio" name="radio" value="paysafecard" checked={this.state.method === 'paysafecard'} readOnly></input>
                        </label>
                    </div>

                </div>

                <div className="ecoin-amount">
                    <div>
                        <label htmlFor="ecoinOption">
                            <span><span className="purple">e</span>Coins</span>
                        </label>
                        <Select
                            className="select-ecoin"
                            options={ecoinOptions}
                            defaultValue={ecoinOptions[0]}
                            components={{ SingleValue: CustomSingleValue }}
                            blurInputOnSelect={true}
                            isSearchable={false}
                            isDisabled={this.state.betIsPending}
                            onChange={obj => this.setState({ ecoinOption: obj.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="price">
                            <span><span className="purple">P</span>rix</span>
                        </label>
                        <span className="number">{Number(this.state.ecoinOption)/100}€</span>
                    </div>
                </div>

                <div className="method stripe" style={{ display: this.state.method === 'stripe' ? 'flex' : 'none' }}>
                    <label htmlFor="ownersName">
                        <span><span className="purple">N</span>om du titulaire</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Nom du titulaire"
                        name="ownersName"
                        spellCheck={false}
                        onChange={this.onChange}
                        value={this.state.ownersName}
                        required
                    ></input>

                    <label htmlFor="stripe">
                        <span><span className="purple">C</span>arte de crédit</span>
                    </label>
                    <CardElement
                        className="card-field"
                        onChange={e => this.setState({ cardCompleted: e.complete })}
                        style={{ base: { fontFamily: '"Raleway", Arial' } }}
                    />

                    <p>La transaction est sécurisée et cryptée par la solution de paiement Stripe.</p>
                    <img className="stripe-logo" src={stripeLogo} alt="stripeLogo"></img>
                    <button className="e-button">Valider</button>
                    <p ref="stripeError" className="error-input stripe-error">Erreur, veuillez vérifiez vos informations</p>
                </div>

                <div className="method paypal" style={{ display: this.state.method === 'paypal' ? 'flex' : 'none' }}>
                    <PayPalButton
                        options={{
                            clientId: config.paypal.CLIENT_ID,
                            currency: "EUR"
                        }}
                        //amount={Number(this.state.ecoinOption)/100}
                        amount={0.01}
                        shippingPreference="NO_SHIPPING"
                        onSuccess={(details, data) => {
                            this.setState({ loading: true });
                            this.onSubmit();
                        }}
                    />
                </div>

                <div className="method paysafecard" style={{ display: this.state.method === 'paysafecard' ? 'flex' : 'none' }}>
                    <button className="e-button">paysafecard</button>
                </div>

                <DotsLoader loading={this.state.loading}/>
            </form>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        buyEcoin: function (method, ecoinAmount, source) {
            return dispatch(buyEcoin(method, ecoinAmount, source));
        }
    }
}
BuyEcoinForm = injectStripe(BuyEcoinForm);
export default connect(null, mapDispatchToProps)(BuyEcoinForm);