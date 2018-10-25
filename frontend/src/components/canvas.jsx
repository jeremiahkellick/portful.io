import React from 'react'; 
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../game/util'; 

class Canvas extends React.Component {

  constructor(props) {
    super(props); 
    this.state = {
      width: CANVAS_WIDTH, 
      height: CANVAS_HEIGHT
    }
  }

  componentDidMount() {
    window.addEventListener("resize", (e) => {
      e.preventDefault(); 
      this.setState({
        width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
      }); 
    }); 
  }

  resize() {

  }

  render() {
    return (
      <canvas
        id="canvas"
        width={`${this.state.width}px`}
        height={`${this.state.height}px`}>
      </canvas>
    ); 
  }
}

export default Canvas; 