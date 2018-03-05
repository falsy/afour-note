import React, { Component } from 'react';
import { connect } from 'react-redux';
import { secret, resetSecret } from '../../actions/secret';
import { NavLink } from 'react-router-dom';
import Styles from '../../scss/views/home';
import classNames from 'classnames/bind';
const cx = classNames.bind(Styles);

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      noteName: '',
      password: ''
    };
    this.changeValue = this.changeValue.bind(this);
    this.keyDown = this.keyDown.bind(this);
    this.valueCheck = this.valueCheck.bind(this);

    if(this.props.secret.password) {
      const { dispatch } = this.props;
      dispatch(resetSecret());
    }
  }

  changeValue(e) {
    let changeState = {};
    changeState[e.target.name] = e.target.value;
    this.setState(changeState);
    if(e.target.name === 'password') {
      const { dispatch } = this.props;
      dispatch(secret(e.target.value));
    }
  }

  keyDown(e) {
    if(e.keyCode === 13) {
      if(this.state.password) document.getElementById('submit-btn').click();
      else e.target.focus();
      e.preventDefault();
    }
  }

  valueCheck(e) {
    if(!this.state.password) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  render() {
    return (
      <div className="container">
        <div className={cx('intro')}>
          <div>
            <h1>afour<span>alpha</span></h1>
          </div>
          <div>
            <label>
              <span>note name</span>
              <input autoFocus type="text" name="noteName" onChange={this.changeValue} />
            </label>
            <label>
              <span>password</span>
              <input id="password" type="password" name="password" onChange={this.changeValue} onKeyDown={this.keyDown} />
            </label>
          </div>
          <NavLink id="submit-btn" to={`/${this.state.noteName}`}><button onClick={this.valueCheck}>enter</button></NavLink>
        </div>
      </div>
    )
  }
}

const mstp = (state) => {
  return {
    secret : state.secret
  };
}

export default connect(mstp)(Home);