import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { 
    configureNewIndicator,
    toggleDialog,
    indicatorConfigSelector
} from '../slices/indicatorConfig';
import {priceDataSelector} from '../slices/priceData';

const IndicatorButton = (props) => {
    const dispatch = useDispatch();

    const {loading, indicatorsLimit, priceObject, chartObject} = useSelector(priceDataSelector);

    const { showIndicatorDialog, configuringIndicator } = useSelector(indicatorConfigSelector);
    
    const handleToggle = () => {
        dispatch(toggleDialog());
        if(!configuringIndicator) {
            dispatch(configureNewIndicator(priceObject.arrayOHLC));
        }
    }

    const indicatorLimitReached = chartObject.series.length - 1 >= indicatorsLimit;

    return(
        <div className="mb-2">
            <button 
                className="btn btn-primary"
                id="add-indicator"
                aria-expanded={showIndicatorDialog}
                onClick={handleToggle}
                disabled={loading || indicatorLimitReached} > 
                {props.buttonText}
            </button>
            <br></br>
            {indicatorLimitReached ? <small className="text-muted">Max number of indicators reached</small> : ''}
        </div>
    )

}

export default IndicatorButton;