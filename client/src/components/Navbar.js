import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OnboardingButton } from './Onboarding';
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
      <header className="p-3 bg-dark text-white">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
            <svg className="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"></svg>
          </a>
  
          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li><a href="#" className="nav-link px-2 text-secondary">Home</a></li>
            <li><a href="#" className="nav-link px-2 text-white">Features</a></li>
          </ul>
  
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
            <OnboardingButton />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar;