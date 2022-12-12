import * as React from 'react';
import {
  Card,
  Message, 
  Header,
  Grid,
  Segment,
  List,
  Button,
  Icon,
  Input,
  InputOnChangeData
} from 'semantic-ui-react';
import { ResponsiveContainer, footer } from "../Homepage"
import firebase from 'firebase/app';
import { AdminUUIDS } from "../../constants"
import ReactQuill from 'react-quill';
import * as Quill from "quill";
import Loading from "../Loading"
import 'react-quill/dist/quill.snow.css';

interface EventData {
  heading?: string;
  text?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
}

export default class Events extends React.Component<{}, { 
  committeeNo?: number,
  delegateNo?: number,
  events?: Record<string, EventData>;
  eventsFref: firebase.database.Reference,
  user?: firebase.User | null,
  toAdd: EventData,
  editorOpen: boolean;
  gotFirebaseFeedback: boolean
  editingEvent?: string;
  authUnsubscribe?: () => void
}> {
  constructor(props: {}) {
    super(props);
    this.state = {
        eventsFref: firebase.database().ref("events"),
        toAdd : {},
        gotFirebaseFeedback: false,
        editorOpen: false
    };
  }

  firebaseCallback = (events: firebase.database.DataSnapshot | null) => {
    if (events) {
      this.setState({ events: events.val(), gotFirebaseFeedback: true });
    }
  }

  authStateChangedCallback = (user: firebase.User | null) => {
    this.setState({ user: user });
  }

  componentDidMount() {
    this.state.eventsFref.on('value', this.firebaseCallback);

    const authUnsubscribe = firebase.auth().onAuthStateChanged(
      this.authStateChangedCallback,
    );

    this.setState({ authUnsubscribe });
  }

  componentWillUnmount() {
    this.state.eventsFref.off('value', this.firebaseCallback);

    if (this.state.authUnsubscribe) {
      this.state.authUnsubscribe();
    }
  }

  renderEvent = (data: EventData | undefined, key: string, edit = false) => {
    if (data) {
    return (
        <Grid.Row width={16}>
            <Grid.Column>
                <Card key={key} fluid>
                    <Card.Header as="h1" textAlign="center" flex-grow>
                        { edit ? 
                        <Input
                          className="full-width"
                          defaultValue={this.state.toAdd.heading}
                          onChange={this.editHeading}
                        />
                        :
                        data.heading
                        }
                        {!edit && this.renderDeleter(key)}
                    </Card.Header>
                    <Card.Content content={edit ? 
                      <ReactQuill
                        theme="snow"
                        defaultValue={this.state.toAdd.text}
                        onChange={this.editText}
                      />
                      :
                      data.text && <div dangerouslySetInnerHTML={{__html: data.text}}/>}/>
                    <Card.Content>
                        <List>
                            <List.Item>
                                <List.Header as="h5">
                                    Location:
                                </List.Header>
                                <List.Description className="tab">
                                    {edit ?
                                    <Input
                                      className="full-width"
                                      defaultValue={data.location}
                                      onChange={this.editLocation}
                                    />
                                    :
                                    data.location
                                    }
                                </List.Description>
                            </List.Item>
                            <List.Item>
                                <List.Header as="h5">
                                    Times:
                                </List.Header>
                                <List.Description className="tab">
                                  <b>from:</b>
                                  <div className="tab">
                                    {edit ?
                                      <Input
                                        className="full-width"
                                        defaultValue={data.startTime}
                                        onChange={this.editFrom}
                                      />
                                      :
                                      data.startTime
                                    }
                                  </div>
                                  <b>to:</b>
                                  <div className="tab">
                                    {edit ?
                                      <Input
                                        className="full-width"
                                        defaultValue={data.endTime}
                                        onChange={this.editTo}
                                      />
                                      :
                                      data.endTime
                                    }
                                  </div>
                                </List.Description>
                            </List.Item>
                        </List>
                        {edit && 
                          <Button.Group floated='right'>
                            <Button onClick={this.closeEditor}>
                              Cancel
                            </Button>
                            <Button.Or/>
                            <Button primary onClick={this.publishEvent}>
                              Publish
                            </Button>
                          </Button.Group>
                        }
                    </Card.Content>
                </Card>
            </Grid.Column>
        </Grid.Row>
    )
  };
  }
  
  renderEvents = () => {
    if (this.state.events) {
        const events = this.state.events;
        return (
            Object.keys(this.state.events).map(key => {
              return this.renderEvent(events[key], key);
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

  renderAdder = () => {
    if (this.isAdmin()) {
      return (
        <Grid.Row>
          <Grid.Column width={16}>
            <Button.Group floated='right' onClick={this.addNewEventEditor}>
              <Button
              primary
              >
                Add Event
              </Button>
            </Button.Group>
          </Grid.Column>
        </Grid.Row>
      );
    }
  }

  isAdmin = () => {
    const user = firebase.auth().currentUser;
    return (user && AdminUUIDS.includes(user.uid))
  }

  renderDeleter = (key: string) => {
    if (this.isAdmin()) {
      return (
        <Button.Group floated='right'>
          <Button
            primary
            onClick={this.editEvent(key)}
          >
            <Icon fitted name="pencil alternate" />
          </Button>
          <Button
            color="red"
            onClick={this.deleteEvent(key)}
          >
            <Icon fitted name="trash alternate outline" />
          </Button>
        </Button.Group>
      );
    }
  }

  renderNewEditor = () => {
    return this.state.editorOpen && this.renderEvent(this.state.toAdd, "new", true);
  }

  deleteEvent = (key: string) => {
    return () => {
      this.state.eventsFref.child(key).remove();
    }
  }

  editEvent = (key: string) => {
    return () => {
      if (this.state.events) {
        const event = {...this.state.events[key]};
        console.log("editing");
        console.log(event);
        this.setState({
          toAdd: event,
          editorOpen: true, 
          editingEvent: key
        });
      }
    }
  }

  addNewEventEditor = () => {
    this.setState({editorOpen: true})
  }

  editHeading = (event: React.SyntheticEvent<HTMLInputElement>, data: InputOnChangeData): void => {
    let val = this.state.toAdd;
    val.heading = data.value;
    this.setState({ toAdd: val})
  }

  editLocation = (event: React.SyntheticEvent<HTMLInputElement>, data: InputOnChangeData): void => {
    let val = this.state.toAdd;
    val.location = data.value;
    this.setState({ toAdd: val})
  }

  editFrom = (event: React.SyntheticEvent<HTMLInputElement>, data: InputOnChangeData): void => {
    let val = this.state.toAdd;
    val.startTime = data.value;
    this.setState({ toAdd: val})
  }

  editTo = (event: React.SyntheticEvent<HTMLInputElement>, data: InputOnChangeData): void => {
    let val = this.state.toAdd;
    val.endTime = data.value;
    this.setState({ toAdd: val})
  }

  editText = (content: string, delta: Quill.Delta, source: Quill.Sources, editor: any
  ) => {
    console.log(content)
    let val = this.state.toAdd;
    val.text = content;
    this.setState({ toAdd: val})
  }

  publishEvent = () => {
    this.state.eventsFref.push().set((this.state.toAdd as EventData));
    if (this.state.editingEvent) {
      this.state.eventsFref.child(this.state.editingEvent).remove();

    }
    this.closeEditor();
  }

  closeEditor = () => {
    this.setState({editorOpen: false, editingEvent: undefined});
  }

  render() {
    console.log(this.state.toAdd)
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
                {this.state.gotFirebaseFeedback ? 
                this.renderEvents() : 
                <Grid.Row>
                  <Grid.Column width={16}>
                    <Loading/>
                  </Grid.Column>
                </Grid.Row>
                }
                {this.renderAdder()}
                {this.renderNewEditor()}
            </Grid>
        </Segment>
        {footer}
      </ResponsiveContainer>
    );
  }
}