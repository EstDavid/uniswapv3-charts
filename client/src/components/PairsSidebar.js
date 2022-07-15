import React from 'react';
import { useSelector } from 'react-redux';
import PairsList from './PairsList';
import { pairsListsSelector } from '../slices/pairsLists';

const PairsSidebar = () => {
    const {quoteSymbols} = useSelector(pairsListsSelector);

    return(
        <div className="flex-shrink-0 p-3 bg-white" style={{width: "280px"}}>
            <a href="/" className="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom">
                <svg className="bi me-2" width="30" height="24"></svg>
                <span className="fs-5 fw-semibold">Pool Pairs</span>
            </a>
            <ul className="list-unstyled ps-0">
                {quoteSymbols.map((symbol, index) => {
                    return <PairsList key={index} listName={`${symbol} pairs`} idNumber={index} listSymbol={symbol} />
                })}
            </ul>
        </div>
    )
}

export default PairsSidebar;