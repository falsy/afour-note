import React from 'react';
import Styles from '../../scss/views/note';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
const cx = classNames.bind(Styles);

const Header = () => (
  <header>
    <div className="container">
      <NavLink to={'/'}><h1>AFOUR <span>alpha</span></h1></NavLink>
    </div>
  </header>
)

export default Header;