import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux'
import store from './store';
import './scss/main.scss';

import Layout from './views/Layout';

class App extends Component {
  
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <Provider store={store}>
        <Layout />
      </Provider>
    );
  } 
}

export default App