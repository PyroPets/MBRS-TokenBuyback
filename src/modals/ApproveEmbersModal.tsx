import HandleProviderType from '@/helpers/HandleProviderType';
import {MRC20, NetworkType} from '@metrixcoin/metrilib';
import {ZeroHash} from 'ethers';
import React from 'react';
import {
  Button,
  Checkbox,
  CheckboxProps,
  Grid,
  Header,
  Input,
  InputOnChangeData,
  Message,
  Modal,
} from 'semantic-ui-react';

export default class ApproveEmbersModal extends React.Component<{
  network: NetworkType;
  address: string;
  button: JSX.Element;
  mbrs: string | undefined;
}> {
  state = {
    loading: false,
    isError: false,
    isSuccess: false,
    message: undefined as undefined | string | JSX.Element,
    open: false,
    approveAmount: 0,
    approveMax: false,
    showInvalidError: false,
    setOpen: (open: boolean): void => {
      this.setState({open});
    },
  };
  constructor(props: {
    network: NetworkType;
    address: string;
    button: JSX.Element;
    mbrs: string;
  }) {
    super(props);
    this.state = {
      loading: false,
      isError: false,
      isSuccess: false,
      message: undefined,
      open: false,
      approveAmount: 0,
      approveMax: false,
      showInvalidError: false,
      setOpen: (open: boolean) => {
        this.setState({open});
      },
    };
  }

  approveMbrs = async () => {
    this.setState({
      isError: false,
      message: undefined,
    });
    if (!this.props.mbrs) {
      return;
    }
    if (!this.state.approveAmount && !this.state.approveMax) {
      this.setState({
        isError: true,
        message: 'Must enter valid amount.',
      });
      return;
    }
    let amt = BigInt(this.state.approveAmount);
    if (this.state.approveMax) {
      amt = BigInt(
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      );
    }
    const provider = HandleProviderType(this.props.network);
    const token = new MRC20(this.props.mbrs, provider);
    const tx = await token.approve(this.props.address, amt);

    this.setState({
      isError: tx.txid === ZeroHash.replace('0x', ''),
      isSuccess: tx.txid !== ZeroHash.replace('0x', ''),
      message:
        tx.txid === ZeroHash.replace('0x', '') ? (
          'An Error has occurred.'
        ) : (
          <a
            style={{color: '#9627ba !important'}}
            href={`https://${
              (this.props.network ? this.props.network : 'MainNet') ===
              'TestNet'
                ? 'testnet-'
                : ''
            }explorer.metrixcoin.com/tx/${tx.txid}`}
            target='_blank'
          >
            {tx.txid}
          </a>
        ),
    });
  };

  render(): JSX.Element {
    const {open, setOpen} = this.state;
    return (
      <Modal
        dimmer='blurring'
        closeOnDimmerClick={false}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={this.props.button}
        basic
      >
        <Modal.Header as='h1'>
          Approve the TokenBuyback contract to use your MBRS for exchanging MBRS
          for MRX.
        </Modal.Header>
        <Modal.Content>
          <Grid stretched columns='equal'>
            <Grid.Row>
              <Grid.Column stretched>
                <label>
                  <Header style={{color: 'whitesmoke'}}>MBRS Amount</Header>
                </label>
                <Input
                  disabled={this.state.approveMax}
                  error={this.state.showInvalidError}
                  onChange={(
                    event: React.ChangeEvent<HTMLInputElement>,
                    data: InputOnChangeData
                  ) => {
                    if (event.target.value) {
                      if (String(event.target.value).indexOf(' ') != -1) {
                        this.setState({showInvalidError: true});
                        return;
                      }
                      const value = parseInt(event.target.value, 10);
                      // Test for valid number
                      if (isNaN(value)) {
                        this.setState({showInvalidError: true});
                      } else {
                        this.setState({
                          approveAmount: data.value,
                          showInvalidError: false,
                        });
                      }
                    }
                  }}
                ></Input>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row stretched>
              <Grid.Column>
                <Checkbox
                  label={
                    <label style={{color: 'whitesmoke'}}>Approve Maximum</label>
                  }
                  style={{fontSize: '18px'}}
                  onChange={(
                    event: React.FormEvent<HTMLInputElement>,
                    data: CheckboxProps
                  ) => {
                    this.setState({approveMax: data.checked});
                  }}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row stretched>
              <Grid.Column>
                {this.state.message != undefined ? (
                  <Message
                    color={
                      this.state.isError && !this.state.isSuccess
                        ? 'red'
                        : 'green'
                    }
                    content={this.state.message}
                    style={{
                      wordWrap: 'break-word',
                    }}
                  />
                ) : (
                  ''
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          {this.state.isSuccess ? (
            <Button
              disabled={this.state.loading}
              loading={this.state.loading}
              color='teal'
              size='huge'
              onClick={() =>
                this.setState({
                  open: false,
                  loading: false,
                  isSuccess: false,
                  isError: false,
                  message: undefined,
                })
              }
            >
              Close
            </Button>
          ) : (
            <Button
              disabled={this.state.loading}
              loading={this.state.loading}
              color='red'
              size='huge'
              onClick={() =>
                this.setState({
                  open: false,
                  loading: false,
                  isSuccess: false,
                  isError: false,
                  message: undefined,
                })
              }
            >
              Cancel
            </Button>
          )}
          <Button
            content='Confirm'
            labelPosition='right'
            icon='checkmark'
            onClick={this.approveMbrs}
            positive
            size='huge'
            loading={this.state.loading}
            disabled={this.state.loading || this.state.isSuccess}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}
