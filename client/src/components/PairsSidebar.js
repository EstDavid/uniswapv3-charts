import React from 'react';
import { useSelector } from 'react-redux';
import PairsList from './PairsList';
import { pairsListsSelector } from '../slices/pairsLists';

const PairsSidebar = () => {
    const {quoteSymbols, pairsListsLoading} = useSelector(pairsListsSelector);

    return(
        <div className="bg-white w-100 d-flex flex-wrap">
            <div className="d-flex align-items-center pb-3 mb-3 w-100 text-decoration-none border-bottom">
                <svg className="bi me-2" width="30" height="24"></svg>
                {pairsListsLoading ? 
                    <span className="spinner-border spinner-border-sm mr2" role="status" aria-hidden="true"></span>
                :
                    <div></div>}
                <span className="fs-5 fw-semibold mx-auto">Pool Pairs</span>
            </div>
            <ul className="list-unstyled ps-0">
                {quoteSymbols.map((symbol, index) => {
                    return <PairsList key={index} listName={`${symbol} pairs`} idNumber={index} listSymbol={symbol} />
                })}
            </ul>
        </div>
    )
}

export default PairsSidebar;