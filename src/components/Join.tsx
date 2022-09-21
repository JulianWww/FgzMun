import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import {
  Form, Grid, Header, InputOnChangeData,
  Message, Container, Segment, Icon
} from 'semantic-ui-react';
import { URLParameters } from '../types';
//import { CommitteeTemplate, TEMPLATE_TO_MEMBERS } from '../constants';
import ConnectionStatus from './ConnectionStatus';
import { Helmet } from 'react-helmet';
import {siteBase} from "../data";

interface Props extends RouteComponentProps<URLParameters> {
}

interface State {
    key: string;
    isValid: boolean;
    unsubscribe?: () => void;
  }

export default class Join extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
        key: '',
        isValid: false,
      };
  }

  handleInput = (event: React.SyntheticEvent<HTMLInputElement>, data: InputOnChangeData): void => {
    // XXX: Don't do stupid shit and choose form input names that don't
    // map to valid state properties
    // @ts-ignore
    /*if (data.value.length%3 === 0 && data.value.length !== 0)
    {
        data.value = data.value + "-";
    }*/
    if (data.value.length < 12)
    {
        if (data.value.length === 3 || data.value.length === 7)
        {
            if (this.state.key.length < data.value.length)
            {
                data.value = data.value + "-";
            }
            else
            { 
                data.value = data.value.slice(0, -1);
            }
        }
        this.setState({ "key": data.value });
        this.setState({ "isValid": (data.value.length === 11)});
    }
  }

  handleSubmit = () => {
    window.location.href = siteBase + '/Join/'+this.state.key;
  }


  renderJoinForm = () => {
    //const { user, template } = this.state;

    return (
      <React.Fragment>
        <Segment>
        <Form onSubmit={this.handleSubmit}>
            <Form.Input
              label="Name"
              name="key"
              fluid
              value={this.state.key}
              required
              error={!this.state.key}
              placeholder="Committee name"
              onChange={this.handleInput}
            />
            <Form.Button
              primary
              fluid
              disabled={!this.state.isValid}
              
            >
              Next
              <Icon name="arrow right" />
            </Form.Button>
          </Form>
        </Segment>
      </React.Fragment>
    );
  }

  render() {
    return (
      <Container style={{ padding: '1em 0em' }}>
        <Helmet>
          <title>{`Join Committee - Muncoordinated`}</title>
          <meta name="description" content="Login, create an account, or create
                                      a committee with Muncoordinated now!" />
        </Helmet>
        <ConnectionStatus />
        <Grid
          columns="equal"
          stackable
        >
          <Grid.Row>
            <Grid.Column>
              <Header as="h1" textAlign='center'>
                Muncoordinated
              </Header>
              <Message>
                <Message.Header>Browser compatibility notice</Message.Header>
                  <p>
                  Muncoordinated works best with newer versions of <a 
                    href="https://www.google.com/chrome/">Google Chrome</a>.
                   Use of other/older browsers has caused bugs and data loss.
                  </p>
              </Message>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            
            <Grid.Column>
              {this.renderJoinForm()}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}
