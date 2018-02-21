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
      textarea: '',
      loading: null
    };
    if(this.props.secret.password === '') {
      return this.props.history.push('/');
    }
    this.changeValue = this.changeValue.bind(this);
    this.submitValue = this.submitValue.bind(this);
    this.changeLoading = this.changeLoading.bind(this);
    this.initValue = this.initValue.bind(this);
    this.initValue();
  }

  initValue() {
    setTimeout(() => this.changeLoading(true));
    axios.get(APIURL+'/getNoteText?noteName='+this.state.noteName+'&password='+this.state.password
      ).then((res) => {
        if(typeof res.data.text !== 'undefined') this.updateValue(res.data.text);
        else this.changeLoading(false);
      }).catch((err) => {
        console.log('api error : ' + err);
      });
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
    if(status === false) {
      setTimeout(() => {
        changeLoading.loading = null;
        this.setState(changeLoading);
      }, 600);
    }
  }

  updateValue(val) {
    let updateValue = {};
    updateValue.textarea = val;
    this.setState(updateValue);
    this.changeLoading(false);
  }

  submitValue(e) {
    this.changeLoading(true);
    axios.put(APIURL+'/updateNoteText?noteName='+this.state.noteName, {
      password: this.state.password,
      textVal: this.state.textarea
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
                <textarea autoFocus name="textarea" className={cx('textarea')} onChange={this.changeValue} value={this.state.textarea}/>
              </form>
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
          <div className={this.state.loading === null ? cx('wait') : this.state.loading ? cx('wait', 'start') : cx('wait', 'loading', 'end')}></div>
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