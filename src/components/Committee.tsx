import * as React from 'react';
import firebase from 'firebase/app';
import { RouteComponentProps } from 'react-router';
import { Route } from 'react-router-dom';
import { MemberData, MemberID } from './Member';
import Caucus, { CaucusData, CaucusID, DEFAULT_CAUCUS, DEFAULT_CAUCUS_TIME_SECONDS, CaucusStatus } from './Caucus';
import { Resolution, ResolutionData, ResolutionID, DEFAULT_RESOLUTION } from './Resolution';
import Admin from './Admin';
import { Icon, Menu, SemanticICONS, Dropdown, Container, Responsive, Sidebar, Header,
  List, Input, Button, Segment } from 'semantic-ui-react';
import { Helmet } from 'react-helmet';
import Stats from './Stats';
import { MotionID, MotionData } from './Motions';
import { TimerData, DEFAULT_TIMER } from './Timer';
import Unmod from './Unmod';
import Notes from './Notes';
import Help from './Help';
import Motions from './Motions';
import { putCaucus } from '../actions/caucus-actions';
import { URLParameters } from '../types';
import Loading from './Loading';
import Footer from './Footer';
import Settings, { SettingsData, DEFAULT_SETTINGS } from './Settings';
import Files, { PostID, PostData } from './Files';
import { LoginModal } from './Auth';
import { CommitteeShareHint } from './ShareHint';
import Notifications from './Notifications';
import { putResolution } from '../actions/resolution-actions';
import ConnectionStatus from './ConnectionStatus';
import { membersToOptions, membersToPresentOptions, isOwner } from '../utils';
import { fieldHandler } from '../actions/handlers';
import { CommitteeTemplate, MemberOption } from '../constants';
import { putStrawpoll } from '../actions/strawpoll-actions';
import Strawpoll, { DEFAULT_STRAWPOLL, StrawpollID, StrawpollData } from './Strawpoll';
import { logClickSetupCommittee } from '../analytics';
import { siteBase } from "../data";
import { useVoterID } from "../hooks"
 
export function recoverMemberOptions(committee?: CommitteeData): MemberOption[] {
  if (committee) {
    return membersToOptions(committee.members);
  } else {
    return [];
  }
}

export function recoverPresentMemberOptions(committee?: CommitteeData): MemberOption[] {
  if (committee) {
    return membersToPresentOptions(committee.members);
  } else {
    return [];
  }
}

export function recoverMembers(committee?: CommitteeData): Record<MemberID, MemberData> | undefined {
  return committee ? (committee.members || {} as Record<MemberID, MemberData>) : undefined;
}

export function recoverSettings(committee?: CommitteeData): Required<SettingsData> {
  let timersInSeparateColumns: boolean = 
    committee?.settings.timersInSeparateColumns 
    ?? DEFAULT_SETTINGS.timersInSeparateColumns;

  const moveQueueUp: boolean = 
    committee?.settings.moveQueueUp 
    ?? DEFAULT_SETTINGS.moveQueueUp;

  const autoNextSpeaker: boolean = 
    committee?.settings.autoNextSpeaker 
    ?? DEFAULT_SETTINGS.autoNextSpeaker;

  const motionVotes: boolean = 
    committee?.settings.motionVotes 
    ?? DEFAULT_SETTINGS.motionVotes;

  const motionsArePublic: boolean = 
    committee?.settings.motionsArePublic 
    ?? DEFAULT_SETTINGS.motionsArePublic;

  return {
    timersInSeparateColumns,
    moveQueueUp, 
    autoNextSpeaker, 
    motionVotes,
    motionsArePublic
  };
}

export function recoverCaucus(committee: CommitteeData | undefined, caucusID: CaucusID): CaucusData | undefined {
  const caucuses = committee ? committee.caucuses : {};
  
  return (caucuses || {})[caucusID];
}

export function recoverResolution(committee: CommitteeData | undefined, resolutionID: ResolutionID): ResolutionData | undefined {
  const resolutions = committee ? committee.resolutions : {};
  
  return (resolutions || {})[resolutionID];
}

interface DesktopContainerProps {
  menu?: React.ReactNode;
  body?: React.ReactNode;
}

interface DesktopContainerState {
}

interface MobileContainerProps {
  menu?: React.ReactNode;
  body?: React.ReactNode;
}

interface MobileContainerState {
  sidebarOpened: boolean;
}

interface Props extends RouteComponentProps<URLParameters> {
}

interface State {
  committee?: CommitteeData;
  committeeFref: firebase.database.Reference;
  authUnsubscribe?: () => void;
  user?: firebase.User | null,
}

export type CommitteeID = string;


export interface CommitteeData {
  name: string;
  chair: string;
  topic: string;
  conference?: string; // TODO: Migrate
  template?: CommitteeTemplate;
  creatorUid: firebase.UserInfo['uid'];
  members?: Record<MemberID, MemberData>;
  caucuses?: Record<CaucusID, CaucusData>;
  resolutions?: Record<ResolutionID, ResolutionData>;
  strawpolls?: Record<StrawpollID, StrawpollData>;
  motions?: Record<MotionID, MotionData>;
  files?: Record<PostID, PostData>;
  timer: TimerData;
  notes: string;
  settings: SettingsData;
}

const GENERAL_SPEAKERS_LIST: CaucusData = {
   ...DEFAULT_CAUCUS, name: 'General Speakers\' List' 
};

export const DEFAULT_COMMITTEE: CommitteeData = {
  name: '',
  chair: '',
  topic: '',
  conference: '',
  creatorUid: '',
  members: {} as Record<MemberID, MemberData>,
  caucuses: {
    'gsl': GENERAL_SPEAKERS_LIST
  } as Record<string, CaucusData>,
  resolutions: {} as Record<ResolutionID, ResolutionData>,
  files: {} as Record<PostID, PostData>,
  strawpolls: {} as Record<StrawpollID, StrawpollData>,
  motions: {} as Record<MotionID, MotionData>,
  timer: { ...DEFAULT_TIMER, remaining: DEFAULT_CAUCUS_TIME_SECONDS },
  notes: '',
  settings: DEFAULT_SETTINGS
};

class DesktopContainer extends React.Component<DesktopContainerProps, DesktopContainerState> {
  render() {
    const { body, menu } = this.props;

    // Semantic-UI-React/src/addons/Responsive/Responsive.js
    return (
      <Responsive {...{ minWidth: Responsive.onlyMobile.maxWidth as number + 1 }}>
        <Menu fluid size="small">
          {menu}
        </Menu>
        {body}
      </Responsive>
    );
  }
}

class MobileContainer extends React.Component<MobileContainerProps, MobileContainerState> {
  constructor(props: MobileContainerProps) {
    super(props);

    this.state = {
      sidebarOpened: false
    };
  }

  handlePusherClick = () => {
    const { sidebarOpened } = this.state;

    if (sidebarOpened) {
      this.setState({ sidebarOpened: false });
    }
  }

  handleToggle = () => {
    this.setState({ sidebarOpened: !this.state.sidebarOpened });
  }

  render() {
    const { body, menu } = this.props;
    const { sidebarOpened } = this.state;

    return (
      <Responsive {...Responsive.onlyMobile}>
        <Sidebar.Pushable>
          <Sidebar as={Menu} animation="uncover" stackable visible={sidebarOpened}>
            {menu}
          </Sidebar>

          <Sidebar.Pusher dimmed={sidebarOpened} onClick={this.handlePusherClick} style={{ minHeight: '100vh' }}>
            <Menu size="large">
              <Menu.Item onClick={this.handleToggle}>
                <Icon name="sidebar" />
              </Menu.Item>
            </Menu>
            {body}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Responsive>
    );
  }
}

interface ResponsiveContainerProps extends RouteComponentProps<URLParameters> {
  children?: React.ReactNode;
  committee?: CommitteeData;
}

function ResponsiveNav(props: ResponsiveContainerProps) {
  const committeeID: CommitteeID = props.match.params.committeeID;

  const makeMenuItem = (name: string, text: string) => {
    const destination = name[0] === "/" ? `${siteBase}${name}` : `${siteBase}/committees/${committeeID}/${name.toLowerCase()}`;

    return (
      <Menu.Item
        key={text}
        name={text.toLowerCase()}
        active={props.location.pathname === destination}
        onClick={() => props.history.push(destination)}
        text={text}
        // icon={icon}
      />
    );
  }

  const makeSubmenuButton = (name: string, icon: SemanticICONS, f: () => void) => {
    return (
      <Dropdown.Item
        key={name}
        name={name.toLowerCase()}
        active={false}
        onClick={f}
        icon={icon}
        text={name}
      />
    );
  }

  const makeMenuIcon = (name: string, icon: SemanticICONS) => {

    const destination = (name[0] === "/" ? `${siteBase}${name}` : `${siteBase}/committees/${committeeID}/${name.toLowerCase()}`);

    return (
      <Menu.Item
        key={name}
        active={props.location.pathname === destination}
        position="right"
        onClick={() => props.history.push(destination)}
        icon={icon}
      />
    );
  }

  const makeSubmenuItem = (id: string, name: string, description: string | undefined, type: 'caucuses' | 'resolutions' | 'strawpolls') => {
    const destination = `${siteBase}/committees/${committeeID}/${type}/${id}`;

    return (
      <Dropdown.Item
        key={id}
        name={name}
        active={props.location.pathname === destination}
        onClick={() => props.history.push(destination)}
        text={name}
      />
    );
  }

  const pushCaucus = () => {
    const ref = putCaucus(committeeID, DEFAULT_CAUCUS);

    props.history
      .push(`${siteBase}/committees/${committeeID}/caucuses/${ref.key}`);
  }

  const pushResolution = () => {
    const ref = putResolution(committeeID, DEFAULT_RESOLUTION);

    props.history
      .push(`${siteBase}/committees/${committeeID}/resolutions/${ref.key}`);
  }

  const pushStrawpoll = () => {
    const ref = putStrawpoll(committeeID, DEFAULT_STRAWPOLL);

    props.history
      .push(`${siteBase}/committees/${committeeID}/strawpolls/${ref.key}`);
  }

  const renderMenuItems = () => {
    const { committee, history } = props;

    const caucuses = committee ? committee.caucuses : undefined;
    const resolutions = committee ? committee.resolutions : undefined;
    const strawpolls = committee ? committee.strawpolls : undefined;

    const caucusItems = Object.keys(caucuses || {})
      .filter(key => caucuses![key].status !== CaucusStatus.Closed)
      .map(key => makeSubmenuItem(key, caucuses![key].name, caucuses![key].topic, 'caucuses')
    );

    const resolutionItems = Object.keys(resolutions || {}).map(key =>
      makeSubmenuItem(key, resolutions![key].name, undefined, 'resolutions')
    );

    const strawpollItems = Object.keys(strawpolls || {}).map(key =>
      makeSubmenuItem(key, strawpolls![key].question, undefined, 'strawpolls')
    );

    return (
      <React.Fragment>
        <Menu.Item
          header
          key="header"
          onClick={() => props.history.push(`${siteBase}/committees/${committeeID}`)}
          active={props.location.pathname === `${siteBase}/committees/${committeeID}`}
        >
          {committee ? committee.name : <Loading small />}
        </Menu.Item>
        {makeMenuItem('Setup', 'Setup')}
        {makeMenuItem('Motions', 'Motions')}
        {makeMenuItem('Unmod', 'Unmod')}
        <Dropdown key="caucuses" item text="Caucuses" loading={!committee}>
          <Dropdown.Menu>
            {makeSubmenuButton('New caucus', 'add', pushCaucus)}
            {caucusItems}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown key="resolutions" item text="Resolutions" loading={!committee}>
          <Dropdown.Menu>
            {makeSubmenuButton('New resolution', 'add', pushResolution)}
            {resolutionItems}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown key="strawpolls" item text="Strawpolls" loading={!committee}>
          <Dropdown.Menu>
            {makeSubmenuButton('New strawpoll', 'add', pushStrawpoll)}
            {strawpollItems}
          </Dropdown.Menu>
        </Dropdown>
        {makeMenuItem('Notes', 'Notes')}
        {makeMenuItem('Posts', 'Posts')}
        {makeMenuItem('Stats', 'Stats')}
        <Menu.Menu key="icon-submenu" position="right">
          {makeMenuItem('/', 'Home Page')}
          {makeMenuIcon('Settings', 'settings')}
          {makeMenuIcon('Help', 'help')}
        </Menu.Menu>
        <Menu.Item key="login">
          <LoginModal history={history} />
        </Menu.Item>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <DesktopContainer body={props.children} menu={renderMenuItems()} />
      <MobileContainer body={props.children} menu={renderMenuItems()} />
    </React.Fragment>
  );
}

export default class Committee extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const committeeID: CommitteeID = this.props.match.params.committeeID;

    this.state = {
      committeeFref: firebase.database().ref('committees').child(committeeID),
    };
  }

  firebaseCallback = (committee: firebase.database.DataSnapshot | null) => {
    if (committee) {
      this.setState({ committee: committee.val() });
    }
  }

  componentDidMount() {
    this.state.committeeFref.on('value', this.firebaseCallback);

    const authUnsubscribe = firebase.auth().onAuthStateChanged(
      this.authStateChangedCallback,
    );

    this.setState({ authUnsubscribe });
  }

  componentWillUnmount() {
    this.state.committeeFref.off('value', this.firebaseCallback);

    if (this.state.authUnsubscribe) {
      this.state.authUnsubscribe();
    }
  }

  gotoSetup = () => {
    const { committeeID } = this.props.match.params;

    this.props.history
      .push(`${siteBase}/committees/${committeeID}/setup`);

    logClickSetupCommittee();
  }

  renderAdmin = () => {
    return (
      <Admin
        {...this.props}
        committee={this.state.committee || DEFAULT_COMMITTEE}
        fref={this.state.committeeFref}
        isOwner={isOwner(this.state.committee, this.state.user)}
      />
    );
  }

  renderWelcome = () => {
    const { committee, committeeFref } = this.state;

    return (
      <Container text style={{ padding: '1em 0em' }}>
        <Helmet>
          <title>{`${committee?.name} - Muncoordinated`}</title>
        </Helmet>
        <Header as="h1">
          <Input
            value={committee ? committee.name : ''}
            onChange={fieldHandler<CommitteeData>(committeeFref, 'name')}
            fluid
            error={committee ? !committee.name : false}
            placeholder="Committee name"
          />
        </Header>
        <List>
          <List.Item>
            <Input
              label="Topic"
              value={committee ? committee.topic : ''}
              onChange={fieldHandler<CommitteeData>(committeeFref, 'topic')}
              fluid
              loading={!committee}
              placeholder="Committee topic"
            />
          </List.Item>
          <List.Item>
            <Input
              label="Conference"
              value={committee ? (committee.conference || '') : ''}
              onChange={fieldHandler<CommitteeData>(committeeFref, 'conference')}
              fluid
              loading={!committee}
              placeholder="Conference name"
            />
          </List.Item>
        </List>
        <CommitteeShareHint committeeID={this.props.match.params.committeeID} />
        <Segment textAlign="center" basic>
          <Button as="a" primary size="large" onClick={this.gotoSetup}>
            Setup committee
            <Icon name="arrow right" />
          </Button>
        </Segment>
      </Container>
    );
  }
  authStateChangedCallback = (user: firebase.User | null) => {
    this.setState({ user: user });
  }
  renderMotions = () => {
    const [voterID] = useVoterID();
    const owner = isOwner(this.state.committee, this.state.user);
    return (
      <Motions
        {...this.props}
        voterID={voterID}
        isOwner={owner}
      />
    );
  }
  renderUnmod = () => {
    return (
      <Unmod
        {...this.props}
        isOwner={isOwner(this.state.committee, this.state.user)}
      />
    )
  }
  renderFiles = () => {
    return (
      <Files
        {...this.props}
        isOwner={isOwner(this.state.committee, this.state.user)}
      />
    )
  }

  render() {
    const { renderAdmin, renderWelcome, renderMotions, renderUnmod, renderFiles } = this;

    return (
      <React.Fragment>
        <Notifications {...this.props} />
        <ResponsiveNav {...this.props} committee={this.state.committee} >
          <Container text>
            <ConnectionStatus />
          </Container>
          <Route exact={true} path={ siteBase + "/committees/:committeeID"} render={renderWelcome} />
          <Route exact={true} path={ siteBase + "/committees/:committeeID/setup"} render={renderAdmin} />
          <Route exact={true} path={ siteBase + "/committees/:committeeID/stats"} component={Stats} />
          <Route exact={true} path={ siteBase + "/committees/:committeeID/unmod"} render={renderUnmod} />
          <Route exact={true} path={ siteBase + "/committees/:committeeID/motions"} component={renderMotions} />
          <Route exact={true} path={ siteBase + "/committees/:committeeID/notes"} component={Notes} />
          <Route exact={true} path={ siteBase + "/committees/:committeeID/posts"} render={renderFiles} />
          <Route exact={true} path={ siteBase + "/committees/:committeeID/settings"} component={Settings} />
          <Route exact={true} path={ siteBase + "/committees/:committeeID/help"} component={Help} />
          <Route path={ siteBase + "/committees/:committeeID/caucuses/:caucusID"} component={Caucus} />
          <Route path={ siteBase + "/committees/:committeeID/resolutions/:resolutionID/:tab?"} component={Resolution} />
          <Route path={ siteBase + "/committees/:committeeID/strawpolls/:strawpollID"} component={Strawpoll} />
          <Footer />
        </ResponsiveNav>
      </React.Fragment>
    );
  }
}
