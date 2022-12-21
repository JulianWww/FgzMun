import * as React from 'react';
import { ResponsiveContainer, footer, HistoryProps } from "./Homepage"
import {
  Container,
  Grid,
  Header
} from 'semantic-ui-react';
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
                  <Header className="center aligned heading"
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
                
                <Header className="center aligned heading" as="h2">Committee Data</Header>
                All Data provided in the committee can be read and edied by anyone in the Committee. Any data put into the committee must be appropriate and the site owners will not take responsibility for the contents of committee data inputed by users. Furthermore, we reserve the right to delete or edit committee data if necessary.
                  
                
                </Grid.Column>
              </Grid.Row>
            </Grid>
        </Container>
        {footer(this.props.history)}
      </ResponsiveContainer>
    );
  }
}

const RenderDataProtection = (props: any) => {
  return <DataProtection history={useHistory()} {...props} />;
};

export default RenderDataProtection;