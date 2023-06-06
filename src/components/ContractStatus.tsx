import {NetworkType} from '@metrixcoin/metrilib';
import React from 'react';
import {Grid, Header, Icon, Image} from 'semantic-ui-react';

interface NetworkProps {
  totalSupply: string;
  locked: string;
  vault: string;
  busy: boolean;
  network: NetworkType;
  active: boolean;
  paused: boolean;
  onlyHodlers: boolean;
  rate: string;
  status: JSX.Element;
  getContractStatus(): void;
  updateContractStatus(): void;
}

export default function ContractStatus(props: NetworkProps) {
  React.useEffect(() => {
    props.getContractStatus();
    let interval: NodeJS.Timer | undefined = undefined;
    setTimeout(() => {
      interval = setInterval(() => {
        props.updateContractStatus();
      }, 60 * 1000);
    }, 60 * 1000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  return (
    <Grid stretched>
      <Grid.Row stretched textAlign='center'>
        <Grid.Column stretched textAlign='center'>
          {props.status}
        </Grid.Column>
      </Grid.Row>
      <Grid.Row stretched>
        <Grid.Column stretched textAlign='right' width={'5'}>
          <Header style={{color: 'whitesmoke'}}>Rate</Header>
        </Grid.Column>
        <Grid.Column stretched textAlign='left' width={'11'}>
          <Header style={{color: 'whitesmoke'}}>
            {props.busy ? (
              <Icon name='sync alternate' loading size='mini' />
            ) : (
              <>
                <Image
                  avatar
                  size='small'
                  src='/images/logo.png'
                  style={{
                    width: '33px',
                    height: '33px',
                    marginTop: '-5px',
                    marginRight: '8px',
                  }}
                />
                {`${props.rate} : 1 `}

                <>
                  <Image
                    avatar
                    size='small'
                    src='/images/metrix-logo.png'
                    style={{
                      width: '28px',
                      height: '28px',
                      marginTop: '-5px',
                      marginRight: '8px',
                    }}
                  />
                </>
              </>
            )}
          </Header>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row stretched>
        <Grid.Column stretched textAlign='right' width={'5'}>
          <Header style={{color: 'whitesmoke'}}>Supply</Header>
        </Grid.Column>
        <Grid.Column stretched textAlign='left' width={'11'}>
          <Header style={{color: 'whitesmoke'}}>
            {props.busy ? (
              <Icon name='sync alternate' loading size='mini' />
            ) : (
              <>
                {`${props.totalSupply} `}
                <Image
                  avatar
                  size='small'
                  src='/images/logo.png'
                  style={{
                    width: '33px',
                    height: '33px',
                    marginTop: '-5px',
                    marginRight: '8px',
                  }}
                />
              </>
            )}
          </Header>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row stretched>
        <Grid.Column stretched textAlign='right' width={'5'}>
          <Header style={{color: 'whitesmoke'}}>Locked</Header>
        </Grid.Column>
        <Grid.Column stretched textAlign='left' width={'11'}>
          <Header style={{color: 'whitesmoke'}}>
            {props.busy ? (
              <Icon name='sync alternate' loading size='mini' />
            ) : (
              <>
                {`${props.locked} `}
                <Image
                  avatar
                  size='small'
                  src='/images/logo.png'
                  style={{
                    width: '33px',
                    height: '33px',
                    marginTop: '-5px',
                    marginRight: '8px',
                  }}
                />
              </>
            )}
          </Header>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row stretched>
        <Grid.Column stretched textAlign='right' width={'5'}>
          <Header style={{color: 'whitesmoke'}}>Vault</Header>
        </Grid.Column>
        <Grid.Column stretched textAlign='left' width={'11'}>
          <Header style={{color: 'whitesmoke'}}>
            {props.busy ? (
              <Icon name='sync alternate' loading size='mini' />
            ) : (
              <>
                {`${props.vault} `}
                <Image
                  avatar
                  size='small'
                  src='/images/metrix-logo.png'
                  style={{
                    width: '28px',
                    height: '28px',
                    marginTop: '-5px',
                    marginRight: '8px',
                  }}
                />
              </>
            )}
          </Header>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
