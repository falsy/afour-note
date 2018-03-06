import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSecret } from '../../actions/secret';
import { NavLink } from 'react-router-dom';
import {APIURL} from '../../constants/config.constant';
import Header from '../Header';
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
      nowIndex: [0, 0],
      textarea: '',
      textDataGroup: ['default'],
      textDataMemo: [['']],
      options: {},
      addGroupMode: false,
      addGroupName: '',
      loading: null,
      checkDataChange: {
        groups: '',
        memos: ''
      }
    };
    if(this.props.secret.password === '') {
      return this.props.history.push('/');
    }
    this.addGroupValue = this.addGroupValue.bind(this);
    this.insertNewGroup = this.insertNewGroup.bind(this);
    this.cancelInsertGroup = this.cancelInsertGroup.bind(this);
    this.insertNewMemo = this.insertNewMemo.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.changeLoading = this.changeLoading.bind(this);
    this.choiceText = this.choiceText.bind(this);
    this.initValue = this.initValue.bind(this);
    this.autoSaveFnc = null;
    this.initValue();
  }


  autoSave() {
    const stateGroup = JSON.stringify(this.state.textDataGroup);
    const stateMemo = JSON.stringify(this.state.textDataMemo);
    if(this.state.checkDataChange.group === stateGroup && this.state.checkDataChange.memp === stateMemo) return;
    this.updateData();
    this.setState({
      checkDataChange: {
        groups: stateGroup,
        memos: stateMemo
      }
    });
  }

  updateData() {
    this.changeLoading(true);
    axios.post(APIURL+'/updateSecretNote?noteName='+this.state.noteName, {
      password: this.state.password,
      dataGroups: this.state.textDataGroup,
      dataMemos: this.state.textDataMemo,
      options: this.state.options
      }).then((res) => {
        this.changeLoading(false);
        console.log('save ok');
      }).catch((err) => {
        console.log('api error : ' + err);
      });
  }

  initValue() {
    setTimeout(() => this.changeLoading(true));
    axios.post(APIURL+'/getSecretNote?noteName='+this.state.noteName, {
      password: this.state.password
      }).then((res) => {
        if(res.data.options === null) {
          this.changeLoading(false);
        } else {
          this.initDataValue(res.data);
        }
      }).catch((err) => {
        console.log('api error : ' + err);
      });
  }

  initDataValue(val) {
    let initValue = {
      textDataGroup: val.textDataGroup,
      textDataMemo: val.textDataMemo,
      options: val.options,
      textarea: val.textDataMemo[0][0],
      checkDataChange: {
        groups: JSON.stringify(val.textDataGroup),
        memos: JSON.stringify(val.textDataMemo)
      }
    };
    this.setState(initValue);
    this.changeLoading(false);
  }

  changeValue(e) {
    let changeState = {};
    changeState[e.target.name] = e.target.value;
    if(e.target.name === 'textarea') {
      const nowGroup = this.state.nowIndex[0];
      const nowMemo = this.state.nowIndex[1];
      let baseTextMemo = this.state.textDataMemo;
      baseTextMemo[nowGroup][nowMemo] = e.target.value;
      changeState.textDataMemo = baseTextMemo;
    }
    this.setState(changeState);
    if(this.autoSaveFnc !== null) clearTimeout(this.autoSaveFnc);
    this.autoSaveFnc = setTimeout(() => {
      this.autoSave();
    }, 3000);
  }

  changeLoading(status) {
    let changeLoading = {};
    changeLoading.loading = status;
    this.setState(changeLoading);
  }

  choiceText(groupIdx, memoIdx) {
    if(this.state.nowIndex[0] === groupIdx && this.state.nowIndex[1] === memoIdx) {
      return document.getElementById('textarea').focus();
    }

    let updateValue = {};
    updateValue.nowIndex = [groupIdx, memoIdx];
    updateValue.textarea = this.state.textDataMemo[groupIdx][memoIdx];
    this.setState(updateValue);
    document.getElementById('textarea').focus();
  }

  addGroupValue() {
    if(this.state.addGroupMode) return;
    this.setState({addGroupMode: true});
    document.getElementById('add-group-box').focus();
  }

  cancelInsertGroup() {
    this.setState({addGroupMode: false});
  }

  insertNewGroup() {
    let baseTextGroup = this.state.textDataGroup.concat(this.state.addGroupName);
    let baseTextMemo = this.state.textDataMemo.concat([[]])
    this.setState({
      textDataGroup: baseTextGroup,
      textDataMemo: baseTextMemo,
      addGroupName: '',
      addGroupMode: false
    });
  }

  insertNewMemo(idx) {
    let baseTextMemo = this.state.textDataMemo;
    baseTextMemo[idx] = baseTextMemo[idx].concat(['']);
    this.setState({
      textDataMemo: baseTextMemo,
      addMemoName: '',
      textarea: '',
      nowIndex: [idx, baseTextMemo[idx].length - 1]
    });
    document.getElementById('textarea').focus();
  }

  render() {
    return (
      <div>
        <Header />
        <div className="container">
          <div className={cx('text-list')}>
            {this.state.textDataGroup.map((groupName, idx1) => {
              return (
                <div className={cx('text-group')} key={groupName+idx1}>
                  <h4>{groupName}</h4>
                  <ul>
                    {this.state.textDataMemo[idx1].map((memoText, idx2) => {
                      return (
                        <li key={memoText+idx2} onClick={this.choiceText.bind(this, idx1, idx2)} 
                          className={this.state.nowIndex[0] === idx1 && this.state.nowIndex[1] === idx2 
                            ? cx('active') : ''}>
                          <p>{memoText.substring(0, 99)}</p>
                        </li>
                      )
                    })}
                  </ul>
                  <div className={cx('add-text-btn')} onClick={this.insertNewMemo.bind(this, idx1)}>
                    <p>+ add memo</p>
                  </div>
                </div>
              )
            })}
            {!this.state.addGroupMode ? 
            <div className={cx('add-text-btn')} onClick={this.addGroupValue}>
              <p>+ add group</p>
            </div>
            : ''}
            <div className={cx('insert-group-box', this.state.addGroupMode ? 'show': '')}>
              <input id="add-group-box" type="text" name="addGroupName" onChange={this.changeValue} />
              <button onClick={this.insertNewGroup}>save</button>
              <button onClick={this.cancelInsertGroup}>cancel</button>
            </div>
          </div>
          <div className={cx('textarea-position')}>
            <div>
              <form>
                <textarea id="textarea" autoFocus name="textarea" className={cx('textarea')} onChange={this.changeValue} value={this.state.textarea}/>
              </form>
            </div>
          </div>
          <div className={cx('navigation')}>
            <div className={'clearfix'}>
              <p>© <a href="https://falsy.me/" target="_blank">FALSY</a></p>
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
};

export default connect(mstp)(Note);