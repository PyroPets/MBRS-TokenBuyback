import {NetworkType, Provider} from '@metrixcoin/metrilib';
import { axiosWrapper } from '@/helpers/AxiosWrapper';
import {Version} from '../types/Version';
import {CONTRACTS} from '../constants';
import {Result, ZeroAddress} from 'ethers';
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

/**
 * Read only call to contract using local RPC
 *
 * @param contract
 * @param method
 * @param data
 * @param abi
 * @returns
 */
 const callContractRPC: (
  contract: string,
  method: string,
  data: any[],
  abi: any[]
) => Promise<Result | undefined> = async (
  contract: string,
  method: string,
  data: any[],
  abi: any[]
) => {
  //console.log(`method ${method}`);
  //console.log(`data ${data}`);
  //console.log(`encoded ${encoded}`);
  try {
    const command = '*';
    let s = `http://localhost:${process.env.NEXT_PUBLIC_HOST_PORT}/api/contract/call`;
    if (typeof window !== 'undefined') {
      s = '/api/contract/call';
    }
    if (process.env.NODE_ENV !== 'production') {
      console.log(`callContractRPC: ${s}`);
      console.log(contract, method, data);
    }

    const result = await axiosWrapper.post(s, {
      command,
      contract,
      method,
      content: data,
      abi
    });
    if (result && !result.error) {
      return result;
    } else if (result && result.error) {
      return result.error;
    }
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('error!!! callContractRPC()');
      console.log(e);
    }
  }
  return undefined;
};

export {
  getTokenBuybackAddress,
  getTokenBuyback,
  getAutoGovernorAddress,
  getAutoGovernor,
  callContractRPC
};
