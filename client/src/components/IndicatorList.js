import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {priceDataSelector, deleteMovingAverage, toggleVisibility} from '../slices/priceData';
import {configureExistingIndicator, toggleDialog} from '../slices/indicatorConfig';
import IndicatorSettings from './IndicatorSettings';

const IndicatorList = () => {
    const dispatch = useDispatch();
    const {priceObject, chartObject, indicatorColors, loading} = useSelector(priceDataSelector);

    const handleDelete = (id) => {
        dispatch(deleteMovingAverage(id));
    }

    const handleConfigure = (id) => {
        const [indicatorObject] = chartObject.series.filter((dataObject) => dataObject.id === id);
        dispatch(configureExistingIndicator(indicatorObject, priceObject.arrayOHLC));
        dispatch(toggleDialog());
    }

    const handleVisibility = (id) => {
        dispatch(toggleVisibility(id));
    }

    return (
        <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-white">
                {chartObject.series.map((dataObject, index) => {
                    if (dataObject.id > 1) {
                        return (
                            <div key={dataObject.id} className="list-group-item list-group-item-action py-3 lh-tight">
                                <div className="d-flex w-100 align-items-center justify-content-between">
                                    <small style={{minWidth: "60px"}}>{dataObject.name}</small>
                                    <i className="bi bi-circle-fill" style={{color: indicatorColors[index]}}></i>
                                    <button 
                                        className="btn"
                                        aria-label="Configure"
                                        onClick={() => {handleConfigure(dataObject.id)}}
                                        disabled={loading}
                                    ><i className="bi bi-gear-fill"></i></button>
                                    <button 
                                        className="btn"
                                        aria-label="Configure"
                                        onClick={() => {handleVisibility(dataObject.id)}}
                                        disabled={loading}
                                    ><i className={`bi bi-eye${dataObject.visible ? '' : '-slash'}-fill`}></i></button>
                                    <button 
                                        type="button"
                                        className="btn btn-close btn-sm"
                                        aria-label="Close"
                                        disabled={loading}
                                        onClick={() => {handleDelete(dataObject.id)}} 
                                    ></button>
                                </div>
                                <IndicatorSettings buttonText="Update indicator" indicatorId={dataObject.id} />
                            </div>
                        )

                    }
                })}
        </div>
    )
}

export default IndicatorList;