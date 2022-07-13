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
  const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const signs = ['+', '-', '*', '÷'];
  const lastDisplayedElement = display[display.length - 1];

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
    for (var i = 0; i < display.length; i++) {
      if (display[i] == '÷') {
        display[i] = '/';
      } else if (display[i] == 'x') {
        display[i] = '*';
      } else if (display[i] == '²') {
        display[i] = '^2';
      } else if (display[i].includes(',')) {
        display[i] = display[i].replace(/,/g, '.');
        console.log('here : ', display[i]);
      }
    }
    return evaluate(display.join(' ')).toString();
  };

  const verifyNumber = (element: string) => {
    for (var i = 0; i < element.length; i++) {
      if (!numbers.includes(element[i])) {
        return false;
      } else {
        return true;
      }
    }
  };

  const eraseLastNumber = () => {
    const slicedLastChar = lastDisplayedElement.slice(0, -1); //2
    display.pop();
    display.push(slicedLastChar);
  };

  const handleClick = (event: any) => {
    const actualElement = event.target.innerText;
    const transformChar = () => {
      if (actualElement == 'x²') {
        return '²';
      } else {
        return actualElement;
      }
    };
    switch (actualElement) {
      case '+':
      case '-':
      case 'x':
      case '÷':
        addElementToDisplay(actualElement);
        break;
      case '<-':
        eraseLastNumber();
        setDisplay([...display]);
        break;
      case 'CE':
        setDisplay([]);
        break;
      case 'C':
        setDisplay([]);
        break;
      case '=':
        setDisplay([calculateDisplay().replace(/\./g, ',')]);
        break;
      default:
        if (
          display.length > 0 &&
          verifyNumber(lastDisplayedElement) &&
          actualElement != 'x²'
        ) {
          const tempLastNumber = display.pop() + actualElement;
          console.log('lastNumber : ', tempLastNumber);
          addElementToDisplay(tempLastNumber);
        } else {
          addElementToDisplay(transformChar());
        }
        break;
    }
  };
  const testString = '103.5';
  useEffect(() => {
    console.log('display : ', display);
    // console.log('regex  : ', testString.replace(/\./g, ','), testString);
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
