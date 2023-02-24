import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    cancelConfiguration,
    selectIndicatorType,
    selectNPeriods,
    selectArrayType,
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

    const handleArrayTypeChange = (event) => {
        dispatch(selectArrayType(event.target.value, priceObject.arrayOHLC))
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
        <div className="mb-2 col-12 mx-auto">
        {showIndicatorDialog && currentIndicator.id === props.indicatorId ? 
            <form aria-labelledby="btnGroupDrop1" onSubmit={handleSubmit}>
                <fieldset>
                    <div className="d-flex align-items-center justify-content-between">
                        {indicators.map((indicator, index) => {
                            return (
                                    <div key={index} className="form-check mt-2">
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
                <div className="d-flex align-items-center justify-content-between">
                        <label htmlFor={`number-periods-${currentIndicator.id}`} className="col-form-label col-form-label-sm">Candles number</label>
                       <label htmlFor={`array-type-${currentIndicator.id}`} className="col-form-label col-form-label-sm">Price array</label>
                </div>
                <div className="row">
                    <div className="col">
                        <input
                            type="number"
                            className="form-control form-control-sm"
                            id={`number-periods-${currentIndicator.id}`}
                            value={currentIndicator.nPeriods}
                            onChange={handleNPeriodsChange}
                        ></input>
                    </div>
                    <div className="col">
                        <select
                            className="form-select form-select-sm"
                            aria-label="Array select"
                            id={`array-type-${currentIndicator.id}`}
                            defaultValue={currentIndicator.arrayType}
                            onChange={handleArrayTypeChange}>
                            {priceObject.arrayTypes.map((type, index) => {
                                return <option key={index} value={type}>{type}</option>
                            })}
                        </select>
                    </div>
                </div>
                <div className="d-flex align-items-center justify-content-between mt-3">
                        <button type="submit" className="btn btn-primary btn-settings btn-sm"
                            style={{float: 'left'}}
                            disabled={currentIndicator.nPeriods === ''}
                        >{props.buttonText}</button>
                        <button className="btn btn-secondary btn-settings btn-sm" style={{float: 'right'}} onClick={handleCancel}>Cancel</button>
                </div>
            </form>
         :
          ''}
        </div>
    )

}

export default IndicatorSettings;