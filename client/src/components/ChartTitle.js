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
            <div className="list-group list-group-horizontal list-group-flush">
                <a
                    className="list-group-item px-1 text-reset"
                    href={`https://etherscan.io/address/${priceObject.baseToken.address.toLowerCase()}`}
                    target="_blank" rel="noreferrer noopener">
                    <div className="d-flex align-items-center">
                        {showLogos ? 
                            <img className="me-1 charttitle-logo" src={baseLogo}></img>
                        :
                        <div></div>}
                        <h2 className="w-100">{`${priceObject.baseToken.symbol}`}</h2>
                    </div>
                </a>                
                <a className="list-group-item px-0 text-reset"><h2>/</h2></a>
                <a
                    className="list-group-item px-1 text-reset"
                    href={`https://etherscan.io/address/${priceObject.quoteToken.address.toLowerCase()}`}
                    target="_blank" rel="noreferrer noopener">
                    <div className="d-flex align-items-center">
                        {showLogos ? 
                            <img className="me-1 charttitle-logo" src={quoteLogo}></img>
                        :
                        <div></div>}
                        <h2 className="w-100">{`${priceObject.quoteToken.symbol}`}</h2>                            
                    </div>
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