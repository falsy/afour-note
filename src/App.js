import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './scss/main';

import Home from './views/Home';
import Note from './views/Note';

export default class App extends Component {

  render() {
    return (
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
    );
  }
  
}