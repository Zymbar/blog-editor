import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
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
