import React from 'react';
import logo, { ReactComponent as Logo } from './svg/logo.svg';
import large from './svg/large.svg';

function App() {
  // Return the App component.
  return (
    <>
      <h2>ReactComponent</h2>
      <Logo />

      <h2>Inline base64</h2>
      <img src={logo} alt="" />

      <h2>Inline url</h2>
      <img src={large} alt="" />
    </>
  );
}

export default App;
