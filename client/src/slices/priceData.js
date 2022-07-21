import { createSlice } from '@reduxjs/toolkit';
import {timeframes} from '../helpers/timeframes';
import {calculateArrayTimeframe, calculateSMAFromOHLC, calculateEMAFromOHLC} from '../helpers/priceDataCalculator';

const port = process.env.PORT;

export const initialState = {
    loading: true,
    hasErrors: false,
    indicatorsLimit: 5,
    viewTimeframe: timeframes['hours1'],
    priceDataRaw: {},
    maxCandlesNumber: 150,
    indicatorColors: [ 
        '#000000',
        '#0000FF',
        '#1E90FF',
        '#D2691E',
        '#008000',
        '#FFD700',
        '#FF0000',
        '#FF1493'
    ],
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
        arrayOHLC: {}
    },
    chartObject: {
        symbol: '',
        lastId: 1,
        series: [
            {
                id: 1,
                name: '',
                type: 'candlestick',
                typeMA: '',
                data: {},
                visible: true,
                color: '#FFD700'
            }
        ],
        xMin: 0,
        xMax: 0
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
        setArrayOHLC: (state ) => {
            const arrayOHLC = calculateArrayTimeframe( state.priceObject, state.viewTimeframe );

            state.priceObject.arrayOHLC = arrayOHLC;
            
            state.chartObject.series.map((series) => {
                if(series.id > 1) {
                    
                    const {nPeriods, arrayType} = series;
                    
                    const nPeriodsNumber = parseInt(nPeriods);

                    if (series.typeMA === 'SMA') {
                        series.data = calculateSMAFromOHLC(arrayOHLC, nPeriodsNumber, arrayType);
                    } else if (series.typeMA === 'EMA') {
                        series.data = calculateEMAFromOHLC(arrayOHLC, nPeriodsNumber, arrayType);
                    }
                }
            });
        },
        initChartObject: (state) => {
            state.chartObject.symbol = state.priceObject.symbol;
            state.chartObject.series[0].name = `${state.priceObject.symbol} ${state.viewTimeframe.name}`;
            state.chartObject.xMin = 
            (state.priceObject.endTimestamp - state.maxCandlesNumber * state.viewTimeframe.seconds) * 1000;
            state.chartObject.xMax = state.priceObject.endTimestamp * 1000;
        },
        switchTimeframe: (state, {payload}) => {
            state.viewTimeframe = payload;
        },
        createMovingAverage: (state, {payload}) => {
            state.chartObject.lastId += 1;
            const dataObject = {
                id: state.chartObject.lastId,
                name: `${payload.nPeriods} ${payload.typeMA}`,
                type: 'line',
                typeMA: payload.typeMA,
                nPeriods: parseInt(payload.nPeriods),
                arrayType: payload.arrayType,
                data: payload.data,
                visible: true,
                color: payload.color
            }
            state.chartObject.series.push(dataObject);
        },
        removeMovingAverage: (state, {payload}) => {
            state.chartObject.series = state.chartObject.series.filter((series) => series.id !== payload);
        },
        updateIndicatorSettings: (state, {payload}) => {
            const index = state.chartObject.series.findIndex(dataObject => {
                return dataObject.id === payload.id;
              }); 

            state.chartObject.series[index].name = `${payload.nPeriods} ${payload.typeMA}`;
            state.chartObject.series[index].type = payload.type;
            state.chartObject.series[index].typeMA = payload.typeMA;
            state.chartObject.series[index].nPeriods = parseInt(payload.nPeriods);
            state.chartObject.series[index].arrayType = payload.arrayType;
            state.chartObject.series[index].data = payload.data;

        },
        updateIndicatorData: (state, {payload}) => {
            const index = state.chartObject.series.findIndex(dataObject => {
                return dataObject.id === payload.id;
              });
            state.chartObject.series[index].data = payload.data;
        },
        updateVisibility: (state, {payload}) => {
            const index = state.chartObject.series.findIndex(dataObject => {
                return dataObject.id === payload;
              });

            state.chartObject.series[index].visible = 
                !state.chartObject.series[index].visible;
        },
        updateColor: (state, {payload}) => {
            const index = state.chartObject.series.findIndex(dataObject => {
                return dataObject.id === payload.id;
              });

            state.chartObject.series[index].color = payload.color
        },
        updateXMinXMax: (state, {payload}) => {
            const range = state.chartObject.xMax - state.chartObject.xMin;
            state.chartObject.xMin += range * 0.1 * payload;
            state.chartObject.xMax += range * 0.1 * payload;
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
    setArrayOHLC,
    switchTimeframe,
    createMovingAverage,
    removeMovingAverage,
    updateIndicatorSettings,
    updateIndicatorData,
    updateVisibility,
    updateColor,
    updateXMinXMax
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

            dispatch(setArrayOHLC());

        } catch(error) {
            dispatch(getPriceDataFailure())
        }
    }
}

export function changeTimeframe(timeframe) {
    return async (dispatch) => {
        dispatch(switchTimeframe(timeframe));
        dispatch(initChartObject());
        dispatch(setArrayOHLC());
    }
}

export function addMovingAverage(indicatorObject) {
    return async (dispatch) => {
        dispatch(createMovingAverage(indicatorObject));
    }
}

export function deleteMovingAverage(id) {
    return async (dispatch) => {
        dispatch(removeMovingAverage(id));
    }
}

export function updateExistingIndicator(indicatorObject) {
    return async (dispatch) => {
        dispatch(updateIndicatorSettings(indicatorObject));
    }
}

export function updateSeriesData(id, data) {
    return async (dispatch) => {
        dispatch(updateIndicatorData({id, data}));
    }
}

export function toggleVisibility(id) {
    return async (dispatch) => {
        dispatch(updateVisibility(id));
    }
}

export function changeColor(id, color) {
    return async (dispatch) => {
        dispatch(updateColor({id, color}));
    }
}

export function scrollGraph(multiplier) {
    return async (dispatch) => {
        dispatch(updateXMinXMax(multiplier));
    }
}