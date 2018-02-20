import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './store';
import './scss/app';

import Home from './views/Home';
import Note from './views/Note';
import PrivateNote from './views/PrivateNote';

export default class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <div className="content">
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/:noteName" component={Note} />
                <Route exact path="/secret/:noteName" component={PrivateNote} />
              </Switch>
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
  
}