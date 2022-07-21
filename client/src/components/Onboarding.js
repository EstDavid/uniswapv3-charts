import React, { useEffect } from 'react';
import MetaMaskOnboarding from '@metamask/onboarding';
import { useDispatch, useSelector } from 'react-redux';
import { accountsSelector, checkProvider, loadAccount } from '../slices/accounts';

const ONBOARD_TEXT = 'Click here to install MetaMask';
const CONNECT_TEXT = 'Connect Metamask';

export function OnboardingButton() {

  const dispatch = useDispatch();

  const {account, metamaskInstalled} = useSelector(accountsSelector);

  const onboarding = new MetaMaskOnboarding();

  let buttonText;
  let isDisabled = false;

  if(!metamaskInstalled) {
    buttonText = ONBOARD_TEXT;
  } else if (account !== undefined) {
    buttonText = `${account.slice(0,6)}...${account.slice(account.length - 4)}`;
    isDisabled = true;
    onboarding.stopOnboarding();
  } else {
    buttonText = CONNECT_TEXT;
  }

  const handleNewAccount = () => {
    const newAccount = dispatch(loadAccount());
  }

  useEffect(() => {
    dispatch(checkProvider());
  }, []);

  const onClick = () => {
    if (metamaskInstalled) {
      handleNewAccount();
    } else {
      onboarding.startOnboarding();
    }
  };
  return (
    <button className="btn btn-warning alert-button" disabled={isDisabled} onClick={onClick}>
      {buttonText}
    </button>
  );
}