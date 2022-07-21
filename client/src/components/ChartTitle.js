import React from 'react';
import { useSelector } from 'react-redux';
import {priceDataSelector} from '../slices/priceData';

const ChartTitle = () => {

    const { priceObject } = useSelector(priceDataSelector);
    
    return (
        <div className="d-flex w-100 align-items-center justify-content-between">
            <div className="d-flex align-items-center">
            <h2 className="p-2 mr-auto">
                {`${priceObject.baseToken.symbol} / ${priceObject.quoteToken.symbol}`}</h2>
            <span></span>
            <a
                href={`https://etherscan.io/address/${priceObject.baseToken.address.toLowerCase()}`}
                target="_blank" rel="noreferrer noopener">
                <img src="https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110" style={{height: "100%"}}></img>
            </a>
            <a
                href={`https://etherscan.io/address/${priceObject.quoteToken.address.toLowerCase()}`}
                target="_blank" rel="noreferrer noopener">
                <img src="https://assets.coingecko.com/coins/images/2518/thumb/weth.png?1628852295" style={{height: "100%"}}></img>
            </a>
            </div>
            <div>
            <a className="btn btn-outline-secondary"
                href={`https://info.uniswap.org/#/pools/${priceObject.poolAddress.toLowerCase()}`}
                target="_blank" rel="noreferrer noopener">
            Pool: {`${priceObject.poolAddress.slice(0,6)}...${priceObject.poolAddress.slice(priceObject.poolAddress.length - 4)}`}</a>
            </div>
        </div>
    )
}

export default ChartTitle;