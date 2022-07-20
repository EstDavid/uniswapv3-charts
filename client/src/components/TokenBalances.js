import React from 'react';

const TokenBalances = (props) => {


    console.log(parseFloat((16763553889).toPrecision(9)))
    const balancesData = {
        base: {
            symbol: props.baseTokenSymbol,
            counterSymbol: props.quoteTokenSymbol,
            balance: props.baseTokenBalance,
            output: 5
        },
        quote: {
            symbol: props.quoteTokenSymbol,
            counterSymbol: props.baseTokenSymbol,
            balance: props.quoteTokenBalance,
            output: 5
        }
    }

    const columnNames = ['Account balance', '(Output if converted)'];

    return (
        <table className="table">
            <thead className="thead-light">
                <tr className="text-center">
                    {columnNames.map((name, index) => {
                        return <th key={index} scope="col">{name}</th>
                    })}
                </tr>
            </thead>
            <tbody>
                {Object.keys(balancesData).map((key, index) => {
                    return (
                        <tr key={index} >
                            <td className="text-center">
                                <h5>
                                    <span className="badge bg-primary">{`${balancesData[key].balance} ${balancesData[key].symbol}`}</span>
                                </h5>
                            </td>
                                {/* <i className="p-2 bi bi-arrow-right-circle-fill"></i> */}
                            <td className="text-center">
                                <h5>
                                    <span className="badge bg-secondary">{`( ${balancesData[key].output} ${balancesData[key].counterSymbol})`}</span>
                                </h5>
                            </td>            
                        </tr>
                    )
                })}

            </tbody>
        </table>
    )
}

export default TokenBalances;