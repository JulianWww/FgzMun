import * as React from 'react';
import {
  Container,
  Grid, Image,
  Header,
  Segment,
} from 'semantic-ui-react';
import { ResponsiveContainer, footer, HistoryProps } from "./Homepage"
import { useHistory } from "react-router-dom";

/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */

function MemberImage(img: string, name: string, func: string) {
    return (
        <Grid.Column className="thirdwidth">
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

export class Board extends React.Component<HistoryProps, { 
  committeeNo?: number,
  delegateNo?: number
}> {
  constructor(props: HistoryProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ResponsiveContainer>
        <Segment style={{ padding: '3em 0em' }} vertical inverted>
          <Grid container stackable verticalAlign="middle" flex>
            <Grid.Row>
              <Grid.Column width={16}>
                <Header className="center aligned"
                    as="h1"
                    content="Board"
                    inverted
                    style={{
                        fontSize:'4em',
                        fontWeight: 'normal',
                    }}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row float>
              {MemberImage(
                    "/members/dylan.png",
                    "Dylan Christensen",
                    "Board Member"
                )}
              {MemberImage(
                    "/members/julia.png",
                    "Julia Cope",
                    "Board Member"
                )}
                {MemberImage(
                    "/members/jv.png",
                    "Jan-Vincent Makowski",
                    "Board Member"
                )}
            </Grid.Row>
            <Grid.Row float>
                {MemberImage(
                    "/members/piere.png",
                    "Pierre Mathier",
                    "Board Member"
                )}
                {MemberImage(
                    "/members/julian.png",
                    "Julian Wandhoven",
                    "IT"
                )}
                {MemberImage(
                    "/members/dewhurst.png",
                    "Jane Dewhurst",
                    "Faculty Correspondent"
                )}
            </Grid.Row>
          </Grid>
        </Segment>
        {footer(this.props.history)}
      </ResponsiveContainer>
    );
  }
}



export class FormerBoard extends React.Component<HistoryProps, { 
  committeeNo?: number,
  delegateNo?: number
}> {
  constructor(props: HistoryProps) {
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
                    content="Former Members"
                    style={{
                        fontSize:'4em',
                        fontWeight: 'normal',
                    }}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row float>
              {MemberImage(
                    "/members/laetitia_planta.jpeg",
                    "Laetitia von Planta",
                    ""
                )}
              {MemberImage(
                    "/members/marius_marthe.jpg",
                    "Marius Marthe",
                    "Founder"
                )}
                {MemberImage(
                    "/members/theodor_babusiaux.jpeg",
                    "Theodor Babusiaux",
                    "IT"
                )}
                
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={16}>
                <Container className="center aligned">
                  Temporary images from: second-renaissance.wikia.com
                </Container>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        {footer(this.props.history)}
      </ResponsiveContainer>
    );
  }
}

export const RenderBoard= (props: any) => {
  return <Board history={useHistory()} {...props} />;
};

export const RenderFormerBoard = (props: any) => {
  return <FormerBoard history={useHistory()} {...props} />;
};
