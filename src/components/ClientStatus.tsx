import {MRC20, MRC721, NetworkType, Web3Provider} from '@metrixcoin/metrilib';
import {toHexAddress} from '@metrixcoin/metrilib/lib/utils/AddressUtils';
import React from 'react';
import {
  Card,
  Grid,
  Header,
  Icon,
  Segment,
  Image,
  Label,
  Button,
  Form,
  Message,
} from 'semantic-ui-react';
import ContractFunctions from './ContractFunctions';
import {
  getAutoGovernorAddress,
  getTokenBuyback,
  getTokenBuybackAddress,
} from '../buyback';
import ABI from '@/abi';
import ContractStatus from './ContractStatus';
import ApproveEmbersModal from '../modals/ApproveEmbersModal';
import {ZeroHash} from 'ethers';
import Web3TransactionModal from '@/modals/Web3TransactionModal';
import {parseFromIntString} from '@metrixcoin/metrilib/lib/utils/NumberUtils';
import HandleProviderType from '@/helpers/HandleProviderType';

interface ClientStatusProps {
  network: NetworkType | undefined;
  setNetwork(network: NetworkType | undefined): void;
  connected: boolean;
  setConnected(connected: boolean): void;
  hodler: boolean;
  setHodler(hodler: boolean): void;
  setDebug(debug: JSX.Element[]): void;
  setError(error: boolean): void;
  setMessage(message: string | JSX.Element): void;
  address: string | undefined;
  setAddress(address: string | undefined): void;
  mbrs: string | undefined;
  pyro: string | undefined;
  active: boolean;
  setActive(active: boolean): void;
  paused: boolean;
  setPaused(paused: boolean): void;
  onlyHodlers: boolean;
  setOnlyHodlers(onlyHodlers: boolean): void;
  modalMessage: undefined | string | JSX.Element;
  setModalMessage(modalMessage: undefined | string | JSX.Element): void;
}

export default function ClientStatus(props: ClientStatusProps) {
  const [busy, setBusy] = React.useState(false);
  const [amount, setAmount] = React.useState(BigInt(0));
  const [balance, setBalance] = React.useState('0');
  const [allowance, setAllowance] = React.useState('0');
  const [errMsg, setErrMsg] = React.useState('');

  const [rate, setRate] = React.useState(`0`);

  const [totalSupply, setTotalSupply] = React.useState(`0`);

  const [vault, setVault] = React.useState(`0.00000000`);
  const [locked, setLocked] = React.useState(`0`);
  const [status, setStatus] = React.useState(
    (
      <Message compact color='yellow'>
        <Icon name='sync alternate' loading />
        Syncing Onchain Data
      </Message>
    ) as JSX.Element
  );

  const getClientStatus = async (address: string, network: NetworkType) => {
    const provider = HandleProviderType(network);
    if (props.pyro) {
      const pyro = new MRC721(props.pyro, provider);
      const hodler = (await pyro.balanceOf(toHexAddress(address))) > BigInt(0);
      props.setHodler(hodler);
    }
    if (props.mbrs) {
      const token = new MRC20(props.mbrs, provider);
      setBalance((await token.balanceOf(toHexAddress(address))).toString());
      setAllowance(
        (
          await token.allowance(
            toHexAddress(address),
            getTokenBuybackAddress(network)
          )
        ).toString()
      );
    }
  };

  const updateContractStatus = async () => {
    if (props.network) {
      try {
        const provider = HandleProviderType(props.network);
        const buyback = getTokenBuyback(props.network, provider);
        const isActive = await buyback.active();
        props.setActive(isActive);
        const isPaused = await buyback.paused();
        props.setPaused(isPaused);
        const vaultBal = parseFromIntString(
          (await buyback.balance()).toString(),
          8
        );
        const isOnlyHodlers = await buyback.hodlers();
        props.setOnlyHodlers(isOnlyHodlers);
        const token = new MRC20(await buyback.token(), provider);
        const supply = (await token.totalSupply()).toString();
        const lockedMBRS = (await token.balanceOf(buyback.address)).toString();
        const r = (await buyback.rate()).toString();
        setVault(vaultBal);
        setTotalSupply(supply);
        setLocked(lockedMBRS);

        setRate(r);
        if (props.paused && isPaused) {
          if (props.active && isActive) {
            setStatus(
              <Message compact color='yellow'>
                Paused
              </Message>
            );
          } else {
            setStatus(
              <Message compact color='yellow'>
                Paused and Not Active
              </Message>
            );
          }
        } else {
          if (props.active && isActive) {
            setStatus(
              <Message compact color='green'>
                Active
              </Message>
            );
          } else {
            setStatus(
              <Message compact color='red'>
                Inactive
              </Message>
            );
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const getContractStatus = async () => {
    setBusy(true);
    await updateContractStatus();
    setBusy(false);
  };

  function handleChange(event: any) {
    const amt = BigInt(!!event.target.value ? event.target.value : '0');
    setAmount(amt > BigInt(balance) ? BigInt(balance) : amt);

    setErrMsg('');
  }

  const withTimeout = (millis: number, promise: Promise<any>) => {
    const timeout = new Promise((resolve, reject) =>
      setTimeout(() => reject(`Timed out after ${millis} ms.`), millis)
    );
    return Promise.race([promise, timeout]);
  };

  const exchange = async () => {
    if (amount > BigInt(allowance)) {
      props.setModalMessage(
        `Error: MBRS Amount exceeds allowance, check approvals`
      );
      return;
    }
    if (amount < BigInt(rate)) {
      props.setModalMessage(
        `Error: MBRS Amount must be greater than or equal to ${rate}`
      );
      return;
    }
    if (amount <= BigInt(0)) {
      props.setModalMessage(`Error: MBRS Amount must be greater than 0`);
      return;
    }
    const provider = new Web3Provider(
      props.network ? props.network : 'MainNet'
    );
    const buyback = getTokenBuyback(
      props.network ? props.network : 'MainNet',
      provider
    );

    const tx = await buyback.exchangeTokenForMetrix(amount);
    if (tx.txid && tx.txid != ZeroHash.replace('0x', '')) {
      setAmount(BigInt(0));
      props.setModalMessage(
        <a
          style={{color: '#9627ba !important'}}
          href={`https://${
            (props.network ? props.network : 'MainNet') === 'TestNet'
              ? 'testnet-'
              : ''
          }explorer.metrixcoin.com/tx/${tx.txid}`}
          target='_blank'
        >
          {tx.txid}
        </a>
      );
    }
  };

  const handleMessage = async (
    message: any,
    handleAccountChanged: (payload?: any) => void
  ) => {
    if (message.data && message.data.target) {
      if (message.data.target.startsWith('metrimask') && message.data.message) {
        switch (message.data.message.type) {
          case 'GET_INPAGE_METRIMASK_ACCOUNT_VALUES':
            console.log('Updating MetriMask context');
            break;
          case 'METRIMASK_ACCOUNT_CHANGED':
            handleAccountChanged(message.data.message.payload);
            break;
          case 'METRIMASK_INSTALLED_OR_UPDATED':
            if (window) {
              window.location.reload();
            }
            break;
          case 'METRIMASK_WINDOW_CLOSE':
            console.log('Canceled!!!');
            handleAccountChanged();
            break;
          case 'SIGN_TX_URL_RESOLVED':
            break;
          case 'RPC_REQUEST':
            break;
          case 'RPC_RESPONSE':
            break;
          case 'RPC_SEND_TO_CONTRACT':
            break;
          default:
            break;
        }
      }
    }
  };

  function doHandleMessage(message: any): void {
    handleMessage(message, (payload) => {
      handleAccountChanged(payload);
    });
  }

  function handleAccountChanged(data: any): void {
    if (typeof data === 'undefined') {
      props.setNetwork(undefined);
      props.setAddress(undefined);
      props.setConnected(false);
      return;
    }
    const account = data.account;
    if (account && account.loggedIn) {
      props.setAddress(toHexAddress(account.address));
      props.setNetwork(account.network ? account.network : 'TestNet');
      props.setConnected(true);
      props.setError(false);
      props.setMessage('');
      props.setDebug([
        <Segment inverted key={'SegmentTokenBuyback'}>
          <ContractFunctions
            network={account.network ? account.network : 'TestNet'}
            contract={'TokenBuyback'}
            address={getTokenBuybackAddress(
              props.network ? props.network : 'TestNet'
            )}
            abi={ABI.TokenBuyback}
            key={0}
          />
        </Segment>,
        <Segment inverted key={'SegmentAutoGovernor'}>
          <ContractFunctions
            network={account.network ? account.network : 'TestNet'}
            contract={'AutoGovernor'}
            address={getAutoGovernorAddress(
              props.network ? props.network : 'TestNet'
            )}
            abi={ABI.AutoGovernor}
            key={1}
          />
        </Segment>,
      ]);
      getClientStatus(account.address, account.network);
    } else {
      props.setNetwork(undefined);
      props.setAddress(undefined);
      props.setConnected(false);
    }
  }

  React.useEffect(() => {
    getContractStatus();
    let interval: NodeJS.Timer | undefined = undefined;
    setTimeout(() => {
      interval = setInterval(() => {
        updateContractStatus();
      }, 60 * 1000);
    }, 60 * 1000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [props.network]);

  React.useEffect(() => {
    if (window) {
      if (
        (window as any).metrimask &&
        (window as any).metrimask.account &&
        (window as any).metrimask.account.loggedIn === true
      ) {
        props.setAddress(
          toHexAddress((window as any).metrimask.account.address)
        );
        props.setNetwork(
          (window as any).metrimask.account.network as NetworkType
        );
      }

      window.addEventListener('message', doHandleMessage, false);
      window.postMessage({message: {type: 'CONNECT_METRIMASK'}}, '*');
    }
  }, [props.mbrs]);
  return (
    <Card
      fluid
      style={{padding: '5%', paddingRight: '10%', paddingLeft: '10%'}}
      color={
        props.connected
          ? props.paused
            ? 'yellow'
            : props.active
            ? props.onlyHodlers && props.hodler
              ? 'green'
              : 'red'
            : 'green'
          : 'red'
      }
    >
      <Card.Header as='h3' textAlign='center' style={{padding: '7px'}}>
        <Header icon>
          <Image
            style={{width: '96px', height: '96px'}}
            src='/images/logo.png'
            alt='logo'
          />
          <Header.Content style={{color: 'whitesmoke'}}>
            MBRS Exchange
          </Header.Content>
        </Header>
      </Card.Header>

      <Card.Description>
        <Grid stretched padded='horizontally'>
          <Grid.Row stretched>
            <Grid.Column stretched>
              <ContractStatus
                status={status}
                busy={busy}
                totalSupply={totalSupply}
                rate={rate}
                vault={vault}
                network={props.network ? props.network : 'TestNet'}
                active={props.active}
                paused={props.paused}
                locked={locked}
                onlyHodlers={props.onlyHodlers}
              />
            </Grid.Column>
          </Grid.Row>
          {busy ? (
            ''
          ) : props.connected ? (
            <Grid.Row columns='equal' stretched>
              <Grid stretched padded='horizontally' stackable>
                <Grid.Row stretched columns='equal'>
                  <Grid.Column stretched>
                    <div
                      style={{
                        margin: 'auto',
                        padding: '5px 0px',
                        maxHeight: '56px',
                      }}
                    >
                      <Label
                        color='grey'
                        pointing='right'
                        style={{
                          padding: '0.5833em 0.667em',
                          height: '46px',
                          fontSize: '22px',
                          fontWeight: '500',
                          marginRight: '-1px',
                        }}
                      >
                        {' '}
                        <Image
                          avatar
                          size='tiny'
                          src='/images/logo.png'
                          style={{
                            width: '16px',
                            height: '16px',
                            marginTop: '-5px',
                            marginRight: '8px',
                          }}
                        />
                        MBRS
                      </Label>
                      <Label
                        color='black'
                        style={{
                          height: '46px',
                          fontSize: '22px',
                          width: 'fit-content',
                          minWidth: '64px',
                          display: 'absolute',
                          fontWeight: '500',
                        }}
                      >
                        {!busy ? (
                          balance
                        ) : (
                          <Icon
                            name='cog'
                            loading
                            style={{margin: 'auto', fontSize: '17px'}}
                          />
                        )}
                      </Label>
                    </div>
                  </Grid.Column>
                  <Grid.Column stretched>
                    <ApproveEmbersModal
                      network={props.network ? props.network : 'TestNet'}
                      address={getTokenBuybackAddress(
                        props.network ? props.network : 'TestNet'
                      )}
                      button={
                        <Button
                          basic
                          loading={
                            busy &&
                            getTokenBuybackAddress(
                              props.network ? props.network : 'TestNet'
                            ).length <= 0
                          }
                          disabled={
                            getTokenBuybackAddress(
                              props.network ? props.network : 'TestNet'
                            ).length <= 0
                          }
                          color='purple'
                          style={{
                            margin: '0px',
                            padding: '7px 20px',
                            fontSize: '20px',
                            fontWeight: 'normal',
                          }}
                        >
                          <Grid textAlign='center' stretched>
                            <Grid.Row stretched>
                              <Grid.Column stretched>
                                Approval
                                <br />(
                                {BigInt(allowance) > BigInt(100)
                                  ? '>100'
                                  : `${BigInt(allowance).toString()}`}
                                )
                              </Grid.Column>
                            </Grid.Row>
                          </Grid>
                        </Button>
                      }
                      mbrs={props.mbrs}
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row stretched>
                  <Grid.Column stretched textAlign='center'>
                    <Segment inverted>
                      <Form onSubmit={exchange}>
                        <Form.Field>
                          <label style={{color: 'whitesmoke'}}>
                            MBRS Amount
                          </label>
                          <Form.Input
                            error={
                              !!!errMsg
                                ? false
                                : {
                                    content: errMsg,
                                    pointing: 'above',
                                  }
                            }
                            type='number'
                            step='1'
                            min='0'
                            max={balance}
                            onChange={handleChange}
                            value={amount.toString()}
                            disabled={
                              !props.active ||
                              props.paused ||
                              (props.onlyHodlers && !props.hodler)
                            }
                          />
                        </Form.Field>

                        <Web3TransactionModal
                          message={props.modalMessage}
                          setMessage={props.setModalMessage}
                          trigger={
                            <Button
                              type='submit'
                              color={
                                !props.active ||
                                props.paused ||
                                (props.onlyHodlers && !props.hodler)
                                  ? 'red'
                                  : 'purple'
                              }
                              disabled={
                                !props.active ||
                                props.paused ||
                                (props.onlyHodlers && !props.hodler)
                              }
                              content={
                                !props.active
                                  ? 'Inactive'
                                  : props.paused
                                  ? 'Paused'
                                  : props.onlyHodlers && !props.hodler
                                  ? 'HODL PYRO 1ST'
                                  : 'Exchange'
                              }
                            />
                          }
                        />
                      </Form>
                    </Segment>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Row>
          ) : (
            <Grid.Row>
              <Grid container padded textAlign='center'>
                <Grid.Row stretched>
                  <Header
                    style={{
                      color: 'whitesmoke',
                    }}
                  >
                    Install and connect a Metrix compatible Web3 wallet to get
                    started.
                  </Header>
                </Grid.Row>
                <Grid.Row stretched>
                  <Grid.Column stretched textAlign='center'>
                    <Header as='h4'>
                      <a
                        className='lavenderLink'
                        href='https://chrome.google.com/webstore/detail/metrimask/pgjlaaokfffcapdcakncnhpmigjlnpei'
                        target='_blank'
                      >
                        <Icon name='chrome' />
                        MetriMask for Chrome
                      </a>
                    </Header>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row stretched>
                  <Grid.Column stretched textAlign='center'>
                    <Header as='h4'>
                      <a
                        className='lavenderLink'
                        href='https://play.google.com/store/apps/details?id=com.metrimask_mobile'
                        target='_blank'
                      >
                        <Icon name='android' />
                        MetriMask for Android
                      </a>
                    </Header>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Row>
          )}
        </Grid>
      </Card.Description>
    </Card>
  );
}
