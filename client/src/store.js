import {configureStore} from '@reduxjs/toolkit';
import priceDataReducer from './slices/priceData';
import pairsListsReducer from './slices/pairsLists';
import indicatorConfigReducer from './slices/indicatorConfig';
import accountsReducer from './slices/accounts';
import blockchainReducer from './slices/blockchain';

export const store = configureStore({
    reducer: {
        priceData: priceDataReducer,
        pairsLists: pairsListsReducer,
        indicatorConfig: indicatorConfigReducer,
        accounts: accountsReducer,
        blockchain: blockchainReducer
    }
});