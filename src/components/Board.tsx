import * as React from 'react';
import {
  Container,
  Grid, Image,
  Header,
  Segment,
} from 'semantic-ui-react';
import { ResponsiveContainer, footer, HistoryProps } from "./Homepage"
import { useHistory } from "react-router-dom";
import AsyncImage from "./utils/AsyncImage"
import { JsxElement } from 'typescript';

/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */

function AsyncMemberImage(images: string[], name: string, func: string, tagProvide: (AsyncImage: JSX.Element)=> JSX.Element) {
  return (
    <Grid.Column className="thirdwidth">
      <Container className="center aligned">
        {tagProvide(<AsyncImage circular images={images} size="large"/>)}
        <div>
          {name}<br/>
          {func}
        </div>
      </Container>
    </Grid.Column>
  );
}

function MemberImage(images: string[], name: string, func: string) {
  const tagProvider = (tag: JSX.Element) => {return tag;};
  return AsyncMemberImage(images, name, func, tagProvider);
}

function MemberImage_wURL(images: string[], name: string, func: string, url: string) {
  const tagProvider = (tag: JSX.Element) => {
    return (
      <a href={url}>
        {tag}
      </a>
      );
    }
  return AsyncMemberImage(images, name, func, tagProvider);
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
                    [
                      "/members/40x60/dylan.png",
                      "/members/400x600/dylan.png",
                      "/members/3840x5760/dylan.png"
                    ],
                    "Dylan Christensen",
                    "Board Member"
                )}
              {MemberImage(
                    [
                      "/members/40x60/julia.png",
                      "/members/400x600/julia.png",
                      "/members/3840x5760/julia.png"
                    ],
                    "Julia Cope",
                    "Board Member"
                )}
                {MemberImage(
                    [
                      "/members/40x60/jv.png",
                      "/members/400x600/jv.png",
                      "/members/3840x5760/jv.png"
                    ],
                    "Jan-Vincent Makowski",
                    "Board Member"
                )}
            </Grid.Row>
            <Grid.Row float>
                {MemberImage(
                    [
                      "/members/40x60/piere.png",
                      "/members/400x600/piere.png",
                      "/members/3840x5760/piere.png"
                    ],
                    "Pierre Mathier",
                    "Board Member"
                )}
                {MemberImage(
                    [
                      "/members/40x60/julian.png",
                      "/members/400x600/julian.png",
                      "/members/3840x5760/julian.png"
                    ],
                    "Julian Wandhoven",
                    "IT"
                )}
                {MemberImage(
                    [
                      "/members/40x60/dewhurst.png",
                      "/members/400x600/dewhurst.png",
                      "/members/3840x5760/dewhurst.png"
                    ],
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
        <Segment style={{ padding: '3em 0em' }} vertical inverted>
          <Grid container stackable verticalAlign="middle" flex>
            <Grid.Row>
              <Grid.Column width={16}>
                <Header className="center aligned"
                    as="h1"
                    inverted
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
                    [
                      "/members/40x60/laetitia_planta.jpeg"
                    ],
                    "Laetitia von Planta",
                    ""
                )}
              {MemberImage(
                    [
                      "/members/40x60/marius_marthe.jpg",
                      "/members/40x60/laetitia_planta.jpeg"
                    ],
                    "Marius Marthe",
                    "Founder"
                )}
                {MemberImage_wURL(
                    [
                      "/members/40x40/theodor.png",
                      "/members/1000x1000/theodor.png"
                    ],
                    "Theodor Babusiaux",
                    "IT",
                    "https://www.instagram.com/p/BxJ7vwlFUMS/"
                )}
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
