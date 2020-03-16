//React
import React, { Component } from "react";
//Redux
import { connect } from "react-redux";
import { addCart, deleteCart, addCommand } from "../actions";
//Components
import DotsLoader from '../components/DotsLoader';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
//Libs
import { useTable } from 'react-table'
//Images
import ecoin from "../images/e-coin.png";

function Table({ columns, data }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data
    })

    return (
        <table {...getTableProps()}>
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}


class Cart extends Component {
    onChange = this.onChange.bind(this);
    quantityChange = this.quantityChange.bind(this);
    deleteCart = this.deleteCart.bind(this);
    navToStep2 = this.navToStep2.bind(this);
    onSubmit = this.onSubmit.bind(this);
    state = {
        step: 1,
        loading: false,
        promoCode: '',
        givenName: '',
        familyName: '',
        address1: '',
        address2: '',
        postalCode: '',
        city: '',
        country: '',
        phoneNumber: ''
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    quantityChange(e) {
        this.setState({ [e.target.name]: e.target.value });
        this.props.addCart(e.target.name, e.target.value, true);
    }

    deleteCart(articleId) {
        this.props.deleteCart(articleId);
    }

    navToStep2() {
        let totalPrice = 0;
        this.props.cartArticles.forEach(el => totalPrice += el.price * el.quantity);

        if (this.props.userEcoin > totalPrice) {
            this.setState({ step: 2 });
        }
        else {
            this.refs.errorCart.style.display = 'block';
        }
    }

    onSubmit(e) {
        e.preventDefault();
        const {
            givenName,
            familyName,
            address1,
            postalCode,
            city,
            country,
        } = this.state;
        let address2 = this.state.address2 === '' ? 'X' : this.state.address2;
        let promoCode = this.state.promoCode === '' ? 'X' : this.state.promoCode;
        let phoneNumber = this.state.phoneNumber.replace(/\s/g, '');

        this.refs.errorAddress1.style.display = address1.length >= 10 ? "none" : "inline";
        this.refs.errorPhoneNumber.style.display = phoneNumber.length === 12 ? "none" : "inline";

        if (address1.length >= 10 && phoneNumber.length === 12) {
            this.setState({ loading: true });

            let articles = {};
            this.props.cartArticles.forEach(el => {
                articles[el.articleId] = el.quantity;
            });

            this.props.addCommand(
                articles,
                givenName,
                familyName,
                address1,
                address2,
                postalCode,
                city,
                country,
                phoneNumber,
                promoCode
            ).then(response => {
                this.setState({ loading: false });
                this.props.history.push('/boutique?tab=commandes');
            });
        }
    }

    render() {
        let totalPrice = 0;
        const dataDesktop = this.props.cartArticles.map(el => {
            totalPrice += el.price * el.quantity;
            return {
                image: <div><img src={el.image[0]} alt="mouse"></img></div>,
                name: <div>{el.name}</div>,
                price: <div><span className="number">{el.price}<img className="ecoin" src={ecoin} alt="ecoin"></img></span></div>,
                quantity: <div><input type="number" name={el.articleId} defaultValue={el.quantity} min="1" onChange={this.quantityChange}></input></div>,
                remove: <div><span className="remove-cross" onClick={() => this.deleteCart(el.articleId)}>✕</span></div>
            }
        });
        const columnsDesktop = [
            { Header: '', accessor: 'image' },
            { Header: 'Nom', accessor: 'name' },
            { Header: 'Quantité', accessor: 'quantity' },
            { Header: 'Prix', accessor: 'price' },
            { Header: '', accessor: 'remove' }
        ];

        let dataPhone = [];
        this.props.cartArticles.forEach(el => {
            const firstChunk = {
                1: <div><img src={el.image[0]} alt="mouse"></img></div>,
                2: <div>{el.name}</div>
            }
            const secondChunk = {
                1: <div><span className="number">{el.price}<img className="ecoin" src={ecoin} alt="ecoin"></img></span></div>,
                2: <div><input type="number" name={el.articleId} defaultValue={el.quantity} min="1" onChange={this.quantityChange}></input></div>,
                3: <div><span className="remove-cross" onClick={() => this.deleteCart(el.articleId)}>✕</span></div>
            }
            dataPhone.push(firstChunk);
            dataPhone.push(secondChunk);
        });
        const columnsPhone = [
            { Header: '', accessor: '1' },
            { Header: '', accessor: '2' },
            { Header: '', accessor: '3' }
        ];

        return (
            <>
            { this.state.step === 1 &&
                <div className="shop-cart">
                    <h1><span className="purple">M</span>on Panier</h1>
                    { dataDesktop.length > 0 ?
                        <>
                        <Table className="desktop" columns={columnsDesktop} data={dataDesktop} />
                        <Table className="phone" columns={columnsPhone} data={dataPhone} />
                        <div className="promo-total">
                            <div>
                                <span>Vous avez un code promo ?</span>
                                <input
                                    type="text"
                                    placeholder="Entrez le ici"
                                    name="promoCode"
                                    spellCheck={false}
                                    onChange={this.onChange}
                                    value={this.state.promoCode}
                                    required
                                ></input>
                            </div>
                            <div className="total">
                                Total :&nbsp;
                                <span className="number">{totalPrice}<img className="ecoin" src={ecoin} alt="ecoin"></img></span>
                            </div>
                            <button className="e-button" onClick={this.navToStep2}>
                                Passer commande
                            </button>
                        </div>
                        <span ref="errorCart" className="error-input cart">e-Coins insuffisant</span>
                        </>
                        :
                        <span className="empty-cart">Panier vide ¯\_(ツ)_/¯</span>
                    }
                </div>
            }
            { this.state.step === 2 && 
                <div className="shop-expedition">
                    <h1><span className="purple">A</span>dresse d'expédition</h1>
                    <form className="account-form" onSubmit={this.onSubmit}>
                        <div>
                            <div className="label-input">
                                <label htmlFor="givenName">
                                    <span><span className="purple">P</span>rénom</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Prénom"
                                    name="givenName"
                                    spellCheck={false}
                                    onChange={this.onChange}
                                    value={this.state.givenName}
                                    required
                                ></input>
                            </div>

                            <div className="label-input">
                                <label htmlFor="familyName">
                                    <span><span className="purple">N</span>om</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nom"
                                    name="familyName"
                                    spellCheck={false}
                                    onChange={this.onChange}
                                    value={this.state.familyName}
                                    required
                                ></input>
                            </div>

                            <div className="label-input">
                                <label htmlFor="address1">
                                    <span><span className="purple">A</span>dresse</span>
                                    <span ref="errorAddress1" className="error-input address1">invalide</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Adresse"
                                    name="address1"
                                    spellCheck={false}
                                    onChange={this.onChange}
                                    value={this.state.address1}
                                    required
                                ></input>
                            </div>

                            <div className="label-input">
                                <label htmlFor="address2">
                                    <span><span className="purple">C</span>ompléments</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Etage, Bâtiment, Digicode..."
                                    name="address2"
                                    spellCheck={false}
                                    onChange={this.onChange}
                                    value={this.state.address2}
                                ></input>
                            </div>

                            <div className="label-input">
                                <label htmlFor="postalCode">
                                    <span><span className="purple">C</span>ode postal</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Code postal"
                                    name="postalCode"
                                    spellCheck={false}
                                    onChange={this.onChange}
                                    value={this.state.postalCode}
                                    required
                                ></input>
                            </div>

                            <div className="label-input">
                                <label htmlFor="city">
                                    <span><span className="purple">V</span>ille</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ville"
                                    name="city"
                                    spellCheck={false}
                                    onChange={this.onChange}
                                    value={this.state.city}
                                    required
                                ></input>
                            </div>

                            <div className="label-input">
                                <label htmlFor="country">
                                    <span><span className="purple">P</span>ays</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Pays"
                                    name="country"
                                    spellCheck={false}
                                    onChange={this.onChange}
                                    value={this.state.country}
                                    required
                                ></input>
                            </div>

                            <div className="label-input">
                                <label htmlFor="phoneNumber">
                                    <span><span className="purple">T</span>éléphone</span>
                                    <span ref="errorPhoneNumber" className="error-input phone_number">12 caractères requis</span>
                                </label>
                                <PhoneInput
                                    buttonClass="phone-input"
                                    dropdownClass="phone-dropdown"
                                    country={'fr'}
                                    localization={'fr'}
                                    value={this.state.phoneNumber}
                                    onChange={phoneNumber => this.setState({ phoneNumber: phoneNumber })}
                                    inputProps={{
                                        name: 'phoneNumber',
                                        required: true
                                    }}
                                />
                            </div>
                        </div>

                        <button className="e-button">Valider</button>
                        <DotsLoader loading={this.state.loading}/>
                    </form>
                </div>
            }
            </>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addCart: function (articleId, quantity, changeQuantity) {
            return dispatch(addCart(articleId, quantity, changeQuantity));
        },
        deleteCart: function (articleId) {
            dispatch(deleteCart(articleId));
        },
        addCommand: function (articles, givenName,familyName, address1, address2, postalCode, city, country, phoneNumber, promoCode) {
            return dispatch(addCommand(articles, givenName,familyName, address1, address2, postalCode, city, country, phoneNumber, promoCode));
        }
    }
}
export default connect(null, mapDispatchToProps)(Cart);