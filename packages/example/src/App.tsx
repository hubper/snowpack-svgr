import React from 'react';
import logo, { ReactComponent as Logo } from './svg/logo.svg';
import { externalUrl, ExternalImage } from '@external';

function App() {
  return (
    <div style={{ maxWidth: 800 }}>
      <code>{`import { ReactComponent as Logo } from "./svg/logo.svg"`}</code>
      <Logo />

      <code>{`import logo from "./svg/logo.svg"`}</code>
      <img src={logo} alt="" />

      <code>{`import { externalUrl, ExternalImage } from "@external"`}</code>
      <img src={externalUrl} alt="" />
      <ExternalImage />
    </div>
  );
}

export default App;
