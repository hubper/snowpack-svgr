import React from 'react';
import logo, { ReactComponent as Logo } from './svg/logo.svg';

function App() {
  return (
    <>
      <h2>ReactComponent</h2>
      <Logo />

      <h2>Inline url</h2>
      <img src={logo} alt="" />
    </>
  );
}

export default App;
