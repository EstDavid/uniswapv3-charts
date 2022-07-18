import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    cancelConfiguration,
    selectIndicatorType,
    selectNPeriods,
    toggleDialog,
    indicatorConfigSelector
} from '../slices/indicatorConfig';
import {priceDataSelector} from '../slices/priceData';
import { addMovingAverage, updateExistingIndicator } from '../slices/priceData';

const IndicatorSettings = (props) => {
    const dispatch = useDispatch();

    const {indicators, showIndicatorDialog, currentIndicator} = useSelector(indicatorConfigSelector);
    
    const {priceObject} = useSelector(priceDataSelector);

    const handleRadioChange = (event) => {
        dispatch(selectIndicatorType(event.target.value, priceObject.arrayOHLC))
    }

    const handleNPeriodsChange = (event) => {
        dispatch(selectNPeriods(event.target.value, priceObject.arrayOHLC));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(currentIndicator.id === 0) {
            dispatch(addMovingAverage(currentIndicator));
        } else {
            dispatch(updateExistingIndicator(currentIndicator));
        }
        dispatch(cancelConfiguration());
        dispatch(toggleDialog());
    }

    const handleCancel = () => {
        dispatch(cancelConfiguration());
        dispatch(toggleDialog());
    }

    return(
        <div className="row mb-2">
        {showIndicatorDialog && currentIndicator.id === props.indicatorId ? 
            <form aria-labelledby="btnGroupDrop1" onSubmit={handleSubmit}>
                <fieldset>
                    <div className="form-group col-sm-2">
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
                                        checked={indicator === currentIndicator.typeMA ? true : false}
                                    ></input>
                                    <label className="form-check-label" htmlFor={`gridRadios1${index}`}>
                                        {indicator}
                                    </label>
                                </div>
                            )

                        })}
                    </div>
                </fieldset>
                <div className="form-group">
                    <label htmlFor="number-periods" className="col-form-label">Number of periods</label>
                    <input 
                        type="number"
                        className="form-control"
                        id="number-periods"
                        value={currentIndicator.nPeriods}
                        onChange={handleNPeriodsChange}
                    ></input>
                </div>
                <div className="row">
                    <button type="submit" className="btn btn-primary btn-block"
                        disabled={currentIndicator.nPeriods === ''}
                        >{props.buttonText}</button>
                    <button className="btn btn-secondary btn-block" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
         :
          <h1></h1>}
        </div>
    )

}

export default IndicatorSettings;