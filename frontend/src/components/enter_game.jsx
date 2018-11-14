import React from 'react';

class EnterGame extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDemo = this.handleDemo.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.initializeGame(this.state.name, true);
  }

  handleDemo(e) {
    e.preventDefault();
    this.props.initializeGame(this.state.name, false);
  }

  update(prop) {
    return (e) => {
      this.setState({ [prop]: e.target.value });
    }
  }

  render() {
    return (
      <div className="enter-game" >
        <form onSubmit={ this.handleSubmit }>
          <input
            type="text"
            onChange={ this.update("name") }
            value={ this.state.name } />
          <input className="button" type="submit" value="Play" />
        </form>
        <button className="button" onClick={this.handleDemo}>Demo</button>
      </div>
    );
  }
}

export default EnterGame;
