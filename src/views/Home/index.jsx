import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setToken } from '../../actions/secret';
import { APIURL } from '../../constants/config.constant';
import axios from 'axios';

import Styles from '../../scss/views/home';
import classNames from 'classnames/bind';
const cx = classNames.bind(Styles);

import Logo from '../../img/afour-logo-big.png';

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
    if(!this.state.id) document.getElementById('id').focus();
    if(!this.state.password) document.getElementById('password').focus();
    this.changeLoading(true);
    axios.post(APIURL+'/login', {
      id: this.state.id, 
      pw: this.state.password
    }).then((res) => {
      if(!res.data.error) {
        dispatch(setToken(res.data.token));
        this.props.history.push('/'+this.state.id);
      }
      this.changeLoading(false);
    }).catch((err) => {
      console.log('login api error : ' + err);
      this.changeLoading(false);
    });
  }

  render() {
    return (
      <div>
        <div className={cx('logo')}>
          <img src={Logo} width="214" alt="logo" />
          <h1>Safe and easy Web Notes</h1>
        </div>
        <div className={cx('container', 'intro-container')}>
          <div className={cx('intro-content', 'clearfix')}>
            <div className={cx('strong-point')}>
              <ul>
                <li className={cx('clearfix')}>
                  <div><Account /></div>
                  <p>No personal information is asked</p>
                </li>
                <li className={cx('clearfix')}>
                  <div><Security /></div>
                  <p>All content is stored encrypted</p>
                </li>
                <li className={cx('clearfix')}>
                  <div><DeleteSweep /></div>
                  <p>The changed past will not be saved</p>
                </li>
              </ul>
            </div>
            <div className={cx('intro')}>
              <div>
                <label>
                  <span>Name</span>
                  <input autoFocus id="id" type="text" name="id" onChange={this.changeValue} />
                </label>
                <label>
                  <span>Password</span>
                  <input id="password" type="password" name="password" onChange={this.changeValue} onKeyDown={this.keyDown} />
                </label>
              </div>
              <button onClick={this.loginReq}>enter</button>
            </div>
          </div>
        </div>
        <div className={cx('loading-box')}>
          <div className={this.state.loading === null ? '' : this.state.loading ? cx('start') : cx('loading', 'end')}></div>
        </div>
        <div className={cx('navigation')}>
          <div className={'clearfix'}>
            <p>© <a href="https://falsy.me/" target="_blank">FALSY</a></p>
          </div>
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