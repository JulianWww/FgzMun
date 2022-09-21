import * as React from 'react';
import {
  Container,
  Grid, Image,
  Header,
  Segment,
} from 'semantic-ui-react';
import { DesktopContainer, MobileContainer, footer } from "./Homepage"
import { PublicBase } from "../data"

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
      content="Team"
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
      content="The FGZ MUN Club"
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

function MemberImage(img: string, name: string, func: string) {
    return (
        <Grid.Column width={4}>
            <Container className="center aligned">
                <Image circular src={img} size="large"/>
                <div>
                    {name}<br/>
                    {func}
                </div>
            </Container>
        </Grid.Column>
    );
}

const ResponsiveContainer = ({ children }: ResponsiveContainerProps) => (
  <React.Fragment>
    <DesktopContainer children={children} Heading={HomepageHeading}></DesktopContainer>
    <MobileContainer children={children} Heading={HomepageHeading}></MobileContainer>
  </React.Fragment>
);

export default class Board extends React.Component<{}, { 
  committeeNo?: number,
  delegateNo?: number
}> {
  constructor(props: {}) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ResponsiveContainer>
        <Segment style={{ padding: '3em 0em' }} vertical>
          <Grid container stackable verticalAlign="middle" flex>
            <Grid.Row>
              <Grid.Column width={16}>
                <Header className="center aligned"
                    as="h1"
                    content="Title"
                    style={{
                        fontSize:'4em',
                        fontWeight: 'normal',
                    }}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row float>
              {MemberImage(
                    PublicBase + "/blankPerson.png",
                    "Dylan Christensen",
                    "President"
                )}
              {MemberImage(
                    PublicBase + "/blankPerson.png",
                    "Julia Cope",
                    "Vice President"
                )}
                {MemberImage(
                    PublicBase + "/blankPerson.png",
                    "Jan-Vincent Makowski",
                    "Marketing"
                )}
                {MemberImage(
                    PublicBase + "/blankPerson.png",
                    "Pierre Mathier",
                    "Marketing"
                )}
            </Grid.Row>
            <Grid.Row float>
                {MemberImage(
                    PublicBase + "/blankPerson.png",
                    "Julian Wandhoven",
                    "IT"
                )}
                {MemberImage(
                    PublicBase + "/blankPerson.png",
                    "Christopher Haranov",
                    "IT"
                )}
                {MemberImage(
                    PublicBase + "/blankPerson.png",
                    "Marius Ungricht",
                    "IT"
                )}
                {MemberImage(
                    PublicBase + "/blankPerson.png",
                    "Jane Dewhurst",
                    "Faculty Correspondant"
                )}
            </Grid.Row>
          </Grid>
        </Segment>
        {footer}
      </ResponsiveContainer>
    );
  }
}