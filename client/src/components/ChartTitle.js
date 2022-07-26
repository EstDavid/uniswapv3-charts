import React from 'react';
import { useSelector } from 'react-redux';
import {priceDataSelector} from '../slices/priceData';

const ChartTitle = () => {

    const { priceObject } = useSelector(priceDataSelector);

    const baseLogo = priceObject.baseToken.logoURI;
    const quoteLogo = priceObject.quoteToken.logoURI;

    const showLogos = 
        baseLogo !== undefined &&
        baseLogo !== '' && 
        quoteLogo !== undefined &&
        quoteLogo !== ''; 
    
    return (
        <div className="d-flex w-100 align-items-center justify-content-between">
            <div className="d-flex align-items-center">
            <h2 className="p-2 mr-auto">
                {`${priceObject.baseToken.symbol} / ${priceObject.quoteToken.symbol}`}</h2>
            <span></span>
            <a
                href={`https://etherscan.io/address/${priceObject.baseToken.address.toLowerCase()}`}
                target="_blank" rel="noreferrer noopener">
                {showLogos ? 
                    <img src={baseLogo} style={{height: "100%"}}></img>
                :
                <div></div>}
            </a>
            <a
                href={`https://etherscan.io/address/${priceObject.quoteToken.address.toLowerCase()}`}
                target="_blank" rel="noreferrer noopener">
                {showLogos ? 
                    <img src={quoteLogo} style={{height: "100%"}}></img>
                :
                <div></div>}
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