import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setToken } from '../../actions/secret';
import { APIURL } from '../../constants/config.constant';
import axios from 'axios';

import Styles from '../../scss/views/home';
import classNames from 'classnames/bind';
const cx = classNames.bind(Styles);

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
    const { dispatch } = this.props;
    if(!this.state.id) document.getElementById('id').focus();
    if(!this.state.password) document.getElementById('password').focus();

    axios.post(APIURL+'/login', {
      id: this.state.id, 
      pw: this.state.password
    }).then((res) => {
      if(!res.data.error) {
        dispatch(setToken(res.data.token));
        this.props.history.push('/'+this.state.id);
      }
    }).catch((err) => {
      console.log('login api error : ' + err);
    });
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className={cx('intro')}>
            <div>
              <label>
                <span>id</span>
                <input autoFocus id="id" type="text" name="id" onChange={this.changeValue} />
              </label>
              <label>
                <span>password</span>
                <input id="password" type="password" name="password" onChange={this.changeValue} onKeyDown={this.keyDown} />
              </label>
            </div>
            <button onClick={this.loginReq}>enter</button>
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