import Head from 'next/head';
import {
  Button,
  Container,
  Grid,
  Icon,
  Message,
  Image,
  Header,
} from 'semantic-ui-react';
import React from 'react';
import styles from '@/styles/Home.module.css';
import Footer from '@/components/Footer';
import {APIProvider, NetworkType} from '@metrixcoin/metrilib';
import AboutMBRSX from '@/components/AboutMBRSX';
import ClientStatus from '@/components/ClientStatus';
import DebugContracts from '@/components/DebugContracts';
import {getTokenBuyback} from '@/buyback';
import Web3TransactionModal from '@/modals/Web3TransactionModal';
import {ZeroHash} from 'ethers';
import HandleProviderType from '@/helpers/HandleProviderType';

export default function Home() {
  const [debugging, setDebugging] = React.useState(false);
  const [connected, setConnected] = React.useState(false);
  const [network, setNetwork] = React.useState(
    'MainNet' as NetworkType | undefined
  );
  const [address, setAddress] = React.useState(undefined as string | undefined);
  const [error, setError] = React.useState(false);
  const [message, setMessage] = React.useState('' as string | JSX.Element);
  const [debug, setDebug] = React.useState([] as JSX.Element[]);

  const [active, setActive] = React.useState(true);
  const [paused, setPaused] = React.useState(false);
  const [onlyHodlers, setOnlyHodlers] = React.useState(false);

  const [mbrs, setMBRS] = React.useState(undefined as string | undefined);
  const [pyro, setPYRO] = React.useState(undefined as string | undefined);
  const [hodler, setHodler] = React.useState(false);

  const [modalMessage, setModalMessage] = React.useState(
    undefined as string | JSX.Element | undefined
  );

  const donate = async () => {
    if (network) {
      const provider = HandleProviderType(network);
      const buyback = getTokenBuyback(network, provider);
      const tx = await buyback.deposit();
      if (tx.txid && tx.txid != ZeroHash.replace('0x', '')) {
        setModalMessage(
          <a
            style={{color: '#9627ba !important'}}
            href={`https://${
              (network ? network : 'MainNet') === 'TestNet' ? 'testnet-' : ''
            }explorer.metrixcoin.com/tx/${tx.txid}`}
            target='_blank'
          >
            {tx.txid}
          </a>
        );
      }
    }
  };

  const setup = async () => {
    if (network) {
      const provider = new APIProvider(network);
      const buyback = getTokenBuyback(network, provider);
      setPYRO(await buyback.core());
      setMBRS(await buyback.token());
    }
  };

  React.useEffect(() => {
    setup();
  }, []);

  return (
    <>
      <Head>
        <title>MBRS Exchange</title>
        <meta name='description' content='A web3 based MBRS exchange' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='favicon.png' />
      </Head>
      <main className={styles.main}>
        <Container>
          <Grid padded stackable stretched container>
            <Grid.Row stretched>
              <Grid.Column stretched width='16'>
                <Grid stretched>
                  <Grid.Row stretched>
                    <Message hidden={!!!message} error={error} success={!error}>
                      {message}
                    </Message>
                  </Grid.Row>
                  <Grid.Row stretched>
                    <Grid.Column stretched width='8'></Grid.Column>
                    <Grid.Column stretched width='4' textAlign='right'>
                      <Header style={{marginTop: '8px'}}>
                        <a
                          className='lavenderLink'
                          href='https://github.com/PyroPets/MBRS-TokenBuyback'
                          target='_blank'
                        >
                          <Icon name='file code outline' size='big' />
                        </a>
                      </Header>
                    </Grid.Column>
                    <Grid.Column stretched width='4'>
                      <Web3TransactionModal
                        message={modalMessage}
                        setMessage={setModalMessage}
                        trigger={
                          <Button
                            disabled={!!!network || !!!address || !connected}
                            icon
                            color='violet'
                            onClick={donate}
                          >
                            <Icon name='gift' /> Donate{' '}
                            <Image
                              avatar
                              size='small'
                              src='/images/metrix-logo.png'
                              style={{
                                width: '24px',
                                height: '24px',
                                marginTop: '-5px',
                                marginRight: '8px',
                              }}
                            />
                          </Button>
                        }
                      />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row stretched>
              <Grid padded stackable>
                <Grid.Row>
                  <Grid.Column width='8' stretched>
                    <ClientStatus
                      hodler={hodler}
                      setHodler={setHodler}
                      network={network}
                      setNetwork={setNetwork}
                      connected={connected}
                      setConnected={setConnected}
                      address={address}
                      setAddress={setAddress}
                      setDebug={setDebug}
                      setError={setError}
                      setMessage={setMessage}
                      pyro={pyro}
                      mbrs={mbrs}
                      active={active}
                      setActive={setActive}
                      paused={paused}
                      setPaused={setPaused}
                      onlyHodlers={onlyHodlers}
                      setOnlyHodlers={setOnlyHodlers}
                      modalMessage={modalMessage}
                      setModalMessage={setModalMessage}
                    />
                  </Grid.Column>
                  <Grid.Column width='8' stretched>
                    <AboutMBRSX network={network} />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Row>

            <Grid.Row stretched>
              <Grid.Column width='16'>
                <DebugContracts
                  connected={connected}
                  debug={debug}
                  debugging={debugging}
                  setDebugging={setDebugging}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row stretched>
              <Grid.Column stretched>
                <Footer />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </main>
    </>
  );
}
