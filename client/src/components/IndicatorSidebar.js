import React from 'react';
import { useSelector } from 'react-redux';
import IndicatorButton from './IndicatorButton';
import IndicatorSettings from './IndicatorSettings';
import IndicatorList from './IndicatorList';

const IndicatorSidebar = () => {

    return(
        <div className="flex-shrink-0 p-3 bg-white" style={{width: "280px"}}>
            <div className="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom">
                <svg className="bi me-2" width="30" height="24"></svg>
                <span className="fs-5 fw-semibold">Indicators</span>
            </div>
            <IndicatorButton buttonText="Add new indicator"/>
            <IndicatorSettings buttonText="Add indicator" indicatorId={0} />
            <IndicatorList />
        </div>
    )
}

export default IndicatorSidebar;