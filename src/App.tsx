import React from "react";
import logo from "./logo.svg";
import "./App.scss";
import Button from "../src/components/button/button";
import Calculator from "../src/components/calculator/calculator";

function App() {
  return (
    <div className="App">
      <div className="header">
        <img src={logo} className="App-logo" alt="logo" />
      </div>
      <div className="body">
        <Calculator />
      </div>
    </div>
  );
}

export default App;
