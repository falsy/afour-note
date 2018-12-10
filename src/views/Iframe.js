import React, { Component } from 'react';

class Iframe extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return <iframe ref="myIframe" src={''} id={'edit-area'} className={'text-editor-area'} />;
  }
}

export default Iframe;