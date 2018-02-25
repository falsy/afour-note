import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSecret } from '../../actions/secret';
import { NavLink } from 'react-router-dom';
import {APIURL} from '../../constants/config.constant';
import axios from 'axios';
import Styles from '../../scss/views/note';
import classNames from 'classnames/bind';
const cx = classNames.bind(Styles);

class Note extends Component {

  constructor(props) {
    super(props);
    const { dispatch } = this.props;
    dispatch(getSecret());
    this.state = {
      noteName: this.props.match.params.noteName,
      password: this.props.secret.password,
      nowIndex: 0,
      textarea: '',
      textArr: [],
      options: {},
      loading: null
    };
    if(this.props.secret.password === '') {
      return this.props.history.push('/');
    }
    this.changeValue = this.changeValue.bind(this);
    this.submitValue = this.submitValue.bind(this);
    this.changeLoading = this.changeLoading.bind(this);
    this.choiceText = this.choiceText.bind(this);
    this.defaultDataUpdate = this.defaultDataUpdate.bind(this);
    this.addNewTextList = this.addNewTextList.bind(this);
    this.initValue = this.initValue.bind(this);
    this.initValue();
  }

  initValue() {
    setTimeout(() => this.changeLoading(true));
    axios.post(APIURL+'/getSecretNote?noteName='+this.state.noteName, {
      password: this.state.password
      }).then((res) => {
        if(typeof res.data.textArr !== 'undefined') {
          this.updateValue(res.data.textArr);
          this.initNewText(res.data.textArr);
        } else {
          this.changeLoading(false);
          this.initNewText();
        }
      }).catch((err) => {
        console.log('api error : ' + err);
      });
  }

  initNewText(text = []) {
    let updateValue = {};
    updateValue.nowIndex = text.length;
    updateValue.textarea = '';
    updateValue.textArr = this.state.textArr;
    updateValue.textArr.push('');
    this.setState(updateValue);
  }

  changeValue(e) {
    let changeState = {};
    changeState[e.target.name] = e.target.value;
    this.setState(changeState);
  }

  changeLoading(status) {
    let changeLoading = {};
    changeLoading.loading = status;
    this.setState(changeLoading);
  }

  updateValue(val) {
    let updateValue = {};
    updateValue.textArr = val;
    updateValue.newIndex = val.length;
    this.setState(updateValue);
    this.changeLoading(false);
  }

  defaultDataUpdate(submit=false) {
    let defaultValue = {};
    defaultValue.textArr = this.state.textArr;
    if(this.state.textarea === '' && !submit) {
      defaultValue.textArr.splice(this.state.nowIndex, 1);
    } else {
      defaultValue.textArr[this.state.nowIndex] = this.state.textarea;
    }
    this.setState(defaultValue);
  }

  choiceText(i) {
    if(this.state.nowIndex === i) return document.getElementById('textarea').focus();
    this.defaultDataUpdate();

    let updateValue = {};
    updateValue.nowIndex = i;
    updateValue.textarea = this.state.textArr[i];
    this.setState(updateValue);
    document.getElementById('textarea').focus();
  }

  addNewTextList() {
    this.defaultDataUpdate();
    this.initNewText(this.state.textArr);
    document.getElementById('textarea').focus();
  }

  submitValue(e) {
    this.defaultDataUpdate(true);
    this.changeLoading(true);
    axios.put(APIURL+'/updateSecretNote?noteName='+this.state.noteName, {
      password: this.state.password,
      textArr: this.state.textArr,
      options: this.state.options
      }).then((res) => {
        this.changeLoading(false);
      }).catch((err) => {
        console.log('api error : ' + err);
      });
    e.preventDefault();
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className={cx('textarea-position')}>
            <div>
              <form>
                <textarea id="textarea" autoFocus name="textarea" className={cx('textarea')} onChange={this.changeValue} value={this.state.textarea}/>
              </form>
              <div className={cx('text-list')}>
                {this.state.textArr.length ? this.state.textArr.map((text, index) => {
                  return (
                    <div key={index} onClick={this.choiceText.bind(this, index)}>
                      <p>{text.substring(0, 99)}</p>
                    </div>
                  )
                }) : ''}
                {this.state.textArr.length < 5 ?
                <div className={cx('add-text-list')} onClick={this.addNewTextList}>
                  <span>+</span>
                </div>
                : '' }
              </div>
            </div>
          </div>
          <div className={cx('navigation')}>
            <div className={'clearfix'}>
              <p>© <a href="https://falsy.me/" target="_blank">FALSY</a></p>
              <ul className={'clearfix'}>
                <li><button onClick={this.submitValue}>save</button></li>
                <li><NavLink to="/"><button>back</button></NavLink></li>
              </ul>
            </div>
          </div>
        </div>
        <div className={cx('loading-box')}>
          <div className={this.state.loading === null ? '' : this.state.loading ? cx('start') : cx('loading', 'end')}></div>
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

export default connect(mstp)(Note);