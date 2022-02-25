import React from 'react';
import './styles/app.css';
import {Editor} from "./Components/Editor";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Cryptocurrencies
      </header>
        <Editor/>
    </div>
  );
}

export default App;
