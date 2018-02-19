import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom';
import React from 'react';
import App from './App';

render(
  <AppContainer><App /></AppContainer>,
  document.getElementById('wrap')
);

if (module && module.hot) {
  module.hot.accept('./App', () => {
    const Afour = require('./App').default;
    render(
      <AppContainer>
        <Afour />
      </AppContainer>,
      document.getElementById('wrap')
    );
  });
}