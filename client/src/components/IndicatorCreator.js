import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { selectIndicator, selectNPeriods, indicatorConfigSelector } from '../slices/indicatorConfig';
import { addMovingAverage } from '../slices/priceData';

const IndicatorCreator = () => {
    const dispatch = useDispatch();

    const {indicators, currentIndicator, currentNPeriods} = useSelector(indicatorConfigSelector);
    
    const handleRadioChange = (event) => {
        dispatch(selectIndicator(event.target.value))
    }

    const handleNPeriodsChange = (event) => {
        dispatch(selectNPeriods(event.target.value));
    }

    const handleToggle = (event) => {
        console.log(event.target)
        console.log('toggled!')
    }


    return(
        <div className="row mb-2">
        <button className="btn btn-primary" id="add-indicator" data-bs-toggle="dropdown" aria-expanded="false" onClick={handleToggle}> 
            Add indicator
        </button>

        <form className="dropdown-menu col-sm-2" aria-labelledby="btnGroupDrop1" onChange={handleToggle}>
            <fieldset>
                <div className="col-sm-2">
                    {indicators.map((indicator, index) => {
                        return (
                            <div className="form-check" key={index}>
                                <input 
                                    className="form-check-input"
                                    type="radio"
                                    name="gridRadios"
                                    id={`gridRadios1${index}`}
                                    value={indicator}
                                    onChange={handleRadioChange}
                                    checked={indicator === currentIndicator ? true : false}
                                ></input>
                                <label className="form-check-label" htmlFor={`gridRadios1${index}`}>
                                    {indicator}
                                </label>
                            </div>
                        )

                    })}
                </div>
            </fieldset>
            <div>
                <label htmlFor="number-periods" className="col-form-label">Number of periods</label>
                <input 
                    type="number"
                    className="form-control"
                    id="number-periods"
                    value={currentNPeriods}
                    onChange={handleNPeriodsChange}
                ></input>
            </div>
            <div>
                <label htmlFor="smoothing-periods" className="col-form-label">Smoothing</label>
                <input type="number" className="form-control" id="smoothing-periods"></input>
            </div>
            <button type="submit" className="btn btn-primary">Add indicator</button>
        </form>
        </div>
    )

}

export default IndicatorCreator;