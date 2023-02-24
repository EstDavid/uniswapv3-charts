import React from 'react';
import { useSelector } from 'react-redux';
import {priceDataSelector} from '../slices/priceData';

const TokenDisplay = (props) => {
    return(
        <a
            className="list-group-item px-1 text-reset border-0"
            href={`https://etherscan.io/address/${props.address.toLowerCase()}`}
            target="_blank" rel="noreferrer noopener">
            <div className="d-flex align-items-center">
                {props.showLogos ? 
                    <img className="me-1 charttitle-logo" src={props.logoURI}></img>
                :
                <div></div>}
                <h2 className="w-100">{`${props.symbol}`}</h2>
            </div>
        </a>
    )

}

const ChartTitle = () => {

    const { priceObject } = useSelector(priceDataSelector);

    const baseLogo = priceObject.baseToken.logoURI;
    const quoteLogo = priceObject.quoteToken.logoURI;

    const showTokens = priceObject.baseToken.address !== undefined &&
        priceObject.quoteToken.address !== undefined

    const showLogos = 
        baseLogo !== undefined &&
        baseLogo !== '' && 
        quoteLogo !== undefined &&
        quoteLogo !== ''; 
    
    return (
        <div className="col-12 d-flex flex-wrap w-100 align-items-center justify-content-between mb-2">
            <div className="list-group list-group-horizontal list-group-flush mx-auto mx-md-0">
                { showTokens ? 
                    <>
                        <TokenDisplay 
                            address={priceObject.baseToken.address} 
                            symbol={priceObject.baseToken.symbol}
                            showLogos={showLogos}
                            logoURI={baseLogo} 
                        />                
                        <a className="list-group-item px-0 text-reset border-0"><h2>/</h2></a>
                        <TokenDisplay 
                            address={priceObject.quoteToken.address} 
                            symbol={priceObject.quoteToken.symbol}
                            showLogos={showLogos}
                            logoURI={quoteLogo} 
                        /> 
                    </>
                :
                    <div style={{height: "60px"}}>
                    </div>
                }
            </div>
            { showTokens ? 
                <div className="col-10 col-md-4 mx-auto mx-md-0 text-center">
                    <a className="btn btn-outline-secondary w-100"
                        href={`https://info.uniswap.org/#/pools/${priceObject.poolAddress.toLowerCase()}`}
                        target="_blank" rel="noreferrer noopener">
                    Pool: {`${priceObject.poolAddress.slice(0,6)}...${priceObject.poolAddress.slice(priceObject.poolAddress.length - 4)}`}</a>
                </div>        
            :
                null
            }
        </div>
    )
}

export default ChartTitle;