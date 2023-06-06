import {NetworkType, Provider} from '@metrixcoin/metrilib';
import {Version} from '../types/Version';
import {CONTRACTS} from '../constants';
import {ZeroAddress} from 'ethers';
import TokenBuyback from '../buyback/TokenBuyback';
import AutoGovernor from '../buyback/AutoGovernor';

const getTokenBuyback = (
  network: NetworkType,
  provider: Provider,
  version: Version | undefined = 'latest'
) => {
  if (
    CONTRACTS[version][network].TokenBuyback === ZeroAddress.replace('0x', '')
  ) {
    throw new Error(`No deployment found for v${version} on the ${network}`);
  }
  return new TokenBuyback(CONTRACTS[version][network].TokenBuyback, provider);
};

const getTokenBuybackAddress = (
  network: NetworkType,
  version: Version | undefined = 'latest'
) => {
  if (
    CONTRACTS[version][network].TokenBuyback === ZeroAddress.replace('0x', '')
  ) {
    throw new Error(`No deployment found for v${version} on the ${network}`);
  }
  return CONTRACTS[version][network].TokenBuyback;
};

const getAutoGovernor = (
  network: NetworkType,
  provider: Provider,
  version: Version | undefined = 'latest'
) => {
  if (
    CONTRACTS[version][network].AutoGovernor === ZeroAddress.replace('0x', '')
  ) {
    throw new Error(`No deployment found for v${version} on the ${network}`);
  }
  return new AutoGovernor(CONTRACTS[version][network].AutoGovernor, provider);
};

const getAutoGovernorAddress = (
  network: NetworkType,
  version: Version | undefined = 'latest'
) => {
  if (
    CONTRACTS[version][network].AutoGovernor === ZeroAddress.replace('0x', '')
  ) {
    throw new Error(`No deployment found for v${version} on the ${network}`);
  }
  return CONTRACTS[version][network].AutoGovernor;
};

export {
  getTokenBuybackAddress,
  getTokenBuyback,
  getAutoGovernorAddress,
  getAutoGovernor,
};
