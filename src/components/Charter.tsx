import * as React from 'react';
import {
  Container,
  Grid,
  Header,
  Segment,
  Statistic,
} from 'semantic-ui-react';
import Loading from './Loading';
import { DesktopContainer, MobileContainer, footer } from "./Homepage"

interface HomepageHeadingProps {
  mobile: boolean;
}

let charterData = [
  {title: "Participants", data: [
    {title: "Delegates", data: [
      "Represent the interest of their country in discussion (accurate representation is encouraged)",
      "Vote on substantive and procedural matters"
    ]},
    {title: "Chairs", data: [
      "Responsible for moderating the debate and organizing the session"
    ]}
  ]},
  {title:"Platform", data: [
    {title: "Debate", data: [
      "Discussion takes place in our MUN sessions using muncommand.com to lead the session"
    ]},
    {title: "Resolutions and Working Papers", data: [
      "Working papers and Resolutions are written on Google Docs"
    ]},
    {title: "Placards", data: [
      "Placards are distributed at the start of the session"
    ]},
  ]},
  {title: "Modes of Debate", data: [
    {title: "General speakers list", data: [
      "Each speaker has a total time of 2 minutes to speak, before the speakermust end theirspeech",
      "Each speaker follows according to the general speakers list",
      "If a speaker does not use his full 2 minutes theyhaveto yield theirtime",
      "Speakers can yeald their time to: the chair, to questions or to another delegate (This delegate may accept this time or decline it)"
    ]},
    {title: "Moderated Caucus", data: [
      "Delegates speak when recognized by the chair",
      "Time restrictions and topic(s) are determined by the participants before entering the Moderated Caucus",
      "If a speaker doesnot use his entire allocated time,the remaining time will automaticallybeyielded to the chair"
    ]},
    {title: "Unmoderated Caucus ", data: [
      "Delegates can walk around freely in the room",
      "Delegates discuss informally in smaller groups",
      "This is the only time wheredraft resolutions and working papers can be written",
      "Time restrictionsaredetermined by the delegate before entering Unmoderated Caucus"
    ]}
  ]},
  {title: "Points and Motions", data: [
    {title: "Following motions are permitted:", data: [
      "Motion for Moderated Caucus",
      "Motion for Unmoderated Caucus",
      "Motion to introduce a working paper/resolution/amendment",
      "Motion to move into voting procedure",
      "Motion to suspend debate"
    ]},
    {title: "Following points are permitted:", data: [
      "Point ofPersonal Privilege ",
      "Point of Inquiry ",
      "Point of Order",
      "Point of Information"
    ]}
  ]},
  {title: "Voting Procedure", data: [
    {title:"Voting", data:["After a motion to move into voting procedure has passed,all resolutions and possible amendments are voted on."]}
  ]},
  {title: "Miscellaneous ", data: [
    {title: "Roll Call", data: [
      "Each session will be opened with a Roll Call",
      "Delegates answer with “present” or “present and voting”",
      "“present and voting” conveys a binding intention to vote on substantive votes and abstaining is made impossible"
    ]},
    {title: "Right of Reply ", data: [
      "If a delegate feels offended by the content of the other delegates speech during the GSL they can ask for a Right of Reply (RoR). If the chair accepts the reason, the delegate gets to give a 30-second speech to respond to the offense."
    ]}
  ]},
  {title: "Points", data: [
    {title: "Point of inquiry ", data:["If a delegate is unsure of the rules and would like an explanation from the chair."]},
    {title: "Point of personal privilege", data: [
      "When the delegates experience is impacted. Going to the bathroom or turning on the air conditioner are points of personal privilege. Other PoPP are that a delegate can’t hear the speaker or read the projected draft resolution."
    ]},
    {title: "Point of information", data: [
      "Asking another delegate a question about their speech after their speech concludes. This is done during the GSL. POI’s can onlybe asked after a GSL speech of the delegate who finished speaking. POI’s cannot be asked of a delegate who has received yielded time."
    ]},
    {title: "Point of order", data: ["When a delegate believes the Chair has made an error made in the formal procedure."]}
  ]}
]


/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */
const HomepageHeading = ({ mobile }: HomepageHeadingProps) => (
  <Container text>
    <Header
      as="h1"
      content="MUN Rules of Procedure"
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
      content="Rules of procedures for the model United Nations at fgz"
      inverted
      style={{
        fontSize: mobile ? '1.5em' : '1.7em',
        fontWeight: 'normal',
        marginTop: mobile ? '0.5em' : '1.5em',
      }}
    />
    <br />
  </Container>
);

interface ResponsiveContainerProps {
  children?: React.ReactNode;
}

const ResponsiveContainer = ({ children }: ResponsiveContainerProps) => (
  <React.Fragment>
    <DesktopContainer children={children} Heading={HomepageHeading}></DesktopContainer>
    <MobileContainer children={children} Heading={HomepageHeading}></MobileContainer>
  </React.Fragment>
);

export default class Charter extends React.Component<{}, { 
  committeeNo?: number,
  delegateNo?: number
}> {
  constructor(props: {}) {
    super(props);
    this.state = {};
  }


  renderCharterData() {
    let renderCharterDataSubElement = (element: any, idx: number) => {
      let renderCharterDataParagraph = (element: any, subIdx: number) => {
        return <Grid.Row>
                  <Grid.Column width={1}><p style={{ fontSize: '1.33em'}} className={"listindent"}>{idx+1}.{subIdx+1}</p></Grid.Column>
                  <Grid.Column width={15}><p style={{ fontSize: '1.33em'}} className={"listindent"}>{element}</p></Grid.Column>
                </Grid.Row>
      }

      return <Container className={"listindent"}>
          <Header as="h4" style={{ fontSize: '1.5em', marginTop: '10px'}}>{idx+1}. {element["title"]}</Header>
          <Grid>{element["data"].map(renderCharterDataParagraph)}</Grid>
        </Container>
    };

    let renderCharterDataElement = (element: any, key: number) => {
      return <Container>
        <Header as="h2" style={{ fontSize: '3em', textAlign: 'center', marginTop: "10px"}}>{element["title"]}</Header>
        {element["data"].map(renderCharterDataSubElement)}
      </Container>
    }

    return charterData.map(renderCharterDataElement);
  }

  render() {
    ;
    return (
      <ResponsiveContainer>
        <Segment style={{ padding: '3em 0em' }} vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column>
                {this.renderCharterData()}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        {footer}
      </ResponsiveContainer>
    );
  }
}