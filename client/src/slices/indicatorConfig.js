import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    indicators: [
        'EMA',
        'SMA',
        'ATR'
    ],
    currentIndicator: 'EMA',
    currentNPeriods: 20
}

export const indicatorConfigSlice = createSlice({
    name: 'indicatorConfig',
    initialState,
    reducers: {
        changeCurrentIndicator: (state, {payload}) => {
            state.currentIndicator = payload;
        },
        changeCurrentNPeriods: (state, {payload}) => {
            state.currentNPeriods = payload;
        }
    }
});


// export slice.actions
export const {
    changeCurrentIndicator,
    changeCurrentNPeriods
} = indicatorConfigSlice.actions;

// export selector
export const indicatorConfigSelector = (state) => state.indicatorConfig;

// export reducer
export default indicatorConfigSlice.reducer;

// export asynchronous thunk action
export function selectIndicator(indicator) {
    return async (dispatch) => {
        dispatch(changeCurrentIndicator(indicator));
    }
}

export function selectNPeriods(nPeriods) {
    return async (dispatch) => {
        dispatch(changeCurrentNPeriods(nPeriods));
    }
}