import React from 'react';
import { useSelector } from 'react-redux';
import IndicatorButton from './IndicatorButton';
import IndicatorSettings from './IndicatorSettings';
import IndicatorList from './IndicatorList';
import TokenBalances from './TokenBalances';
import { accountsSelector } from '../slices/accounts';
import { blockchainSelector } from '../slices/blockchain';

const IndicatorSidebar = () => {

    const { account, metamaskInstalled } = useSelector(accountsSelector);

    const { defaultBlockchainActive } = useSelector(blockchainSelector);

    return(
        <div className="p-3 bg-white w-100 d-flex flex-wrap">
            {!metamaskInstalled || account === undefined || !defaultBlockchainActive ? 
            null : <TokenBalances />}
            <div className="d-flex align-items-center pb-3 mb-3 w-100 text-decoration-none border-bottom">
                <svg className="bi me-2" width="30" height="24"></svg>
                <span className="fs-5 fw-semibold mx-auto">Indicators</span>
            </div>
            <IndicatorButton buttonText="Add new indicator"/>
            <IndicatorSettings buttonText="Add indicator" indicatorId={0} />
            <IndicatorList />
        </div>
    )
}

export default IndicatorSidebar;