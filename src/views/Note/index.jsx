import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSecret } from '../../actions/secret';
import { NavLink } from 'react-router-dom';
import {APIURL} from '../../constants/config.constant';
import axios from 'axios';
import Styles from '../../scss/views/note';
import classNames from 'classnames/bind';
const cx = classNames.bind(Styles);
import SyncIcon from 'mdi-react/BackupRestoreIcon';
import CloudIcon from 'mdi-react/CloudCircleIcon';
import UndoIcon from 'mdi-react/UndoIcon';
import Iframe from '../Iframe';

class Note extends Component {

  constructor(props) {
    super(props);
    const { dispatch } = this.props;
    dispatch(getSecret());
    this.state = {
      noteName: this.props.match.params.noteName,
      password: this.props.secret.password,
      nowIndex: [0, 0],
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
    this.fontSizeData = 3;
    this.saveMemoData = this.saveMemoData.bind(this);
    this.deleteMemoData = this.deleteMemoData.bind(this);
    this.deleteGroupData = this.deleteGroupData.bind(this);
    this.addGroupValue = this.addGroupValue.bind(this);
    this.insertNewGroup = this.insertNewGroup.bind(this);
    this.cancelInsertGroup = this.cancelInsertGroup.bind(this);
    this.insertNewMemo = this.insertNewMemo.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.changeLoading = this.changeLoading.bind(this);
    this.choiceText = this.choiceText.bind(this);
    this.getMemoData = this.getMemoData.bind(this);
    this.iframeLoaded = this.iframeLoaded.bind(this);
    this.autoSaveFnc = null;
    this.getMemoData();
    this.textIFrame = '';
  }

  editCommand(command, value=false) {
    if(value === 'up' || value === 'down') {
      if(value === 'up' && this.fontSizeData < 7) this.fontSizeData = this.fontSizeData + 1;
      else if(value === 'down' && this.fontSizeData > 1) this.fontSizeData = this.fontSizeData - 1;
      this.textIFrame.execCommand(command, false, this.fontSizeData);
    } else {
      this.textIFrame.execCommand(command, false);
    }
  }

  saveMemoData() {
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

  autoSaveTimeout() {
    if(this.autoSaveFnc !== null) clearTimeout(this.autoSaveFnc);
    this.autoSaveFnc = setTimeout(() => {
      this.saveMemoData();
    }, 5000);
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

  getMemoData() {
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
      nowIndex: [0, 0],
      checkDataChange: {
        groups: JSON.stringify(val.textDataGroup),
        memos: JSON.stringify(val.textDataMemo)
      }
    };
    this.setState(initValue);
    this.textIFrame.getElementsByTagName('body')[0].innerHTML = val.textDataMemo[0][0];
    this.changeLoading(false);
  }

  changeValue(e) {
    let changeState = {};
    changeState[e.target.name] = e.target.value;
    this.setState(changeState);
  }

  insertThisTextData() {
    const gIdx = this.state.nowIndex[0];
    const mIdx = this.state.nowIndex[1];
    const baseTextMemo = this.state.textDataMemo.concat();
    baseTextMemo[gIdx][mIdx] = this.textIFrame.getElementsByTagName('body')[0].innerHTML;
    this.setState({
      textDataMemo: baseTextMemo
    });
  }

  changeLoading(status) {
    let changeLoading = {};
    changeLoading.loading = status;
    this.setState(changeLoading);
  }

  choiceText(groupIdx, memoIdx) {
    if(this.state.nowIndex[0] === groupIdx && this.state.nowIndex[1] === memoIdx) {
      return this.textIFrame.getElementsByTagName('body')[0].focus();
    }
    this.insertThisTextData();
    let updateValue = {};
    updateValue.nowIndex = [groupIdx, memoIdx];
    this.textIFrame.getElementsByTagName('body')[0].focus();
    this.textIFrame.getElementsByTagName('body')[0].innerHTML = this.state.textDataMemo[groupIdx][memoIdx];
    this.setState(updateValue);
    this.autoSaveTimeout();
  }

  addGroupValue() {
    if(this.state.addGroupMode) return;
    this.setState({addGroupMode: true});
    document.getElementById('add-group-box').focus();
    this.autoSaveTimeout();
  }

  cancelInsertGroup() {
    this.setState({addGroupMode: false});
    this.autoSaveTimeout();
  }

  insertNewGroup() {
    if(this.state.addGroupName === '') return;
    this.insertThisTextData();
    const baseTextGroup = this.state.textDataGroup.concat(this.state.addGroupName);
    const baseTextMemo = this.state.textDataMemo.concat([['']]);
    const gIdx = baseTextGroup.length - 1;
    const mIdx = baseTextMemo[gIdx].length - 1;
    this.setState({
      textDataGroup: baseTextGroup,
      textDataMemo: baseTextMemo,
      addGroupName: '',
      addGroupMode: false,
      nowIndex: [gIdx, mIdx]
    });
    this.textIFrame.getElementsByTagName('body')[0].innerHTML = '';
    document.getElementById('add-group-box').value = '';
    this.autoSaveTimeout();
  }

  insertNewMemo(idx) {
    this.insertThisTextData();
    let baseTextMemo = this.state.textDataMemo;
    baseTextMemo[idx] = baseTextMemo[idx].concat(['']);
    this.setState({
      textDataMemo: baseTextMemo,
      addMemoName: '',
      nowIndex: [idx, baseTextMemo[idx].length - 1]
    });
    this.textIFrame.getElementsByTagName('body')[0].innerHTML = '';
    this.textIFrame.getElementsByTagName('body')[0].focus();
    this.autoSaveTimeout();
  }

  deleteMemoData() {
    const gIdx = this.state.nowIndex[0];
    const mIdx = this.state.nowIndex[1];
    let copyTextMemo = this.state.textDataMemo.concat();
    copyTextMemo[gIdx].splice(mIdx, 1);
    if(copyTextMemo[gIdx].length === 0) {
      copyTextMemo[gIdx].push('');
    }
    const nowIndex = [gIdx, 0];
    this.setState({
      textDataMemo: copyTextMemo,
      nowIndex
    });
    this.textIFrame.getElementsByTagName('body')[0].innerHTML = copyTextMemo[gIdx][0];
    this.autoSaveTimeout();
  }

  deleteGroupData(idx) {
    let copyDataGroup = this.state.textDataGroup.concat();
    let copyTextMemo = this.state.textDataMemo.concat();
    if(idx === 0) return;
    copyDataGroup.splice(idx, 1);
    copyTextMemo.splice(idx, 1);
    const textarea = copyTextMemo[0][0];
    const nowIndex = [0, 0];
    this.setState({
      textDataGroup: copyDataGroup,
      textDataMemo: copyTextMemo,
      nowIndex
    });
    this.textIFrame.getElementsByTagName('body')[0].innerHTML = copyTextMemo[0][0];
    this.autoSaveTimeout();
  }

  iframeLoaded() {
    this.textIFrame = document.getElementById('edit-area').contentWindow.document;
    this.textIFrame.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: "ProximaNova-Regular", "Noto Sans KR", sans-serif;
              font-size: 14px;
              line-height: 26px;
              margin: 0;
            }
          </style>
        </head>
        <body>Loading...</body>
      </html>
      `);
    this.textIFrame.designMode = 'on';
  }

  render() {
    return (
      <div>
        <header>
          <div className="container">
            <NavLink to={'/'}><h1>afour <span>alpha</span></h1></NavLink>
            <div className={cx('navigation-menu')}>
              <span onClick={this.getMemoData}><i><SyncIcon /></i>sync</span>
              <span onClick={this.saveMemoData}><i><CloudIcon /></i>save</span>
              <span><NavLink to={`/`}><i><UndoIcon /></i>esc</NavLink></span>
            </div>
          </div>
        </header>
        <div className="container">
          <div className={cx('text-list')}>
            {this.state.textDataGroup.map((groupName, idx1) => {
              return (
                <div className={cx('text-group')} key={groupName+idx1}>
                  <h4>{groupName} {idx1 > 0 ? <span onClick={this.deleteGroupData.bind(this, idx1)}>- delete</span> : '' }</h4>
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
              <article>
                <div className={cx('option-area')}>
                  <span onClick={this.editCommand.bind(this, 'bold')}>bold</span>
                  <span onClick={this.editCommand.bind(this, 'strikeThrough')}>strike-through</span>
                  <span onClick={this.editCommand.bind(this, 'underline')}>underline</span>
                  <span onClick={this.editCommand.bind(this, 'justifyCenter')}>justify-center</span>
                  <span onClick={this.editCommand.bind(this, 'justifyLeft')}>justify-left</span>
                  <span className={cx('delete-memo-btn')} onClick={this.deleteMemoData}>- delete</span>
                </div>
                <Iframe onLoad={this.iframeLoaded} id="edit-area" className={cx('text-editor-area')} src="about:blank" />
              </article>
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