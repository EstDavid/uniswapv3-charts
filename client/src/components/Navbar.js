import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OnboardingButton from './Onboarding';
import { filterInput, pairsListsSelector } from '../slices/pairsLists';
import { fetchPriceData, priceDataSelector} from '../slices/priceData';

const Navbar = () => {

  const dispatch = useDispatch();

  const symbolAll = `ALL`;

  const {
    viewTimeframe
  } = useSelector(priceDataSelector);

  const {
    pairsLists,
    searchPairsLists,
    searchInputs
  } = useSelector(pairsListsSelector);

  const selectSymbol = (event) => {
    event.preventDefault();
    dispatch(fetchPriceData(event.target.text, viewTimeframe));
  }

const filterSymbols = (event) => {
    event.preventDefault();
    dispatch(filterInput(
        event.target.value,
        symbolAll,
        pairsLists[symbolAll]
    ));
}

  return(
      <nav className="p-3 bg-dark text-white">            
        <div className="container-fluid">
          <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
            <a href="/" className="navbar-brand text-white text-decoration-none me-lg-auto">
              <span>UniCharts</span>
            </a>
            <OnboardingButton />  
            <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
              <input 
                type="search"
                className="form-control form-control-dark"
                placeholder="Search symbol..."
                aria-label="Search"
                id="dropdown-results" data-bs-toggle="dropdown" aria-expanded="false"
                onChange={filterSymbols}
                value={searchInputs[symbolAll]}
                />
              <ul className="dropdown-menu" aria-labelledby="dropdown-results">
                  {searchPairsLists[symbolAll].map((symbol, index) => {
                      return <li key={index}>
                                <a href="#" className="dropdown-item link-dark rounded" onClick={selectSymbol}>{symbol}</a>
                              </li>
                  })}
              </ul>
            </form>
            <div className="text-end">
              <a 
                role="button"
                className="btn btn-outline-light me-2"
                href="https://github.com/Vandenynas/uniswapv3-charts"
                target="_blank"
                rel="noreferrer noopener"
              ><i className="bi bi-github"></i>View on Github</a>
            </div>
          </div>
        </div>
    </nav>
  )
}

export default Navbar;