import {ZeroAddress} from 'ethers';
import {MetrixContract, Provider, Transaction} from '@metrixcoin/metrilib';
import ABI from '../abi';

export default class AutoGovernor extends MetrixContract {
  constructor(address: string, provider: Provider) {
    super(address, provider, ABI.AutoGovernor);
  }

  /**
   * Enroll into the DGP Governance
   * @returns {Promise<Transaction>} an array of TransactionReceipt objects
   */
  async enroll(): Promise<Transaction> {
    const tx = await this.send('enroll()', []);
    const getReceipts = this.provider.getTxReceipts(tx, this.abi, this.address);
    return {
      txid: tx.txid,
      getReceipts,
    };
  }

  /**
   * Excecute a transaction as this contract
   * @param to the EVM style address of the recipient
   * @param value the amount of MRX to send in the transaction
   * @param data optional data to include
   * @returns {Promise<Transaction>} an array of TransactionReceipt objects
   */
  async executeTransaction(
    to: string,
    value: bigint,
    data: string | undefined = ''
  ): Promise<Transaction> {
    const tx = await this.send('executeTransaction(address,uint256,bytes)', [
      to,
      `0x${value.toString(16)}`,
      `${data.startsWith('0x') ? '' : '0x'}${data}`,
    ]);
    const getReceipts = this.provider.getTxReceipts(tx, this.abi, this.address);
    return {
      txid: tx.txid,
      getReceipts,
    };
  }

  /**
   * Get the DGP Governance contract
   * @returns {Promise<string>} the EVM style address of the DGP Governance contract
   */
  async governance(): Promise<string> {
    const g = await this.call(`governance()`, []);
    return g ? g.toString() : ZeroAddress;
  }

  /**
   * Migrate to a different DGP Governance contract
   * @param governance the DGP Governance contract to migrate to
   * @returns {Promise<Transaction>} an array of TransactionReceipt objects
   */
  async migrate(governance: string): Promise<Transaction> {
    const tx = await this.send('migrate(address)', [governance]);
    const getReceipts = this.provider.getTxReceipts(tx, this.abi, this.address);
    return {
      txid: tx.txid,
      getReceipts,
    };
  }

  /**
   * Get the contract owner
   * @returns {Promise<string>} the EVM style address of the owner of this contract
   */
  async owner(): Promise<string> {
    const o = await this.call(`owner()`, []);
    return o ? o.toString() : ZeroAddress;
  }

  /**
   * Ping the DGP Governance contract
   * @returns {Promise<Transaction>} an array of TransactionReceipt objects
   */
  async ping(): Promise<Transaction> {
    const tx = await this.send('ping()', []);
    const getReceipts = this.provider.getTxReceipts(tx, this.abi, this.address);
    return {
      txid: tx.txid,
      getReceipts,
    };
  }

  /**
   * Renounce ownership of this contract
   * @returns {Promise<Transaction>} an array of TransactionReceipt objects
   */
  async renounceOwnership(): Promise<Transaction> {
    const tx = await this.send('renounceOwnership()', []);
    const getReceipts = this.provider.getTxReceipts(tx, this.abi, this.address);
    return {
      txid: tx.txid,
      getReceipts,
    };
  }

  /**
   * Transfer ownership of this contract
   * @param address the EVM adddress of the receiver
   * @returns {Promise<Transaction>} an array of TransactionReceipt objects
   */
  async transferOwnership(address: string): Promise<Transaction> {
    const tx = await this.send('transferOwnership(address)', [address]);
    const getReceipts = this.provider.getTxReceipts(tx, this.abi, this.address);
    return {
      txid: tx.txid,
      getReceipts,
    };
  }

  /**
   * Unenroll the AutoGovernor from the DGP Governance contract
   * @param force force unenroll
   * @returns {Promise<Transaction>} an array of TransactionReceipt objects
   */
  async unenroll(force: boolean): Promise<Transaction> {
    const tx = await this.send('unenroll(bool)', [force]);
    const getReceipts = this.provider.getTxReceipts(tx, this.abi, this.address);
    return {
      txid: tx.txid,
      getReceipts,
    };
  }
}
