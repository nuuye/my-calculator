import React, { useEffect, useState } from 'react';
import './calculator.scss';
import Button from '../button/button';
import {
  atan2,
  chain,
  derivative,
  e,
  evaluate,
  log,
  pi,
  pow,
  round,
  sqrt,
} from 'mathjs';

type Props = {};
function Calculator({}: Props) {
  const [value, setValue] = useState<number>(0);
  const [display, setDisplay] = useState<string[]>([]);

  const characterList: Array<string> = [
    '%',
    'CE',
    'C',
    '<-',
    '1/x',
    'x²',
    '²√x',
    '÷',
    '7',
    '8',
    '9',
    'x',
    '4',
    '5',
    '6',
    '-',
    '1',
    '2',
    '3',
    '+',
    '+/-',
    '0',
    ',',
    '=',
  ];

  const addElementToDisplay = (element: string) => {
    display && setDisplay([...display, element]);
  };

  const calculateDisplay = () => {
    return evaluate(display.join(' '));
  };

  const handleClick = (event: any) => {
    switch (event.target.innerText) {
      case '<-':
        display.pop();
        break;
      case 'CE':
        setDisplay([]);
        break;
      case '=':
        // setDisplay(calculateDisplay());
        break;
      default:
        addElementToDisplay(event.target.innerText);
        break;
    }
  };
  const testArray = ['4', '*', '7'];
  useEffect(() => {
    console.log(display);
    console.log('evaluate : ', evaluate(testArray.join(' ')));
  }, [display]);

  return (
    <div className="mainContainer">
      <div className="bander">
        <span>Standard calculator</span>
      </div>
      <header>
        <div className="contentContainer">
          <span>{display.map((element) => element)}</span>
        </div>
      </header>
      <body>
        {characterList.map((character, key) => (
          <Button
            key={key}
            character={character}
            onClick={(e) => {
              handleClick(e);
            }}
          />
        ))}
      </body>
    </div>
  );
}

export default Calculator;
