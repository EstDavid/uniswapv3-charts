import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPriceData, priceDataSelector} from '../slices/priceData';
import { fetchPairsLists, filterInput, pairsListsSelector } from '../slices/pairsLists';

const PairsList = (props) => {
    const dispatch = useDispatch();

    const {
        viewTimeframe
    } = useSelector(priceDataSelector);

    const {
        pairsListsLoading,
        pairsListError,
        pairsLists,
        searchPairsLists,
        searchInputs
    } = useSelector(pairsListsSelector);

    useEffect(() => {
        dispatch(fetchPairsLists());
    }, [dispatch]);


    const selectSymbol = (event) => {
        event.preventDefault();
        dispatch(fetchPriceData(event.target.text, viewTimeframe));
    }

    const filterSymbols = (event) => {
        event.preventDefault();
        dispatch(filterInput(
            event.target.value,
            props.listSymbol,
            pairsLists[props.listSymbol]
        ));
    }

    return (
        <li className="mb-1" key={props.idNumber}>
            <button 
                className="btn btn-toggle align-items-center rounded collapsed"
                data-bs-toggle="collapse" data-bs-target={`#dashboard-collapse-${props.idNumber}`}
                aria-expanded="false"
                disabled={pairsListsLoading}
            >
                {props.listName}
            </button>
            <div className="collapse" id={`dashboard-collapse-${props.idNumber}`}>
                    <input 
                        type="text"
                        placeholder={`Search ${props.listSymbol} symbol...`}
                        id={`search-${props.listSymbol.toLowerCase()}`}
                        onChange={filterSymbols}
                        value={searchInputs[props.listSymbol]} 
                    />
                    <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                        {searchPairsLists[props.listSymbol].map((symbol, index) => {
                            return <li key={index}><a href="#" className="link-dark rounded" onClick={selectSymbol}>{symbol}</a></li>
                        })}
                    </ul>
            </div>

        </li>
    )
}

export default PairsList;