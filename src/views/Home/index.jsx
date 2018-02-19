import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Styles from '../../scss/views/home';
import classNames from 'classnames/bind';
const cx = classNames.bind(Styles);

export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      noteName: ''
    };
    this.changeValue = this.changeValue.bind(this);
    this.keyDown = this.keyDown.bind(this);
  }

  changeValue(e) {
    let changeState = {};
    changeState[e.target.name] = e.target.value;
    this.setState(changeState);
  }

  keyDown(e) {
    if(e.keyCode === 13) {
      e.target.parentElement.nextSibling.click();
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
            <span>note name</span>
            <input autoFocus type="text" name="noteName" onChange={this.changeValue} onKeyDown={this.keyDown} />
            </label>
            <NavLink to={`/${this.state.noteName}`}><button>enter</button></NavLink>
          </div>
        </div>
      </div>
    )
  }
}