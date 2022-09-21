import * as React from 'react';
import {
  Container,
  Card, Message,
  Header, Grid,
  Segment,
  List
} from 'semantic-ui-react';
import { DesktopContainer, MobileContainer, footer } from "./Homepage"
import Loading from "./Loading"
import { database } from "../App"
import firebase from 'firebase';

interface HomepageHeadingProps {
  mobile: boolean;
}

/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */
const HomepageHeading = ({ mobile }: HomepageHeadingProps) => (
  <Container text>
    <Header
      as="h1"
      content="Events"
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
      content="Events hosted by the MUN club"
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

export default class Events extends React.Component<{}, { 
  committeeNo?: number,
  delegateNo?: number,
  events: any
}> {
  constructor(props: {}) {
    super(props);
    this.state = {
        events: null
    };
  }
  
  async loadEvents() {
    const snapshot = await database.collection('events').get();
    snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
    });
    this.setState({ events: snapshot })
  }

  dayToText = (day: number) => {
    switch (day) {
        case 1 :
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        case 6:
            return "Saturday";
        case 0:
            return "Sunday";
        default:
            return "custom Ex: Invalid Day of the Week " + day.toString();
            
    }
  }

  MonthToText = (month: number) => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[month];
  }

  padNumber(num: number, size: number) {
    let num_s = num.toString();
    while (num_s.length < size) num_s = "0" + num;
    return num_s;
  }

  getTimezoneName() {
    const today = new Date();
    const short = today.toLocaleDateString(undefined);
    const full = today.toLocaleDateString(undefined, { timeZoneName: 'long' });
  
    // Trying to remove date from the string in a locale-agnostic way
    const shortIndex = full.indexOf(short);
    if (shortIndex >= 0) {
      const trimmed = full.substring(0, shortIndex) + full.substring(shortIndex + short.length);
      
      // by this time `trimmed` should be the timezone's name with some punctuation -
      // trim it from both sides
      return trimmed.replace(/^[\s,.\-:;]+|[\s,.\-:;]+$/g, '');
  
    } else {
      // in some magic case when short representation of date is not present in the long one, just return the long one as a fallback, since it should contain the timezone's name
      return full;
    }
  }

  renderEvent = (data: firebase.firestore.DocumentData, key: string) => {
    const date_from: Date = data["time_from"].toDate();
    const date_to: Date = data["time_to"].toDate();
    console.log(data)
    return (
        <Grid.Row width={16}>
            <Grid.Column>
                <Card key={key} fluid>
                    <Card.Header as="h1" textAlign="center">
                        {data["name"]}
                    </Card.Header>
                    <Card.Content>
                        {data["text"]}
                    </Card.Content>
                    <Card.Content>
                        <List>
                            <List.Item>
                                <List.Header as="h5">
                                    Ort:
                                </List.Header>
                                <List.Description className="tab">
                                    {data["location"]}
                                </List.Description>
                            </List.Item>
                            <List.Item>
                                <List.Header as="h5">
                                    Zeiten:
                                </List.Header>
                                <List.Description className="tab">
                                  <b>Begin:</b>
                                  <div className="tab">
                                    {
                                              this.dayToText(date_from.getDay())
                                      + " "  + this.MonthToText(date_from.getMonth())
                                      + " "  + date_from.getDate()
                                      + " "  + date_from.getFullYear()
                                      + " "  + this.padNumber(date_from.getHours(), 2)
                                      + ":"  + this.padNumber(date_from.getMinutes(), 2)
                                      //+ " (" + this.getTimezoneName() + ")"
                                    }
                                  </div>
                                  <b>End:</b>
                                  <div className="tab">
                                    {
                                              this.dayToText(date_to.getDay())
                                      + " "  + this.MonthToText(date_to.getMonth())
                                      + " "  + date_to.getDate()
                                      + " "  + date_to.getFullYear()
                                      + " "  + this.padNumber(date_to.getHours(), 2)
                                      + ":"  + this.padNumber(date_to.getMinutes(), 2)
                                      //+ " (" + this.getTimezoneName() + ")"
                                    }
                                  </div>
                                </List.Description>
                            </List.Item>
                            <List.Item>
                              <List.Header as="h5">
                                Sprecher
                              </List.Header>
                              <List.Description className="tab">
                                {data["speaker"]}
                              </List.Description>
                            </List.Item>
                        </List>
                    </Card.Content>
                </Card>
            </Grid.Column>
        </Grid.Row>
    )
  }
  
  renderEvents = () => {
    if (this.state.events.size) {
        let data: firebase.firestore.DocumentData[] = [];
        this.state.events.forEach((doc: any) => {
            data.push(doc.data())
        });
        return (
            Object.keys(data).map((key: string) => {
                return this.renderEvent(data[key as unknown as number], key)
            })
        );
    }
    return (
        <Grid.Row width={16}>
            <Grid.Column>
                <Message>
                    <Message.Header>
                        No Events sceduled
                    </Message.Header>
                    <Message.Content>
                        There are currently no events sceduled. We appolagize
                    </Message.Content>
                </Message>
            </Grid.Column>
        </Grid.Row>
    )
  }

  render() {
    if (this.state.events === null) {
        this.loadEvents();
    }
    return (
      <ResponsiveContainer>
        <Segment style={{ padding: '3em 0em' }} vertical>
            <Grid container stackable verticalAlign="middle" flex>
                {this.state.events === null ? <Loading/>: this.renderEvents()}
            </Grid>
        </Segment>
        {footer}
      </ResponsiveContainer>
    );
  }
}