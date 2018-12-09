import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import Note from './Note';

class Layout extends Component {
  
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
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
        <div className={'loading-box'}>
          <div className={this.props.progress.loading === null ? '' : this.props.progress.loading ? 'start' : 'end'}></div>
        </div>
      </div>
    );
  } 
}

const mstp = (state) => {
  return {
    progress: state.progress
  };
};

export default connect(mstp)(Layout)