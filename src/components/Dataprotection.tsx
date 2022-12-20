import * as React from 'react';
import { ResponsiveContainer, footer, HistoryProps } from "./Homepage"
import {
  Button,
  Container,
  Grid,
  Header
} from 'semantic-ui-react';
import {getCookie, setCookie} from "../cookie"
import { siteBase } from "../data";
import { useHistory } from "react-router-dom";

interface Props extends HistoryProps {

}

interface State {

}

class DataProtection extends React.Component<Props, State> {
  render() {
    return (
      <ResponsiveContainer>
          <Container>
            <Grid>
              <Grid.Row>
                <Grid.Column width={16}>
                  <Header className="center aligned"
                      as="h1"
                      content="Dataprotection Aggrement"
                      style={{
                          fontSize:'4em',
                          fontWeight: 'normal',
                      }}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  Due to the way the website works, all data is publicly available. Any data entered anywhere within this website can be read edited by others unless specifically stateded otherwise.

                <Header className="center aligned heading" as="h2">Account Login</Header>
                  Loggin into an account is handled by Firebase. Passwords are not accessible to anyone. The Emails used to log in are visible to the site Admin. We reserve the right to disable or delete accounts without providing justification.
                
                <Header className="center aligned heading" as="h2">Cookies</Header>
                  The site places tracking cookies for Google Analytics. This information will be forwarded to the appropriate Google Analytics server for processing. All other Cookies are session only and will be deleted upon closing the window.
                </Grid.Column>
              </Grid.Row>
            </Grid>
        </Container>
        {footer(this.props.history)}
      </ResponsiveContainer>
    );
  }
}

export class DataProtectionAcceptor extends React.Component<HistoryProps, {}> { 
  render() {
    const dismissed = getCookie("cookies_dismissed");
    if (dismissed === "yes") {
      return null;
    }
    return (
      <Container className='cookieconsent'>
        <Grid className='cookieconsent'>
          <Grid.Row>
            <Grid.Column width={15}>
              By visiting Our website you consent to the our <button className="link-button" onClick={() => this.props.history.push(siteBase + "/dataprotection")}>dataprotection declatation</button> and the Usage of Cookies to allows us to improve this website.
            </Grid.Column>
            <Grid.Column width={1}>
              <Button primary onClick={
                () => {
                  setCookie("cookies_dismissed", "yes");
                  this.setState({});
                }
              }>Accept</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

const RenderDataProtection = (props: any) => {
  return <DataProtection history={useHistory()} {...props} />;
};

export default RenderDataProtection;