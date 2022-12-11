import * as React from 'react';
import {
  Card, Message,
  Header, Grid,
  Segment,
  List
} from 'semantic-ui-react';
import { ResponsiveContainer, footer } from "./Homepage"
import Loading from "./Loading"
import { database } from "../App"
import firebase from 'firebase';

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

  renderEvent = (data: firebase.firestore.DocumentData, key: string) => {
    const txt = (data["text"] as string);
    return (
        <Grid.Row width={16}>
            <Grid.Column>
                <Card key={key} fluid>
                    <Card.Header as="h1" textAlign="center">
                        {data["name"]}
                    </Card.Header>
                    <Card.Content content={<div dangerouslySetInnerHTML={{__html: txt}}/>}/>
                    <Card.Content>
                        <List>
                            <List.Item>
                                <List.Header as="h5">
                                    Location:
                                </List.Header>
                                <List.Description className="tab">
                                    {data["location"]}
                                </List.Description>
                            </List.Item>
                            <List.Item>
                                <List.Header as="h5">
                                    Times:
                                </List.Header>
                                <List.Description className="tab">
                                  <b>from:</b>
                                  <div className="tab">
                                    {
                                      data["time_from"]
                                    }
                                  </div>
                                  <b>to:</b>
                                  <div className="tab">
                                    {
                                      data["time_to"]
                                    }
                                  </div>
                                </List.Description>
                            </List.Item>
                            {data["speaker"] &&
                              <List.Item>
                                <List.Header as="h5">
                                  Speakers
                                </List.Header>
                                <List.Description className="tab">
                                  {data["speaker"]}
                                </List.Description>
                              </List.Item>
                            }
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
              <Grid.Row>
                <Grid.Column width={16}>
                <Header className="center aligned"
                    as="h1"
                    content="Events"
                    style={{
                        fontSize:'4em',
                        fontWeight: 'normal',
                    }}
                />
                </Grid.Column>
              </Grid.Row>
                {this.state.events === null ? <Loading/>: this.renderEvents()}
            </Grid>
        </Segment>
        {footer}
      </ResponsiveContainer>
    );
  }
}