import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPriceData, priceDataSelector} from '../slices/priceData';
  

const PairsList = (props) => {
    const dispatch = useDispatch();

    const {
        viewTimeframe
      } = useSelector(priceDataSelector);


    const selectSymbol = (event) => {
        event.preventDefault();
        console.log(event.target.text)
        dispatch(fetchPriceData(event.target.text, viewTimeframe));
    }

    return (
        <li className="mb-1">
            <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target={`#dashboard-collapse-${props.idNumber}`} aria-expanded="false">
                {props.listName}
            </button>
            <div className="collapse" id={`dashboard-collapse-${props.idNumber}`}>
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                    <li><a href="#" className="link-dark rounded" onClick={selectSymbol}>AAVEWETH</a></li>
                    <li><a href="#" className="link-dark rounded" onClick={selectSymbol}>WETHUSDC</a></li>
                    <li><a href="#" className="link-dark rounded" onClick={selectSymbol}>WBTCUSDC</a></li>
                    <li><a href="#" className="link-dark rounded" onClick={selectSymbol}>FRAXWETH</a></li>
                </ul>
            </div>
        </li>
    )
}

export default PairsList;