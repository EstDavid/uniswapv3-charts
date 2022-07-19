import { createSlice } from '@reduxjs/toolkit';

// MAIN QUOTE TOKEN SYMBOLS
const symbolETH = 'WETH';
const symbolUSDC = 'USDC';
const symbolUSDT = 'USDT';
const symbolDAI = 'DAI';
const symbolOther = 'OTHER';
const symbolAll = 'ALL';

export const initialState = {
    pairsListsLoading: true,
    pairsListsError: false,
    quoteSymbols: [
        symbolETH,
        symbolUSDC,
        symbolUSDT,
        symbolDAI,
        symbolOther,
        symbolAll
    ],
    pairsLists: {
        [symbolETH]: [],
        [symbolUSDC]: [],
        [symbolUSDT]: [],
        [symbolDAI]: [],
        [symbolOther]: [],
        [symbolAll]: []
    },
    searchPairsLists: {
        [symbolETH]: [],
        [symbolUSDC]: [],
        [symbolUSDT]: [],
        [symbolDAI]: [],
        [symbolOther]: [],
        [symbolAll]: []
    },
    searchInputs: {
        [symbolETH]: '',
        [symbolUSDC]: '',
        [symbolUSDT]: '',
        [symbolDAI]: '',
        [symbolOther]:'',
        [symbolAll]: ''
    }
}

export const pairsListsSlice = createSlice({
    name: 'pairsLists',
    initialState,
    reducers: {
        getPairsLists: (state) => {
            state.pairsListsLoading = true;
        },
        getPairsListsFailure: (state) => {
            state.pairsListsLoading = false;
            state.pairsListsError = true;
        },
        pairsListsDownloadSuccess: (state, {payload}) => {
            state.pairsLists = payload;
            state.searchPairsLists = payload;
            state.pairsListsLoading = false;
            state.pairsListsError = false;
        },
        changeInputFilter: (state, {payload}) => {
            state.searchInputs[payload.quoteSymbol] = payload.input;
        },
        filterSearchList: (state, {payload}) => {
            state.searchPairsLists[payload.quoteSymbol] = payload.filteredList;
        }
    }
});

// export slice.actions
export const { 
    getPairsLists,
    getPairsListsFailure,
    pairsListsDownloadSuccess,
    changeInputFilter,
    filterSearchList
} = pairsListsSlice.actions;

// export selector
export const pairsListsSelector = (state) => state.pairsLists;

// export reducer
export default pairsListsSlice.reducer;

// export asynchronous thunk action
export function fetchPairsLists() {
    return async (dispatch) => {
        dispatch(getPairsLists());

        try {
            const response = await fetch(`http://localhost:5000/get-symbols/30 seconds`);

            const symbols = await response.json();

            const symbolsObject = {};

            for(let quoteSymbol of initialState.quoteSymbols) {
                symbolsObject[quoteSymbol] = [];
            };

            symbols.map((symbol) => {
                let symbolAdded = false;
                for(let quoteSymbol of initialState.quoteSymbols) {
                    if(
                        quoteSymbol !== symbolOther &&
                        quoteSymbol !== symbolAll) {
                        if(symbol.endsWith(quoteSymbol)) {
                            symbolsObject[quoteSymbol].push(symbol);
                            symbolAdded = true;
                        }
                    }
                }
                if( !symbolAdded) {
                    symbolsObject[symbolOther].push(symbol);
                }

                symbolsObject[symbolAll].push(symbol);
            });

            dispatch(pairsListsDownloadSuccess(symbolsObject));

        } catch(error) {
            console.log('error', error);
            dispatch(getPairsListsFailure())
        }
    }
}

export function filterInput(input, quoteSymbol, symbolList) {
    return async(dispatch) => {
        dispatch(changeInputFilter({quoteSymbol, input}));

        let filteredList = symbolList.filter((symbol) => {
            return symbol.toUpperCase().indexOf(input.toUpperCase()) !== -1
        });

        dispatch(filterSearchList({quoteSymbol, filteredList}));
    }
}