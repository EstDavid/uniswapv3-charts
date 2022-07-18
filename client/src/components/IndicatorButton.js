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

    const {priceObject} = useSelector(priceDataSelector);

    const { showIndicatorDialog, configuringIndicator } = useSelector(indicatorConfigSelector);
    
    const handleToggle = () => {
        dispatch(toggleDialog());
        if(!configuringIndicator) {
            dispatch(configureNewIndicator(priceObject.arrayOHLC));
        }
    }

    return(
        <button className="btn btn-primary" id="add-indicator" aria-expanded={showIndicatorDialog} onClick={handleToggle}> 
            {props.buttonText}
        </button>
    )

}

export default IndicatorButton;