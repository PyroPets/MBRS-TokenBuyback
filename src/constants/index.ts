import Deployment from '../interfaces/Deployment';
import {contracts as MainNetv1} from '../network/MainNet/1.0.0';
import {contracts as TestNetv1} from '../network/TestNet/1.0.0';
import {contracts as MainNetv2} from '../network/MainNet/2.0.0';
import {contracts as TestNetv2} from '../network/TestNet/2.0.0';

export const CONTRACTS = {
  '1.0.0': {
    MainNet: MainNetv1 as Deployment,
    TestNet: TestNetv1 as Deployment,
  },
  '2.0.0': {
    MainNet: MainNetv2 as Deployment,
    TestNet: TestNetv2 as Deployment,
  },
  latest: {
    MainNet: MainNetv2 as Deployment,
    TestNet: TestNetv2 as Deployment,
  },
};
