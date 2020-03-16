//React
import React, { Component } from 'react';
//Redux
import { connect } from "react-redux";
import { buyEcoin } from "../actions";
//Components
import DotsLoader from '../components/DotsLoader';
//libs
import Select from 'react-select';
import { CardElement, injectStripe } from 'react-stripe-elements';
//Images
import stripeLogo from "../images/stripe-logo.png";
import ecoin from "../images/e-coin.png";

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
    state = {
        loading: false,
        cardCompleted: false,
        ownersName: '',
        ecoinOption: 500
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit(e) {
        e.preventDefault();
        const { cardCompleted, ownersName, ecoinOption } = this.state;

        if (cardCompleted) {
            this.refs.stripeError.style.display = 'none';
            this.setState({ loading: true });
        
            this.props.stripe.createToken({ name: ownersName })
            .then(response => {
                console.log(response);
                this.props.buyEcoin(ecoinOption, response.token.id).then(response => {
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
            })
        }
        else {
            this.refs.stripeError.style.display = 'inline';
        }
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <div className="wrap-ecoin-price">
                    <div>
                        <label htmlFor="ecoinOption">
                            <span><span className="purple">E</span>coin</span>
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

                <label htmlFor="creditCard">
                    <span><span className="purple">C</span>arte de crédit</span>
                </label>
                <CardElement
                    className="card-field"
                    onChange={e => this.setState({ cardCompleted: e.complete })}
                    style={{ base: { fontFamily: '"Raleway", Arial' } }}
                />

                <p>La transaction est sécurisé et crypté par la solution de paiement Stripe.</p>
                <img className="stripe-logo" src={stripeLogo} alt="stripeLogo"></img>

                <button className="e-button">Valider</button>
                <p ref="stripeError" className="error-input stripe-error">Erreur, veuillez vérifiez vos informations</p>
                <DotsLoader loading={this.state.loading}/>
            </form>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        buyEcoin: function (ecoinAmount, source) {
            return dispatch(buyEcoin(ecoinAmount, source));
        }
    }
}
BuyEcoinForm = injectStripe(BuyEcoinForm);
export default connect(null, mapDispatchToProps)(BuyEcoinForm);