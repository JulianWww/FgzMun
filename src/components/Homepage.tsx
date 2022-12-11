import * as React from 'react';
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
import { logClickJoinACommitteeButton, logClickCreateACommitteeButton, logClickLogInButton, logClickSignupButton } from '../analytics';
import { siteBase } from "../data";
import  Carousel from  "./utils/carousel";
import useImagePreloader from '../hooks';
import { isPropertyAssignment } from 'typescript';
import { useHistory } from "react-router-dom";

const fgzmun1     = "fgzmun1.jpg"
const fgzmun2     = "/fgzmun2.jpg"
const IsarMun22_1 = "/isarMun22-1.jpg"
const IsarMun22_2 = "/isarMun22-2.jpg"
const IsarMun22_3 = "/isarMun22-3.jpg"
const IsarMun22_4 = "/isarMun22-4.jpg"

const toPreload = [
  fgzmun1,
  fgzmun2,
  IsarMun22_1,
  IsarMun22_2,
  IsarMun22_3
]

export interface HistoryProps {
  history: any
}

const REPO_LINK = 'https://github.com/MunFgz/FgzMun';
export const footer = (
  <Segment inverted vertical style={{ padding: '5em 0em' }}>
    <Container>
      <Grid divided inverted stackable>
        <Grid.Row>
          <Grid.Column width={3}>
            <Header inverted as="h4" content="About" />
            <List link inverted>
              <List.Item as="a" href={REPO_LINK}>Source</List.Item>
              <List.Item
                as="a"
                href="https://github.com/MunFgz/FgzMun/blob/master/LICENSE"
              >
                License
              </List.Item>
              {/* <List.Item as="a">Contact Us</List.Item> TODO */}
            </List>
          </Grid.Column>
          <Grid.Column width={3}>
            <Header inverted as="h4" content="Services" />
            <List link inverted>
              <List.Item as="a" href="https://github.com/MunFgz/FgzMun/issues">Support</List.Item>
              <List.Item as="a" href="https://www.helpmymun.com/">MUN Resources</List.Item>
              {/* <List.Item as="a">FAQ</List.Item> TODO*/}
            </List>
          </Grid.Column>
          <Grid.Column width={6}>
            <Header as="h4" inverted>Info</Header>
            <p>Made with <span role="img" aria-label="love">💖</span> by <a href="https://github.com/MaxwellBo">Max Bo</a>, 
            with assistance from the <a href="https://www.facebook.com/UQUNSA/">UQ United Nations Student Association</a> and 
            modified by <a href="https://github.com/JulianWww">JulianWww</a>
            </p>
            <p>Copyright © 2022</p>
          </Grid.Column>
          <Grid.Column width={3}>
            <Header as="h4" inverted>Contact</Header>
            <div>Mun group:</div>
            <p style={{textIndent: "10px"}}>mun@fgz.ch</p>

            <div>Admin:</div>
            <p style={{textIndent: "10px"}}>Jwandhoven@gmail.com</p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  </Segment>
)

interface HomepageHeadingProps {
  mobile: boolean;
}

/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */
const HomepageHeading = (history: any) => ({ mobile }: HomepageHeadingProps) => (
  <Container text>
    <Header
      as="h1"
      content="FGZ Model United Nations"
      inverted
      style={{
        fontSize: mobile ? '2em' : '4em',
        fontWeight: 'normal',
        marginBottom: 0,
        marginTop: mobile ? '1.5em' : '3em',
      }}
    />
    <Header
      as="h2"
      content=""
      inverted
      style={{
        fontSize: mobile ? '1.5em' : '1.7em',
        fontWeight: 'normal',
        marginTop: mobile ? '0.5em' : '1.5em',
      }}
    />
    <br />
    <Button as="a" primary size="huge" onClick={() => {history.push(siteBase + "/onboard");logClickCreateACommitteeButton();}}>
      Create a committee
      <Icon name="arrow right" />
    </Button>
    <Button as="a" primary size="huge" onClick={() => {history.push(siteBase + "/join");logClickJoinACommitteeButton()}}>
      Join a committee
      <Icon name="arrow right" />
    </Button><br />
    <Button as="a" primary size="huge" onClick={() => history.push(siteBase + "/StrawPoll")} style={{"marginTop": "5px"}}>
      Vote on strawpoll
      <Icon name="arrow right" />
    </Button>
    <br />
  </Container>
);

interface DesktopContainerProps {
  children?: React.ReactNode;
  Heading: (({ mobile }: HomepageHeadingProps) => JSX.Element);
}

interface DesktopContainerState {
  fixed: boolean;
}

function path() {
  return window.location.pathname;
}

/* Heads up!
 * Neither Semantic UI nor Semantic UI React offer a responsive navbar, however, it can be implemented easily.
 * It can be more complicated, but you can create really flexible markup.
 */

interface ChildrenProps {
  children?: React.ReactNode
}

export function DesktopContainerBuilder(props: ChildrenProps) {
  const history = useHistory();
  return <DesktopContainer
    history={history}
    Heading={HomepageHeading(history)}
    {...props}
  />
}

export function MobileContainerBuilder(props: ChildrenProps) {
  const history = useHistory();
  return <MobileContainer
    history={history}
    Heading={HomepageHeading(history)}
    {...props}
  />
}

class DesktopContainer extends React.Component<DesktopContainerProps & HistoryProps, DesktopContainerState> {
  constructor(props: DesktopContainerProps & HistoryProps) {
    super(props);

    this.state = {
      fixed: false
    };
  }

  hideFixedMenu = () => {
    this.setState({ fixed: false });
  }

  showFixedMenu = () => {
    this.setState({ fixed: true });
  }

  render() {
    const { children } = this.props;
    const { fixed } = this.state;
    const _path = path();
    console.log(_path);

    // Semantic-UI-React/src/addons/Responsive/Responsive.js
    return (
      // @ts-ignore
      <Responsive {...{ minWidth: Responsive.onlyMobile.maxWidth + 1 }}>
        <Visibility once={false} onBottomPassed={this.showFixedMenu} onBottomPassedReverse={this.hideFixedMenu}>
          <Segment inverted textAlign="center" style={{ minHeight: 700, padding: '1em 0em' }} vertical>
            <Menu
              fixed={fixed ? 'top' : undefined}
              inverted={!fixed}
              pointing={!fixed}
              secondary={!fixed}
              size="large"
            >
              <Container>
                <Menu.Item 
                  as="a" 
                  active={_path === siteBase + "/" || _path === siteBase}
                  onClick={() => this.props.history.push(siteBase + "/")}
                >
                  Home
                </Menu.Item>
                <Popup trigger={
                  <Menu.Item 
                    as="a" 
                    onClick={() => this.props.history.push(siteBase + "/RoP")}
                    active={_path === siteBase + "/RoP"}
                  >
                    RoP
                  </Menu.Item>
                }>
                  Rules of Procedure
                </Popup>
                <Menu.Item 
                  as="a" 
                  onClick={() => this.props.history.push(siteBase + "/team")}
                  active={_path === siteBase + "/team"}
                >
                  Team
                </Menu.Item>
                <Menu.Item 
                  as="a" 
                  onClick={() => this.props.history.push(siteBase + "/team/former")}
                  active={_path === siteBase + "/team/former"}
                >
                  Former Members
                </Menu.Item>
                <Menu.Item 
                  as="a" 
                  onClick={() => this.props.history.push(siteBase + "/events")}
                  active={_path === siteBase + "/events"}
                >
                  Events
                </Menu.Item>
                <Menu.Item position="right">
                  <Button 
                    as="a" 
                    inverted={!fixed}
                    onClick={() => {this.props.history.push(siteBase + "/onboard"); logClickLogInButton()}}>
                    Log in
                  </Button>
                  <Button 
                    as="a" 
                    inverted={!fixed} 
                    primary={fixed} 
                    style={{ marginLeft: '0.5em' }} 
                    onClick={() => {this.props.history.push(siteBase + "/onboard"); logClickSignupButton()}}>
                    Sign up
                  </Button>
                </Menu.Item>
              </Container>
            </Menu>
            <this.props.Heading mobile={false} />
          </Segment>
        </Visibility>

        {children}
      </Responsive>
    );
  }
}

interface MobileContainerProps {
  children?: React.ReactNode;
  Heading: (({ mobile }: HomepageHeadingProps) => JSX.Element);
}

interface MobileContainerState {
  sidebarOpened: boolean;
}

export class MobileContainer extends React.Component<MobileContainerProps & HistoryProps, MobileContainerState> {
  constructor(props: MobileContainerProps & HistoryProps) {
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
    const { children } = this.props;
    const { sidebarOpened } = this.state;
    const _path = path();

    return (
      <Responsive {...Responsive.onlyMobile}>
        <Sidebar.Pushable>
          <Sidebar as={Menu} animation="uncover" inverted vertical visible={sidebarOpened}>
          <Menu.Item 
                  as="a" 
                  onClick={() => this.props.history.push(siteBase + "/")}
                  active={_path === siteBase + "/" || _path === siteBase}
                >
                  Home
                </Menu.Item>
                <Popup trigger={
                  <Menu.Item 
                    as="a" 
                    onClick={() => this.props.history.push(siteBase + "/RoP")}
                    active={_path === siteBase + "/RoP"}
                  >
                    RoP
                  </Menu.Item>
                }>
                  Rules of Procedure
                </Popup>
                <Menu.Item 
                  as="a" 
                  onClick={() => this.props.history.push(siteBase + "/team")}
                  active={_path === siteBase + "/team"}
                >
                  Team
                </Menu.Item>
                <Menu.Item 
                  as="a" 
                  onClick={() => this.props.history.push(siteBase + "/team/former")}
                  active={_path === siteBase + "/team/former"}
                >
                  Former Members
                </Menu.Item>
                <Menu.Item 
                  as="a" 
                  onClick={() => this.props.history.push(siteBase + "/events")} 
                  active={_path === siteBase + "/events"}
                >
                  Events
                </Menu.Item>
            <Menu.Item as="a" onClick={() => {this.props.history.push(siteBase + "/onboard"); logClickLogInButton()}}>Log in</Menu.Item>
            <Menu.Item as="a" onClick={() => {this.props.history.push(siteBase + "/onboard"); logClickSignupButton()}}>Sign up</Menu.Item>
          </Sidebar>

          <Sidebar.Pusher dimmed={sidebarOpened} onClick={this.handlePusherClick} style={{ minHeight: '100vh' }}>
            <Segment inverted textAlign="center" style={{ minHeight: 350, padding: '1em 0em' }} vertical>
              <Container>
                <Menu inverted pointing secondary size="large">
                  <Menu.Item onClick={this.handleToggle}>
                    <Icon name="sidebar" />
                  </Menu.Item>
                  <Menu.Item position="right">
                    <Button as="a" inverted onClick={() => {this.props.history.push(siteBase + "/onboard"); logClickLogInButton()}} >Log in</Button>
                    <Button as="a" inverted onClick={() => {this.props.history.push(siteBase + "/onboard"); logClickSignupButton()}} style={{ marginLeft: '0.5em' }}>Sign Up</Button>
                  </Menu.Item>
                </Menu>
              </Container>
              <this.props.Heading mobile={true} />
            </Segment>

            {children}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Responsive>
    );
  }
}

interface ResponsiveContainerProps {
  children?: React.ReactNode;
}

export const ResponsiveContainer = ({ children }: ResponsiveContainerProps) => (
  <React.Fragment>
    <DesktopContainerBuilder children={children}></DesktopContainerBuilder>
    <MobileContainerBuilder children={children}></MobileContainerBuilder>
  </React.Fragment>
);

interface HomeProps {
  imagesPreloaded: boolean;
}

class Homepage extends React.Component<HomeProps & HistoryProps, { 
  committeeNo?: number,
  delegateNo?: number
}> {
  constructor(props: HomeProps & HistoryProps) {
    super(props);
    
    this.state = {};
  }

  buildRenderElements = (files: String[]) => {
    var out:{ render: () => JSX.Element; }[] = [];
    files.forEach((file, idx) => {
      out.push(
        {
          render: () => {
            return <Image
              centered
              bordered
              rounded
              fluid
              size="large"
              src={file}
            />
          }
        });
      }
    );
    return out;
  }

  render() {
    const carusell1Elements = this.buildRenderElements(
      [fgzmun1, fgzmun2, IsarMun22_1, IsarMun22_2, IsarMun22_3]
    )

    return (
      <ResponsiveContainer>
        <Segment style={{ padding: '3em 0em' }} vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column floated="right" width={8}>
                <Image
                  rounded
                  size="massive"
                  src={ "https://fgzmun.ch/wp-content/uploads/2020/01/image001.png" }
                />
              </Grid.Column>
              <Grid.Column width={8}>
                <Header as="h3" style={{ fontSize: '2em' }} id="mun">Model United Nations</Header>
                <p style={{ fontSize: '1.33em' }}>
                Model United Nations (MUN) is a global extracurricular activity at the high school and university level. It is a simulation of the proceedings of the UN organization. Model UN originated in the United States but spread around the world in the mid 1990s due to efforts by US universities.<br/>
                Students convene at conferences, organized by universities or large high schools, and represent chosen member-countries of the United Nations. They simulate the activities of a UN body, so-called committees, by discussing important international issues. Beforehand, they research the country they represent, their committee’s topics, and together they try to ﬁnd a sensible solution from the viewpoint of the country they are representing. For a few days, students become delegates of foreign countries and try to work together on complex issues.<br/>
                Model United Nations offers a great opportunity for students of all ages. They study current international issues, learn how to debate according to formal debate rules and try to come up with solutions to complex issues. At conferences, delegates have to give speeches in support of their solution, they argue with each other and learn how to use rhetoric and persuasion to advance their goals. They get to know the different perspectives of different countries and learn how to bargain and compromise. They make friends from different countries and cultures and many of these friendships are kept well past the end of the conference.
                </p>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={8}>
                <Header as="h3" style={{ fontSize: '2em' }} id="fgzmun">The Model United Nations Club at FGZ</Header>
                <p style={{ fontSize: '1.33em' }}>
                The FGZ Model United Nations Club is a student-run extracurricular organization at Freies Gymnasium Zürich. The Club was 
                founded in 2018 and has attended multiple conferences including 
                <a href="https://zumun.ch/"> ZUMUN</a>,  
                <a href="https://www.imzmun.ch/"> IMZMUN</a>, and 
                <a href="https://pimun.fr/"> PIMUN</a>. We wish to visit more 
                conferences in the future.
                </p>
              </Grid.Column>
              <Grid.Column floated="right" width={8}>
                <Carousel
                elements={carusell1Elements}
                duration={6000}
                animation="horizontal flip"
                showNextPrev={true}
                showIndicators={true}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={6}>
              <Image
                  centered
                  bordered
                  rounded
                  fluid
                  size="large"
                  src={IsarMun22_4}
                />
              </Grid.Column>
              <Grid.Column width={10}>
                <Header as="h3" style={{ fontSize: '2em' }} id="mission">Our Mission</Header>
                <p style={{ fontSize: '1.33em' }}>
                The FGZ MUN Club was founded to prepare for and attend Model UN conferences in Europe. Its purpose is to incentivize the education of students at FGZ on international issues which are usually left out of the standard curriculum. The preparation for conferences teaches students how to research complex topics, write position papers and how to manage your time effectively. Students study foreign countries in depth and learn to understand their perspective. Model UN conferences teach public speaking, writing, debating and networking. Foremost, however, is the understanding of different viewpoints and the ability to ﬁnd compromise and common goals in complex and often diverging situations. In addition, students practice their English or French in a challenging real-world setting. It gives students an opportunity to broaden their perspectives beyond normal school days and meet new people from different countries and cultures. Students gain a new perspective on international issues and begin to understand their individual position in broader, more global context. Our mission is to offer FGZ students an opportunity to educate themselves, practice valuable skills, meet and engage with people of different cultures to solve complex issues in order to strengthen and broaden the horizon of the entire FGZ student body.
                </p>
                <Header as="h3" style={{ fontSize: '2em' }} id="joining">Joining</Header>
                <p style={{ fontSize: '1.33em'}}>
                At MUN conferences you practice public speaking, debating, and leadership. You learn about the challenges our world is 
                currently facing and what we are doing to battle them. By representing another country, you learn about foreign countries, 
                their problems, and cultures in a way that school does not teach us. You learn to understand the different views of the many 
                countries in the international community and this brings us a step closer to understanding the world we live in.
                <br/><br/>
                The FGZ MUN club meets weekly. See our&nbsp;
                <button type="button" className="link-button" onClick={() => this.props.history.push(siteBase + "/events")}>events</button> 
                &nbsp;for more information. Meetings are held in English and in accordance with the&nbsp;
                <button type="button" className="link-button" onClick={() => this.props.history.push(siteBase + "/RoP")}>FGZ MUN Rules of Procedure</button>. 
                If you have any questions, would like more information, or want to join for a tryout-session, please contact the FGZ MUN organizing committee (email: mun@fgz.ch)
                </p>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
              <Header as="h3" style={{ fontSize: '2em' }} id="support">Support</Header>
                <p style={{ fontSize: '1.33em' }}>
                Attending Model UN conferences in Switzerland and the EU bears extensive costs, a great obstacle on the journey to fulﬁll 
                our mission. Being able to cover these costs means to allow the Model United Nations Club at FGZ to be able to offer this 
                invaluable and unique opportunity. Your engagement as a sponsor greatly helps the Model United Nations Club at FGZ to 
                ﬁnance conferences and to directly impact the education of our members and FGZ students as a whole.
                Your support enables young people to engage and participate in ﬁnding solutions of complex international issues and to 
                develop ever more important skills for our common future.
                </p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        {footer}
      </ResponsiveContainer>
    );
  }
};

const RenderHomePage = (props: any) => {
    const imagesPreloaded = useImagePreloader(toPreload);
    return <Homepage imagesPreloaded={imagesPreloaded} history={useHistory()} {...isPropertyAssignment} />;
  };

export default RenderHomePage;