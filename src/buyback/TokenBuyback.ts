import {ZeroAddress} from 'ethers';
import {MetrixContract, Provider, Transaction} from '@metrixcoin/metrilib';
import ABI from '../abi';

export default class TokenBuyback extends MetrixContract {
  constructor(address: string, provider: Provider) {
    super(address, provider, ABI.TokenBuyback);
  }

  /**
   * Check if the exchange is active
   * @returns {Promise<boolean>} if the AutoGovernor is enrolled and there is a balance above 1 MRX
   */
  async active(): Promise<boolean> {
    const a = await this.call(`active()`, []);
    return a ? a.toString() === 'true' : false;
  }

  /**
   * Get the AutoGovernor address
   * @returns {Promise<string>} the EVM style address of the AutoGovernor
   */
  async autoGovernor(): Promise<string> {
    const g = await this.call(`autoGovernor()`, []);
    return g ? g.toString() : ZeroAddress;
  }

  /**
   * Get the PyroCore address
   * @returns {Promise<string>} the EVM style address of the PyroCore contract
   */
  async core(): Promise<string> {
    const c = await this.call(`core()`, []);
    return c ? c.toString() : ZeroAddress;
  }

  /**
   * Deposit MRX into this contract
   * @returns {Promise<Transaction>} an array of TransactionReceipt objects
   */
  async deposit(): Promise<Transaction> {
    const tx = await this.send('deposit()', []);
    const getReceipts = this.provider.getTxReceipts(tx, this.abi, this.address);
    return {
      txid: tx.txid,
      getReceipts,
    };
  }

  /**
   * Enroll the AutoGovernor into the DGP Governance
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
   * Exchange MBRS for MRX
   * @param amount the amount of MBRS to exchange
   * @returns {Promise<Transaction>} an array of TransactionReceipt objects
   */
  async exchangeTokenForMetrix(amount: bigint): Promise<Transaction> {
    const tx = await this.send('exchangeTokenForMetrix(uint256)', [
      `0x${amount.toString(16)}`,
    ]);
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
   * Check if hodlers option is enabled
   * @returns {Promise<boolean>} if exchangers must hold PYRO
   */
  async hodlers(): Promise<boolean> {
    const h = await this.call(`hodlers()`, []);
    return h ? h.toString() === 'true' : false;
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
   * Whenever an IERC721 `tokenId` token is transferred to this contract via IERC721-safeTransferFrom
   * by `operator` from `from`, this function is called.
   *
   * It must return its Solidity selector to confirm the token transfer.
   * If any other value is returned or the interface is not implemented by the recipient, the transfer will be reverted.
   *
   * The selector can be obtained in Solidity with `IERC721Receiver.onERC721Received.selector`.
   * @param operator the EVM style address of the operator
   * @param from the EVM style address of the sender
   * @param tokenId the uint256 tokenId
   * @param data option data bytes
   * @returns {Promise<string>} the selector for IERC721Receiver.onERC721Received
   */
  async onERC721Received(
    operator: string,
    from: string,
    tokenId: bigint,
    data: string
  ): Promise<string> {
    const sig = await this.call(
      'onERC721Received(address,address,uint256,bytes)',
      [
        operator,
        from,
        `0x${tokenId.toString(16)}`,
        `${data.startsWith('0x') ? '' : '0x'}${data}`,
      ]
    );
    return sig ? sig.toString() : '00000000';
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
   * Triggers stopped state.
   * @returns {Promise<Transaction>} an array of TransactionReceipt objects
   */
  async pause(): Promise<Transaction> {
    const tx = await this.send('pause()', []);
    const getReceipts = this.provider.getTxReceipts(tx, this.abi, this.address);
    return {
      txid: tx.txid,
      getReceipts,
    };
  }

  /**
   * Check if the contract is paused
   * @returns {Promise<boolean>} true if the contract is paused, and false otherwise.
   */
  async paused(): Promise<boolean> {
    const a = await this.call(`paused()`, []);
    return a ? a.toString() === 'true' : false;
  }

  /**
   * Ping the DGP Governance contract as the AutoGovernor
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
   * Get the current exchange rate
   * @returns {Promise<bigint>} The amount of MBRS per MRX
   */
  async rate(): Promise<bigint> {
    const r = await this.call(`rate()`, []);
    return r ? BigInt(r.toString()) : BigInt(0);
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
   * Set whether exchangers need to hodl PYRO tokens
   * @returns {Promise<Transaction>} an array of TransactionReceipt objects
   */
  async setHodlers(hodlersOnly: boolean): Promise<Transaction> {
    const tx = await this.send('setHodlers()', [hodlersOnly]);
    const getReceipts = this.provider.getTxReceipts(tx, this.abi, this.address);
    return {
      txid: tx.txid,
      getReceipts,
    };
  }

  /**
   * Get the MBRS contract address
   * @returns {Promise<string>} the EVM style address of the MBRS token contract
   */
  async token(): Promise<string> {
    const g = await this.call(`token()`, []);
    return g ? g.toString() : ZeroAddress;
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

  /**
   * Triggers started state.
   * @returns {Promise<Transaction>} an array of TransactionReceipt objects
   */
  async unpause(): Promise<Transaction> {
    const tx = await this.send('unpause()', []);
    const getReceipts = this.provider.getTxReceipts(tx, this.abi, this.address);
    return {
      txid: tx.txid,
      getReceipts,
    };
  }
}
