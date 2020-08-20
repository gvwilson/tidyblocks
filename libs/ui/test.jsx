import React, { Component } from 'react';
import ReactBlocklyComponent from 'react-blockly'

const doIncrement = (prevState) => ({
  counter: prevState.counter + 1,
});

const doDecrement = (prevState) => ({
  counter: prevState.counter - 1,
});

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){

  }

  onIncrement() {
    this.setState(doIncrement);
  }

  onDecrement() {
    this.setState(doDecrement);
  }

  render() {
    return(
      <div>
      </div>
    )
  }
}

export default App;
