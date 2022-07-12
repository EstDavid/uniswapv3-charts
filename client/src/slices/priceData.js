import { createSlice } from '@reduxjs/toolkit';
import {calculateArrayTimeframe, calculateCandlestickData} from '../helpers/priceDataCalculator';
import {timeframes} from '../helpers/timeframes';
import {defaultChartOptions} from '../helpers/chartOptions';

export const initialState = {
    loading: true,
    hasErrors: false,
    viewTimeframe: timeframes['minutes30'],
    priceDataRaw: {},
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
        priceArraysOHLC: {}
    },
    chartObject: {
        symbol: '',
        lastId: 1,
        series: [
            {
                id: 1,
                name: '',
                type: 'candlestick',
                data: []
            }
        ]
    }
}

export const priceDataSlice = createSlice({
    name: 'priceData',
    initialState,
    reducers: {
        getPriceData: (state) => {
            state.loading = true;
        },
        getPriceDataSuccess: (state, {payload}) => {
            state.priceDataRaw = payload;
            state.loading = false;
            state.hasErrors = false;
        },
        getPriceDataFailure: (state) => {
            state.loading = false;
            state.hasErrors = true;
        },
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
        initChartObject: (state) => {
            state.chartObject.symbol = state.priceObject.symbol;
            state.chartObject.series[0].name = `${state.priceObject.symbol} ${state.viewTimeframe.name}`
        },
        switchTimeframe: (state, {payload}) => {
            state.viewTimeframe = payload;
        },
        createMovingAverage: (state, {payload}) => {
            state.chartObject.lastId += 1;
            const movingAverageObject = {
                id: state.chartObject.lastId,
                name: `${payload.nPeriods} ${payload.typeMA}`,
                type: 'line',
                typeMA: payload.typeMA,
                nPeriods: payload.nPeriods,
                arrayType: payload.arrayType
            }
            state.chartObject.series.push(movingAverageObject);
        },
        removeMovingAverage: (state, {payload}) => {
            state.chartObject.series = state.chartObject.series.filter((series) => series.id !== payload);
        }
    }
});


// export slice.actions
export const {
    getPriceData,
    getPriceDataSuccess,
    getPriceDataFailure,
    initPriceObject,
    initChartObject,
    switchTimeframe,
    createMovingAverage,
    removeMovingAverage
} = priceDataSlice.actions;

// export selector
export const priceDataSelector = (state) => state.priceData;

// export reducer
export default priceDataSlice.reducer;

// export asynchronous thunk action
export function fetchPriceData(symbol) {
    return async (dispatch) => {
        dispatch(getPriceData());

        try {
            const response = await fetch(`/get-url/30 seconds/${symbol}`);

            const data = await response.json();

            dispatch(getPriceDataSuccess(data));

            dispatch(initPriceObject(data));

            dispatch(initChartObject());

        } catch(error) {
            dispatch(getPriceDataFailure())
        }
    }
}

export function changeTimeframe(timeframe) {
    return async (dispatch) => {
        dispatch(switchTimeframe(timeframe));
        dispatch(initChartObject());

    }
}

export function addMovingAverage(typeMA, nPeriods, arrayType) {
    return async (dispatch) => {
        dispatch(createMovingAverage({typeMA, nPeriods, arrayType}));
    }
}

export function deleteMovingAverage(id) {
    return async (dispatch) => {
        dispatch(removeMovingAverage(id));
    }
}