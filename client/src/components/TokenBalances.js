import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { priceDataSelector } from '../slices/priceData';
import {accountsSelector, loadAccount, loadBalances} from '../slices/accounts';
import { blockchainSelector } from '../slices/blockchain';
import { getQuoteAmount, getBaseAmount, convertFromWei} from '../helpers/converter';
import { BigNumber } from 'ethers';

const TokenBalances = () => {

    const dispatch = useDispatch();

    const {
        loading, 
        priceObject,
    } = useSelector(priceDataSelector);
  
    const { 
      account,
      baseTokenBalance,
      quoteTokenBalance,
      ethBalance,
      balancesLoading, 
      metamaskInstalled
    } = useSelector(accountsSelector);

    const { defaultBlockchain }  = useSelector(blockchainSelector);

    const { nativeTokenAddress } = defaultBlockchain;

    const {baseToken, quoteToken} = priceObject;

    const pretifyNumber = (number, minDecimals, maxDecimals) => {
        const numberString = number.toString();
        const [integerString, decimalString] = numberString.split('.');
        if(decimalString === undefined) {
            return integerString;
        } else if(decimalString === ''.padEnd(decimalString.length, '0')) {
            return integerString;
        } else if(decimalString.length < minDecimals) {
            return numberString;
        } else {
            return parseFloat(numberString).toPrecision(maxDecimals);
        }
    }

    const lastPrice = priceObject.observations[priceObject.endTimestamp];

    let totalBaseBalanceWei = baseTokenBalance;
    let totalQuoteBalanceWei = quoteTokenBalance;
    let totalBaseBalance
    let totalQuoteBalance
    let baseCounterValue;
    let quoteCounterValue;

    // Preparing token balances for display
    if(totalBaseBalanceWei !== undefined && totalQuoteBalanceWei !== undefined && ethBalance !== undefined) {
        if(baseToken.address.toUpperCase() === nativeTokenAddress.toUpperCase()) {
            totalBaseBalanceWei = BigNumber.from(totalBaseBalanceWei).add(BigNumber.from(ethBalance));  
        } else if (quoteToken.address.toUpperCase() === nativeTokenAddress.toUpperCase()) {
            totalQuoteBalanceWei = BigNumber.from(totalQuoteBalanceWei).add(BigNumber.from(ethBalance));
        }

        baseCounterValue = getQuoteAmount(totalBaseBalanceWei, lastPrice, baseToken.decimals);
        quoteCounterValue = getBaseAmount(totalQuoteBalanceWei, lastPrice, quoteToken.decimals);

        const minimumDecimals = 5;
        const maximumDecimals = 6;
        
        totalBaseBalance = convertFromWei(totalBaseBalanceWei, baseToken.decimals);
        totalQuoteBalance = convertFromWei(totalQuoteBalanceWei, quoteToken.decimals);

        totalBaseBalance = pretifyNumber(totalBaseBalance, minimumDecimals, maximumDecimals);
        totalQuoteBalance = pretifyNumber(totalQuoteBalance, minimumDecimals, maximumDecimals);
        baseCounterValue = pretifyNumber(baseCounterValue, minimumDecimals, maximumDecimals);
        quoteCounterValue = pretifyNumber(quoteCounterValue, minimumDecimals, maximumDecimals);
    }
  
    const balancesData = {
        base: {
            symbol: baseToken.symbol,
            decimals: baseToken.decimals,
            counterSymbol: priceObject.quoteToken.symbol,
            balance: totalBaseBalance === undefined ? '' : totalBaseBalance,
            counterValue: baseCounterValue === undefined ? '' : baseCounterValue
        },
        quote: {
            symbol: quoteToken.symbol,
            counterSymbol: baseToken.symbol,
            decimals: quoteToken.decimals,
            balance: totalQuoteBalance === undefined ? '' : totalQuoteBalance,
            counterValue: totalQuoteBalance === undefined ? '' : quoteCounterValue
        }
    }

    const columnNames = ['Account balance', '(Countervalue)'];

    return (
        <div>
            {balancesLoading || loading ? 
            <div className="spinner-border text-secondary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            :
            <table className="table table-borderless table-sm">
                <thead className="thead table-secondary">
                    <tr className="text-center">
                        {columnNames.map((name, index) => {
                            return <th key={index} scope="col"><small>{name}</small></th>
                        })}
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(balancesData).map((key, index) => {
                        return (
                            <tr key={index} >
                                <td className="text-center">
                                    <span className="badge rounded-pill bg-dark" style={{width : "100%"}} >
                                        <small>{`${balancesData[key].balance} ${balancesData[key].symbol}`}</small>
                                    </span>
                                </td>
                                    {/* <i className="p-2 bi bi-arrow-right-circle-fill"></i> */}
                                <td className="text-center">
                                    <span className="badge rounded-pill bg-secondary" style={{width : "100%"}} >
                                        <small>{`( ${balancesData[key].counterValue} ${balancesData[key].counterSymbol})`}</small>
                                    </span>
                                </td>            
                            </tr>
                        )
                    })}
                </tbody>
            </table>            
            }
        </div>
    )
}

export default TokenBalances;