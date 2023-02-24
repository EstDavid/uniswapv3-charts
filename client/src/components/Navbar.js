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
    <nav className="navbar navbar-expand-lg navbar-primary bg-primary text-white pb-2" aria-label="UniCharts navbar">
      <div className="container-fluid">
        <a href="/" className="navbar-brand text-white text-decoration-none me-md-auto d-flex align-items-center">
          <h1><span className="badge bg-secondary me-2 p-2">UC</span></h1>
          <h2>UniCharts</h2>
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu" aria-controls="navbar-menu" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbar-menu">
          <div className="navbar-nav ms-auto d-flex gap-2">
            <OnboardingButton/>
            <form className="nav-item dropdown col-10 col-md-6 col-lg mx-auto">
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
                    <a href="#" className="dropdown-item rounded" onClick={selectSymbol}>{symbol}</a>
                  </li>
                })}
              </ul>
            </form>
            <a
              role="button"
              className="btn btn-outline-light col-10 col-md-6 col-lg mx-auto"
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