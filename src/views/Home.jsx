import React, { Component } from 'react';
import axios from 'axios';

import { APIURL } from '../constants';
import Logo from '../img/afour-logo-big2.png';

import Security from 'mdi-react/SecurityIcon';
import Account from 'mdi-react/AccountCircleIcon';
import DeleteSweep from 'mdi-react/DeleteSweepIcon';

class Home extends Component {

  constructor(props) {
    super(props);
    this.userTokenCheck();

    this.state = {
      id: '',
      password: '',
      loading: null
    };

    this.changeLoading = this.changeLoading.bind(this);
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

  changeLoading(status) {
    let changeLoading = {};
    changeLoading.loading = status;
    this.setState(changeLoading);
  }

  loginReq() {
    const { dispatch } = this.props;
    if(!this.state.id) {
      document.getElementById('id').focus();
    }
    if(!this.state.password) {
      document.getElementById('password').focus();
    }
    this.changeLoading(true);

    axios.post(APIURL+'/login', {
      id: this.state.id,
      pw: this.state.password
    }).then((res) => {
      if(!res.data.error) {
        const token = res.data.token;
        window.localStorage.setItem("token", token);
        window.localStorage.setItem("nowLoginCheck", 'true');
        axios.defaults.headers.common['token'] = token;
        this.props.history.push('/'+this.state.id);
      }
      this.changeLoading(false);
    }).catch((err) => {
      this.changeLoading(false);
    });
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
        <div className={'loading-box'}>
          <div className={this.state.loading === null ? '' : this.state.loading ? 'start' : 'loading', 'end'}></div>
        </div>
        <div className={'navigation'}>
          <div className={'clearfix'}>
            <p>© <a href="https://falsy.me/" target="_blank">FALSY</a></p>
          </div>
        </div>
      </div>
    );
  }
}

export default Home