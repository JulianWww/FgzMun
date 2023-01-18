import React, { SyntheticEvent } from 'react';
import {
  ImageProps,
  Image as IMG
} from 'semantic-ui-react';
import {upgradeImageRes} from "./utils";

var id = 0;

export interface AsyncImageProps extends ImageProps {
  images: string[]
} 

interface AsyncImageState {
  current: number,
  id: string
}

export default class AsyncImage extends React.Component<AsyncImageProps, AsyncImageState>{
  constructor(props: AsyncImageProps) {
    super(props);

    this.state = {
      current: 0,
      id: "asyncImage" + id.toString()
    }

    id++;

    this.loadNext();
  }

  async loadNext() {
    console.log("loaded");
    if (this.props.images.length > this.state.current+1) {
      let img = new Image();
      img.onload = () => {
        this.setState({current: this.state.current+1})
        this.loadNext();
      }
      img.src = this.props.images[this.state.current+1]
    }
  }

  render() {
    const img = <IMG src={this.props.images[this.state.current]} {...this.props}/>
    return img;
  }
}