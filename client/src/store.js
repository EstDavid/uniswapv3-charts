import {configureStore} from '@reduxjs/toolkit';
import priceDataReducer from './slices/priceData';
import priceObjectReducer from './slices/priceObject';

export const store = configureStore({
    reducer: {
        priceData: priceDataReducer,
        priceObject: priceObjectReducer
    }
});