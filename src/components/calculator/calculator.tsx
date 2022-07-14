import React, { useEffect, useState } from 'react';
import './calculator.scss';
import Button from '../button/button';
import {
  atan2,
  chain,
  derivative,
  e,
  evaluate,
  forEach,
  log,
  pi,
  pow,
  round,
  sqrt,
} from 'mathjs';

type Props = {};
function Calculator({}: Props) {
  const [history, setHistory] = useState<string[]>([]);
  const [display, setDisplay] = useState<string[]>(['0']);
  const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const signs = ['+', '-', '*', '÷'];
  const lastDisplayedElement = display[display.length - 1];
  const contentContainerWidth =
    document.getElementById('contentContainer')?.offsetWidth;
  const lineOfElementsWidth =
    document.getElementById('lineOfElements')?.offsetWidth;

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
    if (display.length == 1 && display[0] == '0') {
      return;
    }
    const slicedLastChar = lastDisplayedElement.slice(0, -1);
    display.pop();
    display.push(slicedLastChar);
  };

  const hasToBeReduced = () => {
    // let charCounter = 0;
    // display.forEach((element) => {
    //   for (var char = 0; char < element.length; char++) {
    //     charCounter++;
    //   }
    // });
    // if (charCounter >= 13) {
    //   return false; //ch
    // }
    // return false;
    if (
      lineOfElementsWidth &&
      contentContainerWidth &&
      lineOfElementsWidth + 16 >= contentContainerWidth
    ) {
      return true;
    }
    return false;
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
        if (display.length == 0 || (display.length == 1 && display[0] == '')) {
          setDisplay(['0']);
        } else {
          setDisplay([...display]);
        }
        break;
      case 'CE':
        setDisplay(['0']);
        break;
      case 'C':
        setDisplay(['0']);
        break;
      case '=':
        setDisplay([calculateDisplay().replace(/\./g, ',')]);
        break;
      default:
        if (lastDisplayedElement.includes(',') && actualElement == ',') {
          return;
        } else if (display.length == 1 && display[0] == '0') {
          //replace 0 with actual number if only 0 is displayed at screen
          display.pop();
          addElementToDisplay(actualElement);
        } else if (
          //if lastElement = number : add to it
          display.length > 0 &&
          verifyNumber(lastDisplayedElement) &&
          actualElement != 'x²'
        ) {
          const tempLastNumber = display.pop() + actualElement;
          console.log('lastNumber : ', tempLastNumber);
          addElementToDisplay(tempLastNumber);
        } else {
          // add to the next place , if x² it adds ² (so it shows ²)
          addElementToDisplay(transformChar());
        }
        break;
    }
  };

  useEffect(() => {
    console.log('display : ', display);
  }, [display]);

  return (
    <div className="mainContainer">
      <div className="bander">
        <span>Standard calculator</span>
      </div>
      <header>
        <div className="contentContainer" id="contentContainer">
          <span className="calculHistory">{display.join(' ')}</span>
          <span
            id="lineOfElements"
            className={`lineOfElements ${'reduceFontSize'}`}
          >
            {display.map((element) => element)}
          </span>
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

//TODO
/*
SQRT
Couper après après la virgule si trop de 0 exemple : 12.60000001 -> 12.6
Réduire la font-size si trop de nombres : somme des char = 13 on reduit
Afficher l'historique de calcul en haut en petit

Bonus :
Espacer les nombres quand nécessaire : 100 000 / 50 000 / 5 000
*/
