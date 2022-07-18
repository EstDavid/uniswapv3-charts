import { createSlice } from '@reduxjs/toolkit';
import { calculateSMAFromOHLC, calculateEMAFromOHLC} from '../helpers/priceDataCalculator';

export const initialState = {
    indicators: [
        'EMA',
        'SMA'
    ],
    showIndicatorDialog: false,
    configuringIndicator: false,
    currentIndicator: {
        id: 0,
        name: '',
        type: 'line',
        typeMA: 'EMA',
        nPeriods: '20',
        arrayType: 'close',
        data: {}      
    }
}

export const indicatorConfigSlice = createSlice({
    name: 'indicatorConfig',
    initialState,
    reducers: {
        changeCurrentIndicatorType: (state, {payload}) => {
            state.currentIndicator.typeMA = payload;
        },
        changeCurrentNPeriods: (state, {payload}) => {
            state.currentIndicator.nPeriods = payload;
        },
        changeCurrentData: (state, {payload}) => {
            const {nPeriods, typeMA, arrayType} = state.currentIndicator;

            const nPeriodsNumber = parseInt(nPeriods);

            if(isNaN(nPeriodsNumber)) {
                state.currentIndicator.data = {};
            } else {
                if (typeMA === 'SMA') {
                    state.currentIndicator.data = calculateSMAFromOHLC(payload, nPeriodsNumber, arrayType);
                } else if (typeMA === 'EMA') {
                    state.currentIndicator.data = calculateEMAFromOHLC(payload, nPeriodsNumber, arrayType);
                }                
            }


        },
        createNewIndicator: (state, {payload}) => {
            state.configuringIndicator = true;
            state.currentIndicator.name =
                `${initialState.currentIndicator.nPeriods} ${initialState.currentIndicator.typeMA}`;
            state.currentIndicator.type = 'line';                           
        },
        resetConfiguration: (state) => {
            state.configuringIndicator = false;
            state.currentIndicator = initialState.currentIndicator;
        },
        toggleIndicatorDialog: (state) => {
            state.showIndicatorDialog = !state.showIndicatorDialog;
        },
        changeExistingIndicator: (state, {payload}) => {
            state.configuringIndicator = true;
            state.currentIndicator.id = payload.id;
            state.currentIndicator.name =
                `${payload.nPeriods} ${payload.typeMA}`;
            state.currentIndicator.typeMA = payload.typeMA;
            state.currentIndicator.nPeriods = payload.nPeriods;
            state.currentIndicator.type = payload.type;
        },
    }
});


// export slice.actions
export const {
    changeCurrentIndicatorType,
    changeCurrentNPeriods,
    changeCurrentData,
    createNewIndicator,
    resetConfiguration,
    toggleIndicatorDialog,
    changeExistingIndicator
} = indicatorConfigSlice.actions;

// export selector
export const indicatorConfigSelector = (state) => state.indicatorConfig;

// export reducer
export default indicatorConfigSlice.reducer;

// export asynchronous thunk action
export function selectIndicatorType(indicatorType, arrayOHLC) {
    return async (dispatch) => {
        dispatch(changeCurrentIndicatorType(indicatorType));
        dispatch(changeCurrentData(arrayOHLC))
    }
}

export function selectNPeriods(nPeriods, arrayOHLC) {
    return async (dispatch) => {
        dispatch(changeCurrentNPeriods(nPeriods));
        dispatch(changeCurrentData(arrayOHLC));
    }
}

export function updateCurrentData(data) {
    return async (dispatch) => {
        dispatch(changeCurrentData(data));
    }
}

export function configureNewIndicator(arrayOHLC) {
    return async (dispatch) => {
                dispatch(createNewIndicator());
                dispatch(changeCurrentData(arrayOHLC));
    }
}

export function cancelConfiguration() {
    return async (dispatch) => {
        dispatch(resetConfiguration());
    }
}

export function toggleDialog() {
    return async (dispatch) => {
        dispatch(toggleIndicatorDialog());
    }
}

export function configureExistingIndicator(indicatorObject, arrayOHLC) {
    return async (dispatch) => {
        dispatch(changeExistingIndicator(indicatorObject));
        dispatch(changeCurrentData(arrayOHLC));
    }
}