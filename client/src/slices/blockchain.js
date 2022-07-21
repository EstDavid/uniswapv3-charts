import { createSlice } from '@reduxjs/toolkit';
import {ethers} from 'ethers';
import MetaMaskOnboarding from '@metamask/onboarding';

export const initialState = {
    blockchainIds: {
        ethereum: {
            hex: '0x1',
            decimal: '1'
        },
        ropsten: {
            hex: '0x3',
            decimal: '3'
        },
        rinkeby: {
            hex: '0x4',
            decimal: '4'
        },
        goerli: {
            hex: '0x5',
            decimal: '5'
        },
        kovan: {
            hex: '0x2a',
            decimal: '42'
        }
    },
    defaultBlockchain: {
        chainId: '0x1',
        chainName: 'Ethereum Mainnet',
        rpcUrls: ['https://mainnet.infura.io/v3/'],
        nativeTokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
    },
    currentBlockchainId: undefined,
    defaultBlockchainActive: false
}

export const blockchainSlice = createSlice({
    name: 'blockchain',
    initialState,
    reducers: {
        blockchainSelected: (state, {payload}) => {
            state.currentBlockchainId = payload;
        },
        defaultBlockchainSelected: (state) => {
            state.defaultBlockchainActive = state.currentBlockchainId === state.defaultBlockchain.chainId;
        }
    }
});

// export slice.actions
export const {
    blockchainSelected,
    defaultBlockchainSelected
} = blockchainSlice.actions;

// export selector
export const blockchainSelector = (state) => state.blockchain;

// export reducer
export default blockchainSlice.reducer;

// export asynchronous thunk action
export function checkBlockchain(provider) {
    return async (dispatch) => {
        const id = await provider.send("eth_chainId", [])
        dispatch(blockchainSelected(id));
        dispatch(defaultBlockchainSelected())
        return id;
    }
}

export function requestBlockchain(provider, chainParams) {
    return async (dispatch) => {
        const {chainId, chainName, rpcUrls} = chainParams;
        try {
            await provider.send(
              'wallet_switchEthereumChain',
              [{chainId}]
            );
          } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
              try {
                await provider.send(
                  'wallet_addEthereumChain',
                  [
                    {
                      chainId,
                      chainName,
                      rpcUrls
                    },
                  ],
                );
              } catch (addError) {
                console.log(error);
              }
            }
            else {
                console.log(switchError);
            }
          }
          
    }
}