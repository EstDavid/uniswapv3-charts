import { createSlice } from '@reduxjs/toolkit';
import initializePriceObject from '../helpers/priceObservation';

function getArrayTimeframe(priceObject, timeframeTo) {
    let timestamps = [];
    let open = 0;
    let high = 0;
    let low = 0;
    let close = 0;
    let startTimeframe = 0;
    let newCandleTimestamp = 0;
    let priceArray = {};

    if(timeframeTo.seconds % priceObject.observationTimeframe.seconds !== 0) {
        throw(`Timeframe to ${timeframeTo.seconds} is not a multiple of timeframe from ${priceObject.observationTimeframe.seconds}`);
    }
    if(priceObject.observations !== undefined) {
        timestamps = Object.keys(priceObject.observations);
        timestamps.sort((a, b) => parseInt(a) - parseInt(b));
    }
    else {
        throw(`No price observation price array has been initialized for the ${priceObject.baseToken.symbol + priceObject.quoteToken.symbol} pair`);
    }

    // Initializing price array
    if(priceObject.prices === undefined) {
        priceObject.prices = {};
    }        

    for(let i = 0; i < timestamps.length; i +=1) {
        let timestamp = parseInt(timestamps[i]);
        let priceObservation = priceObject.observations[timestamp];
        close = priceObservation;
        if(i === 0) { // Opening a new cande at the beginning of the series
            startTimeframe = timestamp - (timestamp % timeframeTo.seconds);
            newCandleTimestamp = startTimeframe + timeframeTo.seconds;
            open = priceObservation;
            high = priceObservation;
            low = priceObservation;
            priceArray[startTimeframe] = {
                timestamp: startTimeframe,
                open,
                high,
                low,
                close
            }
        }
        else if(timestamp < newCandleTimestamp) {
            if(priceObservation > high) {
                high = priceObservation;
                priceArray[startTimeframe].high = high;
            }
            if(priceObservation < low) {
                low = priceObservation;
                priceArray[startTimeframe].low = low;
            }
            priceArray[startTimeframe].close = close;
        }
        else {  // Opening a new candle
            startTimeframe = timestamp - (timestamp % timeframeTo.seconds);
            newCandleTimestamp = startTimeframe + timeframeTo.seconds;
            open = priceObservation;
            high = priceObservation;
            low = priceObservation;
            close = priceObservation;
            priceArray[startTimeframe] = {
                timestamp: startTimeframe,
                open,
                high,
                low,
                close
            }
        }
    }

    return priceArray;
}


export const initialState = {
    loadingPriceObject: true,
    priceObject: {
        symbol: '',
        baseToken: {},
        quoteToken: {},
        poolAddress: '',
        poolFee: '',
        observationTimeframe: {},
        arrayTypes: ['open', 'high', 'low', 'close'],
        startTimestamp: undefined,
        endTimestamp: undefined,
        observations: {},
        prices: {}
    },
}

export const priceObjectSlice = createSlice({
    name: 'priceObject',
    initialState,
    reducers: {
        initPriceObject: (state, {payload}) => {
            state.priceObject.symbol = payload.symbol;
            state.priceObject.baseToken = payload.baseToken;
            state.priceObject.quoteToken = payload.quoteToken;
            state.priceObject.poolAddress = payload.poolAddress;
            state.priceObject.poolFee = payload.poolFee;
            state.priceObject.observationTimeframe = payload.observationTimeframe;
            state.priceObject.arrayTypes = payload.arrayTypes;
            state.priceObject.startTimestamp = payload.startTimestamp;
            state.priceObject.endTimestamp = payload.endTimestamp;
            state.priceObject.observations = payload.observations;
            state.loadingPriceObject = false;
        },
        getPriceArray: (state, {payload}) => {
            if(state.priceObject.prices[payload.name] === undefined) {
                const pricesArray = getArrayTimeframe(state.priceObject, payload);
                state.priceObject.prices = {
                    ...state.priceObject.prices,
                    [payload.name]: pricesArray
                };
            }
        }

    }
});


// export slice.actions
export const {
    initPriceObject,
    getPriceArray
} = priceObjectSlice.actions;

// export selector
export const priceObjectSelector = (state) => state.priceObject;

// export reducer
export default priceObjectSlice.reducer;

// export asynchronous thunk action
export function createPriceObject(rawPriceData) {
    return async (dispatch) => {
        const priceObservationObject = initializePriceObject(rawPriceData);
        dispatch(initPriceObject(rawPriceData));
    }
}