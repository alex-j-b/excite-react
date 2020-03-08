//React
import React, { Component } from "react";
import { Link } from "react-router-dom";
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
    render() {
        const data = [
            {
                image: <img src={mouse} alt="mouse"></img>,
                state: <span>En cours de préparation</span>,
                description: <span>Souris Gamer ouris Gamerrrr Gam</span>,
                quantity: <span className="number">1</span>,
                price: <span className="number">1000<img className="ecoin" src={ecoin} alt="ecoin"></img></span>
            },
            {
                image: <img src={mouse} alt="mouse"></img>,
                state: <span>En cours de préparation</span>,
                description: <span>Souris Gamer</span>,
                quantity: <span className="number">1</span>,
                price: <span className="number">1000<img className="ecoin" src={ecoin} alt="ecoin"></img></span>
            },
            {
                image: <img src={mouse} alt="mouse"></img>,
                state: <span>En cours de préparation</span>,
                description: <span>Souris Gamer</span>,
                quantity: <span className="number">1</span>,
                price: <span className="number">1000<img className="ecoin" src={ecoin} alt="ecoin"></img></span>
            }
        ];

        const columns = [
            { Header: '', accessor: 'image' },
            { Header: 'Etat', accessor: 'state' },
            { Header: 'Description', accessor: 'description' },
            { Header: 'Quantité', accessor: 'quantity' },
            { Header: 'Prix', accessor: 'price' }
        ];

        return (
            <div className="shop-cart">
                <h1><span className="purple">M</span>es commandes</h1>
                <Table columns={columns} data={data} />
            </div>
        );
    }
}