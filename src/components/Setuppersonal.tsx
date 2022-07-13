import * as React from 'react';
import * as firebase from 'firebase/app';
import { CommitteeData } from './Committee';
import { RouteComponentProps } from 'react-router';
import { Container, Form, Grid, Header, Message, Segment, Icon, Checkbox } from 'semantic-ui-react';
import { DropdownProps, CheckboxProps } from 'semantic-ui-react';
import { URLParameters } from '../types';
import { MemberOption } from "../constants"
import { recoverMemberOptions } from "./Committee"
import { Helmet } from 'react-helmet';
import ConnectionStatus from './ConnectionStatus';
import Loading from './Loading';
import { setCookie } from "../cookie";
import { getID } from "../utils";

interface Props extends RouteComponentProps<URLParameters> {
  committee: CommitteeData;
  fref: firebase.database.Reference;
}


interface State {
  committee?: CommitteeData;
  committeeFref: firebase.database.Reference;
  countryName?: string;
  isVoting: boolean;
  isValid: boolean;
}

export default class Stats extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    //const { match } = props;

    this.state = {
      committeeFref: firebase
        .database()
        .ref('committees')
        .child(this.props.match.params.committeeID),
      isVoting: false,
      isValid: true
    };
  }

  getName = (data: MemberOption[], key: string) => {
    for (let entry of data)
    {
      if (entry.key === key)
      {
        return entry.text;
      }
    }
    return "";
  }

  firebaseCallback = (committee: firebase.database.DataSnapshot | null) => {
    if (committee) {
      this.setState({ committee: committee.val() });
    }
  }

  componentDidMount() {
    this.state.committeeFref.on('value', this.firebaseCallback);
  }

  componentWillUnmount() {
    this.state.committeeFref.off('value', this.firebaseCallback);
  };

  getKey() {
    var array = new Uint32Array(10);
    crypto.getRandomValues(array);
    let out = "";
    for (let idx = 0; idx < array.length; idx++)
    {
      out = out+array[idx].toString(16);
    }
    return out;
  }

  submint = () => {
    this.showError("NoSelectionError", true);
    if (this.state.countryName && this.state.committee)
    {
      const members = this.state.committee.members || {};
      const id = getID(members, this.state.countryName);
      this.showError("presentError", true);
      this.showError("frozenError", true);
      if ((!members[id].present) && (!members[id].frozen))
      {
        this.state.committeeFref.child('members').child(id).child("voting").set(this.state.isVoting);
        this.state.committeeFref.child("members").child(id).child("present").set(true);
        setCookie("nation", this.state.countryName);
        const key = this.getKey();
        setCookie("authToken", key);
        this.state.committeeFref.child("members").child(id).child("authToken").set(key);

        window.location.href = '/committees/'+this.props.match.params.committeeID;
      }
      if (members[id].present) {
        this.showError("presentError", false);
      }
      if (members[id].frozen){
        this.showError("frozenError", false);
      }
    }
    else{
      this.showError("NoSelectionError", false);
    }
  };
  setCountry = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    const value = this.getName(recoverMemberOptions(this.state.committee), (data.value as string));
    this.setState({ countryName: value });
  }

  setVoting = (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {
    this.setState({ isVoting: data.checked as boolean})
  }

  showError (err: string, valid: boolean)
  {
    const element = document.getElementById(err);
    if (element)
    {
      if (valid){
        element.style.display = "None";
      }else{
        element.style.display = "block";
      }
    }
  }

  renderForm = (committee: CommitteeData) => {

    const members = recoverMemberOptions(committee);
    return (
      <React.Fragment>
        <Segment>
          <Form onSubmit={this.submint}>
            <Header as="h3">
              One Last thing:
            </Header>
            <Form.Dropdown
              label="Country name"
              name="country name"
              icon="search"
              fluid
              required
              selection
              search
              onChange={this.setCountry}
              options={members}>
            </Form.Dropdown>
            <Checkbox
              id="isVotingCheckBox"
              style={{ 'paddingRight': '50px' }}
              label="Voting"
              toggle
              checked={this.state.isVoting}
              onChange={this.setVoting}
              //onChange={
              //  checkboxHandler<SettingsData>(
              //    committeeFref.child('settings'),
              //    'motionsArePublic')}
            />
            <Message error id="presentError">
              <Message.Header>
                Country already Selected
              </Message.Header>
                A differant delegate has already selected "{this.state.countryName}". If this is your country please contact the chair.
            </Message>
            <Message error id="frozenError">
              <Message.Header>
                Country is frozen
              </Message.Header>
                Changes to "{this.state.countryName}" are frozen by the chair. If you have to change something contact the chair.
            </Message>
            <Message error id="NoSelectionError">
              <Message.Header>
                Nothing Selected
              </Message.Header>
                Select a country to proceed.
            </Message>
            <Form.Button
              style={{ 'marginTop': '20px' }}
              primary
              fluid
            >
              Join committee
              <Icon name="arrow right" />
            </Form.Button>
          </Form>
        </Segment>
      </React.Fragment>
    );
  }

  render() {
    const { committee } = this.state;

    if (committee) {
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
                {this.renderForm(committee)}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      );
    } else {
      return <Loading />;
    }
  }
}  