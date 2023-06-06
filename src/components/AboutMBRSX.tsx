import {getTokenBuybackAddress} from '@/buyback';
import {NetworkType} from '@metrixcoin/metrilib';
import {Header, Segment} from 'semantic-ui-react';
interface AboutProps {
  network: NetworkType | undefined;
}
export default function AboutMBRSX(props: AboutProps) {
  return (
    <Segment style={{paddingTop: '22px'}} inverted>
      <Header as='h1' style={{color: 'whitesmoke'}}>
        <Header style={{color: 'whitesmoke'}}>About MBRS Exchange</Header>
      </Header>
      <hr />
      <Header as='h3' style={{marginTop: '5%', color: 'whitesmoke'}}>
        <p>
          MBRS Exchange is a system made up of two smart contracts which
          utilizes the Metrix DGP system and an AutoGovernor to automatically
          generate MRX from governance rewards to exchange for MBRS.
        </p>
        <p>
          The system is active as long as the AutoGovernor is enrolled in the
          DGP Governance contract and the balance of the TokenBuyback contract
          is greater than 1 MRX.
        </p>
        <p>
          The MBRS to MRX exchange rate is determined by the total supply of
          MBRS and the MRX balance of the TokenBuyback smart contract relative
          to the amount of MBRS held in the TokenBuyback smart contract.
        </p>
        <p>
          This system is currently controlled by the PyroPets developers, and
          will be transferred to the PyroDAO in the future.
        </p>
      </Header>
      <Segment secondary inverted textAlign='center' style={{marginTop: '5%'}}>
        <Header
          as='h5'
          style={{marginTop: '1%', marginBottom: '1%', color: 'whitesmoke'}}
        >
          MBRS per MRX = ((Total Supply - Locked) * 1e8) / Vault
        </Header>
      </Segment>
      <Segment tertiary textAlign='center' style={{marginTop: '5%'}}>
        <Header style={{marginTop: '1%', marginBottom: '1%'}}>
          🔥MBRS will be used or burned by the PyroDAO🔥
        </Header>
      </Segment>
      <Header
        textAlign='center'
        as='h3'
        style={{marginTop: '5%', marginBottom: '5%', color: 'whitesmoke'}}
      >
        <a
          className='lavenderLink'
          style={{
            wordSpacing: '-4px',
            fontWeight: 'normal !important',
            fontSize: '1.1em !important',
          }}
          href={`https://${
            (props.network ? props.network : 'MainNet') === 'TestNet'
              ? 'testnet-'
              : ''
          }explorer.metrixcoin.com/contract/${getTokenBuybackAddress(
            props.network ? props.network : 'MainNet'
          )}`}
          target='_blank'
        >
          TokenBuyback contract on the MetrixCoin explorer
        </a>
      </Header>
    </Segment>
  );
}
