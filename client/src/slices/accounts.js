import { createSlice } from '@reduxjs/toolkit';
import {ethers} from 'ethers';
import ERC20Token from '../abis/Token.json';
import MetaMaskOnboarding from '@metamask/onboarding';

const ERC20TokenABI = ERC20Token.abi;

export const initialState = {
    balancesLoading: true,
    account: undefined,
    baseTokenBalance: undefined,
    quoteTokenBalance: undefined,
    metamaskInstalled: false
}

export const accountsSlice = createSlice({
    name: 'accounts',
    initialState,
    reducers: {
        accountLoaded: (state, {payload}) => {
            state.account = payload;
        },
        accountUnloaded: (state) => {
            state.account = undefined
        },
        balancesLoading:(state) => {
            state.balancesLoading = true;
        },
        balancesLoaded: (state, {payload}) => {
            state.baseTokenBalance = payload.baseTokenBalanceString;
            state.quoteTokenBalance = payload.quoteTokenBalanceString;
            state.balancesLoading = false;
        },
        metamaskChecked: (state) => {
            state.metamaskInstalled = true;
        }
    }
});

// export slice.actions
export const {
    accountLoaded,
    accountUnloaded,
    balancesLoading,
    balancesLoaded,
    metamaskChecked
} = accountsSlice.actions;

// export selector
export const accountsSelector = (state) => state.accounts;

// export reducer
export default accountsSlice.reducer;

// export asynchronous thunk action
export function checkProvider() {
    return async (dispatch) => {
        if(
            typeof window.ethereum !== 'undefined' && 
            MetaMaskOnboarding.isMetaMaskInstalled()
        ) { 
            dispatch(metamaskChecked());
        }
    }
}

export function loadAccount() {
    return async (dispatch) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        const accounts = await provider.send("eth_requestAccounts", []);
        const account = accounts[0];
        if(typeof account !== 'undefined' && account !== undefined){
            dispatch(accountLoaded(account));
        } else {
            dispatch(accountUnloaded());
        }
        return account;
    }
}

export function loadBalances(baseTokenAddress, quoteTokenAddress, account) {
    return async (dispatch) => {
        dispatch(balancesLoading());
        if(typeof window.ethereum !== 'undefined' && MetaMaskOnboarding.isMetaMaskInstalled()){
            dispatch(metamaskChecked());

            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            const amountWei = utils.formatUnits('1000', 6)
            console.log('amount wei', amountWei.toString())
            const baseTokenContract = new ethers.Contract(
                baseTokenAddress,
                // '0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5',
                ERC20TokenABI,
                provider
            );
            const quoteTokenContract = new ethers.Contract(
                quoteTokenAddress,
                // '0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5',
                ERC20TokenABI,
                provider
            );
            const baseTokenBalance = await baseTokenContract.balanceOf(account);
            const quoteTokenBalance = await quoteTokenContract.balanceOf(account);
            const baseTokenBalanceString = baseTokenBalance.toString();
            const quoteTokenBalanceString = quoteTokenBalance.toString();
            dispatch(balancesLoaded({baseTokenBalanceString, quoteTokenBalanceString}));
        }
    }
}