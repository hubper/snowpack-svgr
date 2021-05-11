import React from 'react';
import logo, { ReactComponent as Logo } from './svg/logo.svg';

function App() {
  return (
    <div style={{ maxWidth: 600 }}>
      <code>{`import { ReactComponent as Logo } from "./svg/logo.svg"`}</code>
      <Logo />

      <code>{`import logo from "./svg/logo.svg"`}</code>
      <img src={logo} alt="" />
    </div>
  );
}

export default App;
