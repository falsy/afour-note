import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import {APIURL} from '../../constants/config.constant';
import axios from 'axios';
import Styles from '../../scss/views/note';
import classNames from 'classnames/bind';
const cx = classNames.bind(Styles);

import SyncIcon from 'mdi-react/BackupRestoreIcon';
import CloudIcon from 'mdi-react/CloudCircleIcon';
import ExitToAppIcon from 'mdi-react/ExitToAppIcon';

import Title from 'mdi-react/FormatTitleIcon';
import Bold from 'mdi-react/FormatBoldIcon';
import Italic from 'mdi-react/FormatItalicIcon';
import Strike from 'mdi-react/FormatStrikethroughIcon';
import Underline from 'mdi-react/FormatUnderlineIcon';
import Left from 'mdi-react/FormatAlignLeftIcon';
import Right from 'mdi-react/FormatAlignRightIcon';
import Center from 'mdi-react/FormatAlignCenterIcon';
import Delete from 'mdi-react/DeleteIcon';
import Clear from 'mdi-react/FormatClearIcon';

import Iframe from '../Iframe';

class Note extends Component {

  constructor(props) {
    super(props);
    const userData = this.userData();

    this.state = {
      noteName: userData.noteName,
      password: userData.password,
      nowIndex: [0, 0],
      textDataGroup: ['default'],
      textDataMemo: [['']],
      editGroupName: '',
      options: {},
      addGroupMode: false,
      editGroupMode: false,
      addGroupName: '',
      loading: null,
      checkDataChange: {
        groups: '',
        memos: ''
      }
    };

    if(!userData) return this.props.history.push('/');

    this.saveMemoData = this.saveMemoData.bind(this);
    this.deleteMemoData = this.deleteMemoData.bind(this);
    this.deleteGroupData = this.deleteGroupData.bind(this);
    this.editGroupData = this.editGroupData.bind(this);
    this.saveEditGroup = this.saveEditGroup.bind(this);
    this.cancelEditGroup = this.cancelEditGroup.bind(this);
    this.addGroupValue = this.addGroupValue.bind(this);
    this.insertNewGroup = this.insertNewGroup.bind(this);
    this.cancelInsertGroup = this.cancelInsertGroup.bind(this);
    this.insertNewMemo = this.insertNewMemo.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.changeLoading = this.changeLoading.bind(this);
    this.choiceText = this.choiceText.bind(this);
    this.getMemoData = this.getMemoData.bind(this);
    this.handleLoad = this.handleLoad.bind(this);
    this.autoSaveFnc = null;
    this.textIFrame = '';
  }

  componentDidMount() {
    window.addEventListener('load', this.handleLoad);
  }

  handleLoad() {
    this.iframeLoaded();
    this.getMemoData();
  }

  userData() {
    const nowDate = new Date();
    const longTime = nowDate.getTime();
    if(!this.props.secret.password && window.localStorage.getItem("user_session")) {
      const sessionData = atob(window.localStorage.getItem("user_session"));
      const userData = sessionData.split('/pw/');
      const noteName = userData[0];
      const password = userData[1].split('/time/')[0];
      const timeStamp = userData[1].split('/time/')[1];
      if(noteName === this.props.match.params.noteName || longTime + 1296000000 > Number(timeStamp)) {
        return {noteName, password};
      }
    }
    if(this.props.secret.password) {
      const userData = this.props.match.params.noteName + '/pw/' + this.props.secret.password + '/time/' + longTime;
      window.localStorage.setItem('user_session', btoa(userData));
      return {noteName: this.props.match.params.noteName, password: this.props.secret.password};
    }
    return false;
  }

  editCommand(command, value=false) {
    if(value) {
      this.textIFrame.execCommand(command, false, value);
    } else {
      this.textIFrame.execCommand(command, false);
    }
  }

  saveMemoData() {
    this.insertThisTextData();
    const stateGroup = JSON.stringify(this.state.textDataGroup);
    const stateMemo = JSON.stringify(this.state.textDataMemo);
    if(this.state.checkDataChange.groups === stateGroup && this.state.checkDataChange.memos === stateMemo) return;
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
    }, 3000);
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
      }).catch((err) => {
        console.log('api error : ' + err);
      });
  }

  getMemoData() {
    this.changeLoading(true);
    axios.post(APIURL+'/getSecretNote?noteName='+this.state.noteName, {
      password: this.state.password
      }).then((res) => {
        if(res.data.options === null) {
          this.textIFrame.getElementsByTagName('body')[0].focus();
          this.textIFrame.getElementsByTagName('body')[0].innerHTML = '';
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
    this.textIFrame.getElementsByTagName('body')[0].focus();
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

  editGroupData(idx) {
    this.setState({
      editGroupMode: idx,
      editGroupName: ''
    });
  }

  saveEditGroup() {
    const idx = this.state.editGroupMode;
    const name = this.state.editGroupName;
    const groups = this.state.textDataGroup.concat();
    groups.splice(idx, 1, name);
    this.setState({
      editGroupMode: false,
      editGroupName: '',
      textDataGroup: groups
    });
    this.autoSaveTimeout();
  }

  cancelEditGroup() {
    this.setState({
      editGroupMode: false,
      editGroupName: ''
    });
  }

  iframeLoaded() {
    if(typeof this.textIFrame === 'undefined') return;
    this.textIFrame = document.getElementById('edit-area').contentWindow.document;
    this.textIFrame.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <link href="https://afour.net/afour-proxima-nova.css" rel="stylesheet">
          <style>
            @import url(//fonts.googleapis.com/earlyaccess/notosanskr.css);
            body {
              font-family: "ProximaNova-Regular", "Noto Sans KR", sans-serif;
              font-size: 14px;
              line-height: 24px;
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
            <NavLink to={'/'}><h1>afour <span>beta</span></h1></NavLink>
            <div className={cx('navigation-menu')}>
              <span onClick={this.getMemoData}><i><SyncIcon /></i>sync</span>
              <span onClick={this.saveMemoData}><i><CloudIcon /></i>save</span>
              <span><NavLink to={`/`}><i><ExitToAppIcon /></i>exit</NavLink></span>
            </div>
          </div>
        </header>
        <div className="container">
          <div className={cx('text-list')}>
            {this.state.textDataGroup.map((groupName, idx1) => {
              return (
                <div className={cx('text-group')} key={groupName+idx1}>
                  <h4 className={cx(this.state.editGroupMode === idx1 ? 'display-none' : '')}>{groupName}
                  {idx1 > 0 ? 
                    <div><span onClick={this.deleteGroupData.bind(this, idx1)}>delete</span><span onClick={this.editGroupData.bind(this, idx1)}>edit</span></div> : '' }
                  </h4>
                  <div className={cx('insert-eidt-group-box', this.state.editGroupMode === idx1 ? 'show': '')}>
                    <input className={cx('edit-group-'+idx1)} type="text" name="editGroupName" onChange={this.changeValue} />
                    <button onClick={this.saveEditGroup}>save</button>
                    <button onClick={this.cancelEditGroup}>cancel</button>
                  </div>
                  <ul>
                    {this.state.textDataMemo[idx1].map((memoText, idx2) => {
                      let el = document.createElement('div');
                      el.innerHTML = memoText.replace(/</gi, ' <');
                      memoText = el.textContent || el.innerText || '';
                      return (
                        <li key={memoText+idx2} onClick={this.choiceText.bind(this, idx1, idx2)} 
                          className={this.state.nowIndex[0] === idx1 && this.state.nowIndex[1] === idx2 
                            ? cx('active') : ''}>
                          <p>{memoText.substring(0, 60) ? memoText.substring(0, 60) : 'new memo'}</p>
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
            <div className={cx('insert-eidt-group-box', this.state.addGroupMode ? 'show': '')}>
              <input id="add-group-box" type="text" name="addGroupName" onChange={this.changeValue} />
              <button onClick={this.insertNewGroup}>save</button>
              <button onClick={this.cancelInsertGroup}>cancel</button>
            </div>
          </div>
          <div className={cx('textarea-position')}>
            <div>
              <article>
                <div className={cx('option-area')}>
                  <span className={cx('right-line')} onClick={this.editCommand.bind(this, 'removeFormat')}><i><Clear /></i></span>
                  <span onClick={this.editCommand.bind(this, 'fontSize', '4')}><i><Title /></i></span>
                  <span onClick={this.editCommand.bind(this, 'bold')}><i><Bold /></i></span>
                  <span className={cx('right-line')} onClick={this.editCommand.bind(this, 'italic')}><i><Italic /></i></span>
                  <span onClick={this.editCommand.bind(this, 'strikeThrough')}><i><Strike /></i></span>
                  <span className={cx('right-line')} onClick={this.editCommand.bind(this, 'underline')}><i><Underline /></i></span>
                  <span onClick={this.editCommand.bind(this, 'justifyLeft')}><i><Left /></i></span>
                  <span onClick={this.editCommand.bind(this, 'justifyCenter')}><i><Center /></i></span>
                  <span className={cx('right-line')} onClick={this.editCommand.bind(this, 'justifyRight')}><i><Right /></i></span>
                  <span className={cx('delete-memo-btn')} onClick={this.deleteMemoData}><i><Delete /></i></span>
                </div>
                <Iframe id="edit-area" className={cx('text-editor-area')} />
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