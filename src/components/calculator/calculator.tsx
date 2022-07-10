import React, { useState } from "react";
import "./calculator.scss";
import Button from "../button/button";

type Props = {};
function Calculator({}: Props) {
  const [value, setValue] = useState<number>(0);
  const characterList: Array<string> = [
    "%",
    "CE",
    "C",
    "<-",
    "1/x",
    "x²",
    "²√x",
    "÷",
    "7",
    "8",
    "9",
    "x",
    "4",
    "5",
    "6",
    "-",
    "1",
    "2",
    "3",
    "+",
    "+/-",
    "0",
    ",",
    "=",
  ];
  return (
    <div className="mainContainer">
      <header>
        <div className="bander">
          <span>Standard calculator</span>
        </div>
        <div className="contentContainer"></div>
      </header>
      <body>
        {characterList.map((character) => (
          <Button character={character} />
        ))}
      </body>
    </div>
  );
}

export default Calculator;
