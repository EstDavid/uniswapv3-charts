import {configureStore} from '@reduxjs/toolkit';
import priceDataReducer from './slices/priceData';
import pairsListsReducer from './slices/pairsLists';
import indicatorConfigReducer from './slices/indicatorConfig';

export const store = configureStore({
    reducer: {
        priceData: priceDataReducer,
        pairsLists: pairsListsReducer,
        indicatorConfig: indicatorConfigReducer
    }
});