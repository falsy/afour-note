import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import ReactDOM from 'react-dom';

class Iframe extends Component {
  
  constructor(props) {
    super(props);
  }

  render() {
    return <iframe ref="iframe" {...this.props}/>;
  }
}

export default Iframe;