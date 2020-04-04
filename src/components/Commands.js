//React
import React, { Component } from "react";
//Redux
import { connect } from "react-redux";
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


class Commands extends Component {
    render() {
        let dataDesktop = [];
        this.props.commandArticles.forEach(elCommand => {
            elCommand.articles.forEach((elArticle, idx) => {
                let withDate = <div><span className="number">{elCommand.date}</span><img src={elArticle.image[0]} alt="mouse"></img></div>;
                let withoutDate = <div><img src={elArticle.image[0]} alt="mouse"></img></div>;
                let imageHtml = idx === 0 ? withDate : withoutDate;

                const articleHtml = {
                    image: imageHtml,
                    state: <div>{elCommand.state}</div>,
                    name: <span>{elArticle.name}</span>,
                    quantity: <span className="number">{elArticle.quantity}</span>,
                    price: <span className="number">{elArticle.price}<img className="ecoin" src={ecoin} alt="ecoin"></img></span>
                }
                dataDesktop.push(articleHtml);
            });
        });
        const columnsDesktop = [
            { Header: '', accessor: 'image' },
            { Header: 'Etat', accessor: 'state' },
            { Header: 'Nom', accessor: 'name' },
            { Header: 'Quantité', accessor: 'quantity' },
            { Header: 'Prix', accessor: 'price' }
        ];

        let dataPhone = [];
        this.props.commandArticles.forEach(elCommand => {
            elCommand.articles.forEach((elArticle, idx) => {
                let withDate = <div><span className="number">{elCommand.date}</span><img src={elArticle.image[0]} alt="mouse"></img></div>;
                let withoutDate = <div><img src={elArticle.image[0]} alt="mouse"></img></div>;
                let imageHtml = idx === 0 ? withDate : withoutDate;

                const firstChunk = {
                    1: imageHtml,
                    2: <div>{elCommand.state}</div>,
                }
                const secondChunk = {
                    1: <span>{elArticle.name}</span>,
                    2: <span className="number">{elArticle.quantity}</span>,
                    3: <span className="number">{elArticle.price}<img className="ecoin" src={ecoin} alt="ecoin"></img></span>
                }
                dataPhone.push(firstChunk);
                dataPhone.push(secondChunk);
            });
        });
        const columnsPhone = [
            { Header: '', accessor: '1' },
            { Header: '', accessor: '2' },
            { Header: '', accessor: '3' }
        ];

        return (
            <div className="shop-cart">
                <p className="title"><span className="purple">M</span>es commandes</p>
                { dataDesktop.length > 0 ?
                    <>
                    <Table className="desktop" columns={columnsDesktop} data={dataDesktop} />
                    <Table className="phone" columns={columnsPhone} data={dataPhone} />
                    </>
                    :
                    <span className="empty-cart">Aucune commande ¯\_(ツ)_/¯</span>
                }
            </div>
        );
    }
}

function mapStateToProps(reduxState) {
    return {
        commandArticles: reduxState.commandArticles
    };
}
export default connect(mapStateToProps, null)(Commands);