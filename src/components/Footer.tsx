import {Grid, Icon, List} from 'semantic-ui-react';

export default function Footer(): JSX.Element {
  const d = new Date();
  return (
    <Grid className='footer-bar' columns='equal' stackable>
      <Grid.Row className='footerNavBar'>
        <Grid.Column>
          <List.Item
            as='a'
            href='https://metrixcoin.com'
            target='_blank'
            className='lavenderLink'
            style={{
              wordSpacing: '-4px',
              fontWeight: 'normal !important',
              fontSize: '1.1em !important',
            }}
          >
            <Icon name='bolt' />
            Powered by MetrixCoin
          </List.Item>
        </Grid.Column>

        <Grid.Column style={{padding: '0px 4px'}}>
          <a
            className='lavenderLink'
            style={{
              wordSpacing: '-4px',
              fontWeight: 'normal !important',
              fontSize: '1.1em !important',
            }}
            href={`https://pyropets.org`}
            target='_blank'
            rel='noreferrer'
          >
            ©{`2023`}
            {d.getFullYear() !== Number(`2023`) ? `-${d.getFullYear()} ` : ' '}
            &nbsp;&nbsp;
            {`PyroPets Developers`}
          </a>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
