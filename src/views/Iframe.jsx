import React, { Component } from 'react';

class Iframe extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return <iframe ref="iframe" {...this.props}/>;
  }
}

export default Iframe;