import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { priceDataSelector } from '../slices/priceData';
import {accountsSelector, loadAccount, loadBalances} from '../slices/accounts';
import { getQuoteAmount, getBaseAmount} from '../helpers/converter';

const TokenBalances = () => {

    const dispatch = useDispatch();

    const {
      priceObject,
    } = useSelector(priceDataSelector);
  
    const { 
      account,
      baseTokenBalance,
      quoteTokenBalance,
      balancesLoading, 
      metamaskInstalled
    } = useSelector(accountsSelector);

    const handleNewAccount = async () => {
        dispatch(loadAccount());
    }

    const getBalances = () => {
        const {baseToken, quoteToken} = priceObject;
        if(baseToken !== {} && quoteToken !== {}) {
          dispatch(loadBalances('0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5', quoteToken.address, account));
        }

    }

    useEffect(() => {
        if (metamaskInstalled) {
          window.ethereum.on('accountsChanged', handleNewAccount);
          return () => {
            window.ethereum.removeListener('accountsChanged', handleNewAccount)
          };
        }
    }, [priceObject.symbol]);

    useEffect(() => {
        if(account !== undefined) {
            getBalances();
        }
    }, [account, priceObject.symbol]);
  
    const balancesData = {
        base: {
            symbol: priceObject.baseToken.symbol,
            decimals: priceObject.baseToken.decimals,
            counterSymbol: priceObject.quoteToken.symbol,
            balance: baseTokenBalance,
            output: 5
        },
        quote: {
            symbol: priceObject.quoteToken.symbol,
            counterSymbol: priceObject.baseToken.symbol,
            decimals: priceObject.quoteToken.decimals,
            balance: quoteTokenBalance,
            output: 5
        }
    }

const amountETHin1 = '1000000000000';

const priceWETHUSD1 = 1355.001; // 1350 dollars (quote) / unit of ETH (base)

const amountUSDOut1 = getQuoteAmount(amountETHin1, priceWETHUSD1, 18);

const priceUSDWETH1 = (parseFloat(1/1500)).toString();

const amountUSDIn1 = '1000000000';

const amountETHOut1 = getQuoteAmount(amountUSDIn1, priceUSDWETH1, 6);

console.log('amount ETH 1', amountETHOut1.toString());

console.log('amount USD 1', amountUSDOut1.toString());

const amountUSDIn = '1000000';

const priceWETHUSD = 1000; // 1350 dollars (quote) / unit of ETH (base)

const amountETHOut = getBaseAmount(amountUSDIn, priceWETHUSD, 6);

const priceUSDWETH = (parseFloat(1/1500)).toString();
console.log(priceUSDWETH)

const amountETHin = '1000000000000000000';

const amountUSDOut = getBaseAmount(amountETHin, priceUSDWETH, 18);

console.log('amount ETH', amountETHOut.toString());

console.log('amount USD', amountUSDOut.toString());

    console.log(balancesData.base.decimals, balancesData.quote.decimals)

    const columnNames = ['Account balance', '(Countervalue)'];

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
                                <span className="badge bg-warning">{`${balancesData[key].balance} ${balancesData[key].symbol}`}</span>
                            </td>
                                {/* <i className="p-2 bi bi-arrow-right-circle-fill"></i> */}
                            <td className="text-center">
                                <span className="badge bg-secondary">{`( ${balancesData[key].output} ${balancesData[key].counterSymbol})`}</span>
                            </td>            
                        </tr>
                    )
                })}

            </tbody>
        </table>
    )
}

export default TokenBalances;