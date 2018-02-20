import React, { Component } from 'react';
import { connect } from 'react-redux';
import { secret } from '../../actions/secret';
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
      e.target.parentElement.parentElement.nextSibling.click();
    }
  }

  render() {
    return (
      <div className="container">
        <div className={cx('intro')}>
          <div>
            <h1>afour<span>beta</span></h1>
          </div>
          <div>
            <label>
              <span>이름만 쓰면 바로 메모장을 사용할 수 있습니다.</span>
              <input autoFocus type="text" name="noteName" onChange={this.changeValue} onKeyDown={this.keyDown} placeholder="note name *"/>
            </label>
            <label>
              <span>비밀번호까지 쓰면 나만의 메모장으로 사용할 수 있습니다.</span>
              <input type="password" name="password" onChange={this.changeValue} onKeyDown={this.keyDown} placeholder="password"/>
            </label>
          </div>
            { 
              this.props.secret.password ? 
              <NavLink to={`/secret/${this.state.noteName}`}><button>secret enter</button></NavLink>
              : <NavLink to={`/${this.state.noteName}`}><button>enter</button></NavLink> 
            }
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