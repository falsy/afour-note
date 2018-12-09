import React, { Component } from 'react';
import { connect } from 'react-redux';
import Logo from '../img/afour-logo-big2.png';
import Security from 'mdi-react/SecurityIcon';
import Account from 'mdi-react/AccountCircleIcon';
import DeleteSweep from 'mdi-react/DeleteSweepIcon';
import { loadingStart } from '../actions/progress';
import { login } from '../actions/login';

class Home extends Component {

  constructor(props) {
    super(props);
    this.userTokenCheck();

    this.state = {
      id: '',
      password: ''
    };

    this.changeValue = this.changeValue.bind(this);
    this.keyDown = this.keyDown.bind(this);
    this.loginReq = this.loginReq.bind(this);
  }

  userTokenCheck() {
    if(window.localStorage.getItem("token")) {
      const id = window.localStorage.getItem("token").split('.')[0];
      return this.props.history.push('/'+id);
    }
  }

  changeValue(e) {
    let changeState = {};
    changeState[e.target.name] = e.target.value;
    this.setState(changeState);
  }

  keyDown(e) {
    if(e.keyCode === 13) {
      if(this.state.password) this.loginReq();
      else e.target.focus();
      e.preventDefault();
    }
  }

  loginReq() {
    if(!this.state.id) return document.getElementById('id').focus();
    if(!this.state.password) return document.getElementById('password').focus();

    const { dispatch, history } = this.props;
    dispatch(loadingStart());
    login(this.state.id, this.state.password, history);
  }

  render() {
    return (
      <div className="intro-wrap">
        <div className="align-box">
          <div className="logo">
            <img src={Logo} width="280" alt="logo" />
            <p>If you remember only the name and password of the note,<br />
  you can remember it anywhere on the Internet.</p>
          </div>
          <div className={'container', 'intro-container'}>
            <div className={'intro'}>
              <div>
                <label>
                  <span>name</span>
                  <input autoFocus id="id" type="text" name="id" onChange={this.changeValue} />
                </label>
                <label>
                  <span>password</span>
                  <input id="password" type="password" name="password" onChange={this.changeValue} onKeyDown={this.keyDown} />
                </label>
              </div>
              <button onClick={this.loginReq}>ENTER</button>
            </div>
          </div>
        </div>
        <div className={'navigation'}>
          <div className={'clearfix'}>
            <p>© <a href="https://lab.falsy.me/" target="_blank">FALSY</a></p>
          </div>
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

export default connect(mstp)(Home)