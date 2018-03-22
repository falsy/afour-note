import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './store';
import './scss/app';

import Home from './views/Home';
import Note from './views/Note';

export default class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <div className="content">
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/:id" component={Note} />
              </Switch>
            </div>
          </div>
        </Router>
      </Provider>
    );
  }

}