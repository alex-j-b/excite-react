//React
import React, { Component } from "react";
import { Link } from "react-router-dom";
//Components
import DotsLoader from '../components/DotsLoader';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
//Libs
import { useTable } from 'react-table'
//Images
import ecoin from "../images/e-coin.png";
import mouse from "../images/gamer-mouse.jpg";


function Table({ columns, data }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
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


export default class ShopCart extends Component {
    onChange = this.onChange.bind(this);
    state = {
        step: 2,
        loading: false,
        promoCode: '',
        givenName: '',
        familyName: '',
        address: '',
        address2: '',
        postalCode: '',
        city: '',
        country: '',
        phoneNumber: ''
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        const data = [
            {
                image: <div><img src={mouse} alt="mouse"></img></div>,
                description: <div>Souris Gamer</div>,
                price: <div><span className="number">1000<img className="ecoin" src={ecoin} alt="ecoin"></img></span></div>,
                quantity: <div><input type="number" name="quantity" defaultValue="1" min="1"></input></div>,
                remove: <div><span className="remove-cross">✕</span></div>
            },
            {
                image: <div><img src={mouse} alt="mouse"></img></div>,
                description: <div>Souris Gamer</div>,
                price: <div><span className="number">1000<img className="ecoin" src={ecoin} alt="ecoin"></img></span></div>,
                quantity: <div><input type="number" name="quantity" defaultValue="1" min="1"></input></div>,
                remove: <div><span className="remove-cross">✕</span></div>
            },
            {
                image: <div><img src={mouse} alt="mouse"></img></div>,
                description: <div>Souris Gamer</div>,
                price: <div><span className="number">1000<img className="ecoin" src={ecoin} alt="ecoin"></img></span></div>,
                quantity: <div><input type="number" name="quantity" defaultValue="1" min="1"></input></div>,
                remove: <div><span className="remove-cross">✕</span></div>
            }
        ];
    
        const columns = [
            { Header: '', accessor: 'image' },
            { Header: 'Description', accessor: 'description' },
            { Header: 'Quantité', accessor: 'quantity' },
            { Header: 'Prix', accessor: 'price' },
            { Header: '', accessor: 'remove' }
        ];

        return (
            <>
            { this.state.step === 1 &&
                <div className="shop-cart">
                    <h1><span className="purple">M</span>on Panier</h1>
                    <Table columns={columns} data={data} />
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
                            <span className="number">3000<img className="ecoin" src={ecoin} alt="ecoin"></img></span>
                        </div>
                        <button>Passer commande</button>
                    </div>
                </div>
            }
            { this.state.step === 2 && 
                <div className="shop-expedition">
                    <h1><span className="purple">A</span>dresse d'expédition</h1>
                    <form className="account-form" onSubmit={this.onSubmit}>
                        <div>
                            <div className="wrap-columns">
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

                                <label htmlFor="address1">
                                    <span><span className="purple">A</span>dresse</span>
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

                                <label htmlFor="postalCode">
                                    <span><span className="purple">C</span>ode postal</span>
                                    <span className="error-input postalcode">3 caractères minimum</span>
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

                            <div className="wrap-columns">
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

                                <label htmlFor="city">
                                    <span><span className="purple">V</span>ille</span>
                                    <span className="error-input city">invalide</span>
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

                                <label htmlFor="phoneNumber">
                                    <span><span className="purple">T</span>éléphone</span>
                                    <span className="error-input phone_number">12 caractères requis</span>
                                </label>
                                <PhoneInput
                                    buttonClass="phone-input"
                                    dropdownClass="phone-dropdown"
                                    country={'fr'}
                                    localization={'fr'}
                                    value={this.state.phoneNumber}
                                    onChange={phoneNumber => this.setState({ phoneNumber: phoneNumber })}
                                    inputProps={{
                                        name: 'phoneNumber'
                                    }}
                                />
                            </div>
                            
                        </div>
                        <button>Valider</button>
                        <DotsLoader loading={this.state.loading}/>
                    </form>
                </div>
            }
            </>
        );
    }
}