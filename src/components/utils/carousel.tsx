import React from 'react';
import {Card,Transition, Button, Label} from 'semantic-ui-react'
import './carousel.css'

interface Props {
    elements: any,
    duration: number,
    showNextPrev: Boolean,
    showIndicators: Boolean,
    animation? : string
}

interface State {
    currentIndex: number
}

class Carousel extends React.Component<Props, State>{
  interval: NodeJS.Timeout | null;
  constructor(props: Props){
    super(props)
    this.state = {
      currentIndex: 0
    }
    this.interval = null;
  }

  componentDidMount() {
    if(this.props.duration){

      this.interval = setInterval(() => {
        this.nextSlide()   
      }, this.props.duration);
    }
  }
  
  componentWillUnmount() {
    if(this.props.duration && this.interval){
      clearInterval(this.interval);
    }
  }

  /*slideChange() {
    try{
      this.props.onSlideChange(this.state.currentIndex,this.props.elements[this.state.currentIndex])
    }catch(e){}        
  }*/

  nextSlide() {
    this.setState({
      currentIndex: (this.state.currentIndex+1)%this.props.elements.length
    })
    //this.slideChange()
  }

  prevSlide() {
    this.setState({
      currentIndex: ((this.state.currentIndex-1)%this.props.elements.length)<0 ? this.props.elements.length-1 :(this.state.currentIndex-1)%this.props.elements.length
    })
    //this.slideChange()
  }
  gotToSlide(index: number) {
    if(this.props.duration && this.interval){
      clearInterval(this.interval);
    }
    this.setState({
      currentIndex: index
    })
  }
  nextClicked() {
    if(this.props.duration && this.interval){
      clearInterval(this.interval);
    }
    this.nextSlide();
  }
  prevClicked() {
    if(this.props.duration && this.interval){
      clearInterval(this.interval);
    }
    this.prevSlide();
  }
  render(){
    return (
      <Card fluid className='carousel-container' border={false}>
        <Card.Content className='carousel'>
          {
            (this.props.elements).map((element : any, index: number) => {
              if(this.state.currentIndex === index ){
                return (
                  <Transition transitionOnMount={true} visible={true} duration={1000} animation={this.props.animation}>
                    {this.props.elements[index].render()}
                  </Transition>
                )
              }
              return null;
            })
          }    
          <div className='carousel-indicators'>
            {
              (this.props.showIndicators)
              ? (this.props.elements).map((elemnt : any, index: number)=>{
                  if(this.state.currentIndex === index ){
                    return (
                      <Label onClick = {()=> this.gotToSlide(index) } circular color='black' empty  /> 
                    )
                  }else{
                    return (
                      <Label onClick = {()=> this.gotToSlide(index) } circular color='grey' empty  /> 
                    )
                  }
                })
              :null
            }
          </div>  
          {
            (this.props.showNextPrev)?
              <Button className='prev' onClick = {()=>this.prevClicked()} icon='caret left' />
            :null
          }
          {
            (this.props.showNextPrev)?
            <Button className='next' onClick = {()=>this.nextClicked()} icon='caret right' />
            :null
          }
          
        </Card.Content>
      </Card>
    )
  }
}

export default Carousel;
