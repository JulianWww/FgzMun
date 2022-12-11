import * as React from 'react';
import  { Redirect } from 'react-router-dom'
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
import { siteBase } from "../data";
import { Rank } from './Member';

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
  moveOn: boolean;
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
      isValid: true,
      moveOn: false
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

  loginError(reasons: any) {
    alert (reasons)
  }


  async rankRequirements(id: string) {
    const { committee } = this.state;
    if (committee !== undefined) {
      const { members } = committee;
      if ( members !== undefined) {
        const { rank } = members[id];
        if (rank === Rank.Veto) {
          await this.state.committeeFref.child("members").child(id).child("voting").set(true);
        }
      }
    }
  }

  async setDBData(id: string) {
    //const key = this.getKey();
    setCookie("nation", this.state.countryName);
    //setCookie("authToken", key);
    
    await this.state.committeeFref.child("members").child(id).child("voting").set(this.state.isVoting);
    //await this.state.committeeFref.child("members").child(id).child("authToken").set(key);
    await this.state.committeeFref.child("members").child(id).child("present").set(true);
    await this.rankRequirements(id);
    this.setState({ moveOn: true })
  }

  submint = () => {
    this.showError("NoSelectionError", true);
    this.showError("RedirectionError", true);
    if (this.state.countryName && this.state.committee)
    {
      const members = this.state.committee.members || {};
      this.showError("presentError", true);
      this.showError("frozenError", true);
      if ((!members[this.state.countryName].frozen))
      {
        this.setDBData(this.state.countryName);
      }
      if (members[this.state.countryName].present) {
        this.showError("presentError", false);
      }
      if (members[this.state.countryName].frozen){
        this.showError("frozenError", false);
      }
    }
    else{
      this.showError("NoSelectionError", false);
    }
  };
  setCountry = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    if (this.state.committee && this.state.committee.members && data.value) {
      const value = this.getName(recoverMemberOptions(this.state.committee), (data.value as string));
      const members = this.state.committee.members || {};
      const id = getID(members, value);
      this.setState({ countryName: id });
      this.showError("frozenError", !this.state.committee.members[id].frozen);
    }
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
    if (this.state.moveOn) {
      console.log("redirecting");
      return (
        <Redirect to={siteBase + '/committees/' + this.props.match.params.committeeID}  />
      )
    }
    return (
      <React.Fragment>
        <Segment>
          <Form>
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
            <Message warning id="presentError">
              <Message.Header>
                Country already Selected
              </Message.Header>
                A different delegate has already selected this country. This is mearly informational.
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
            <Message success className={this.state.moveOn ? "visible" : ""}>
              <Message.Header>
                Redirection
              </Message.Header>
              If you are not automatically redirected click&nbsp;<button type="button" className="link-button" onClick={() => this.props.history.push(siteBase + '/committees/' + this.props.match.params.committeeID)}>here</button>
            </Message>
            <Form.Button
              style={{ 'marginTop': '20px' }}
              primary
              fluid
              onClick={this.submint}
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