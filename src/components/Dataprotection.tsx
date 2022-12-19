import * as React from 'react';
import { ResponsiveContainer, footer } from "./Homepage"
import {
  Button,
  Container,
  Grid,
  Header, Popup,
  Icon,
  Image,
  List,
  Menu,
  Responsive,
  Segment,
  Sidebar,
  Visibility,
} from 'semantic-ui-react';

interface Props {

}

interface State {

}

export default class Onboard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <ResponsiveContainer>
        Due to the way the website works, all data is publicly available. Any data entered anywhere within this website can be read edited by others unless specifically stateded otherwise

        <Header>Account Login</Header>
        {footer}
      </ResponsiveContainer>
    );
  }
}