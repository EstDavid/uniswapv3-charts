import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {priceDataSelector, deleteMovingAverage} from '../slices/priceData';
import {configureExistingIndicator, toggleDialog} from '../slices/indicatorConfig';
import IndicatorSettings from './IndicatorSettings';

const IndicatorList = () => {
    const dispatch = useDispatch();
    const {priceObject, chartObject} = useSelector(priceDataSelector);

    const handleDelete = (id) => {
        dispatch(deleteMovingAverage(id));
    }

    const handleConfigure = (id) => {
        const [indicatorObject] = chartObject.series.filter((dataObject) => dataObject.id === id);
        dispatch(configureExistingIndicator(indicatorObject, priceObject.arrayOHLC));
        dispatch(toggleDialog());
    }

    return (
        <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-white" style={{ width: "380 px" }}>

            <div className="list-group list-group-flush border-bottom scrollarea">
                {chartObject.series.map((dataObject) => {
                    if (dataObject.id > 1) {
                        return (
                            <a key={dataObject.id} href="#" className="list-group-item list-group-item-action py-3 lh-tight">
                                <div className="d-flex w-100 align-items-center justify-content-between">
                                    <strong className="mb-1">{dataObject.name}</strong>
                                    <button 
                                        className="btn"
                                        aria-label="Configure"
                                        onClick={() => {handleConfigure(dataObject.id)}} 
                                    ><i className="bi bi-gear-fill"></i></button>
                                    <button 
                                        type="button"
                                        className="btn btn-close"
                                        aria-label="Close"
                                        onClick={() => {handleDelete(dataObject.id)}} 
                                    ></button>
                                </div>
                                <IndicatorSettings buttonText="Update indicator" indicatorId={dataObject.id} />
                            </a>
                        )

                    }
                })}
            </div>
        </div>
    )
}

export default IndicatorList;