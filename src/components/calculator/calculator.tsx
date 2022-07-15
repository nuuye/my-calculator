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
  string,
} from 'mathjs';

type Props = {};
function Calculator({}: Props) {
  const [history, setHistory] = useState<string[]>([]);
  const [display, setDisplay] = useState<string[]>(['0']);
  const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const signs = ['+', '-', '*', '÷', 'x', '/'];
  const lastDisplayedElement = display[display.length - 1];
  const lastHistoryElement = history[history.length - 1];
  const contentContainerWidth =
    document.getElementById('contentContainer')?.offsetWidth;
  const lineOfElementsWidth =
    document.getElementById('lineOfElements')?.offsetWidth;

  const characterList: Array<string> = [
    '%',
    'CE',
    'C',
    '⌫',
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

  const addElementToHistory = (element: string) => {
    history && setHistory([...history, element]);
  };

  const calculateHistory = () => {
    for (var i = 0; i < history.length; i++) {
      if (history[i] == '÷') {
        history[i] = '/';
      } else if (history[i] == 'x') {
        history[i] = '*';
      } else if (history[i] == '²') {
        history[i] = '^2';
      } else if (history[i].includes(',')) {
        history[i] = history[i].replace(/,/g, '.');
      }
    }
    return evaluate(history.join(' ')).toString();
  };

  const replaceAlternativeSigns = (stringList: string[]) => {
    for (var i = 0; i < stringList.length; i++) {
      if (stringList[i] == '/') {
        stringList[i] = '÷';
      } else if (stringList[i] == '*') {
        stringList[i] = 'x';
      }
    }
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
    const slicedLastCharForDisplay = lastDisplayedElement.slice(0, -1);
    display.pop();
    display.push(slicedLastCharForDisplay);
    const slicedLastCharForHistory = lastHistoryElement.slice(0, -1);
    history.pop();
    history.push(slicedLastCharForHistory);
  };

  const hasToBeReduced = () => {
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
        if (lastDisplayedElement[lastDisplayedElement.length - 1] == ',') {
          return;
        } else if (lastHistoryElement == '=') {
          setHistory([]);
          setHistory([...display, actualElement]);
        } else if (lastHistoryElement == actualElement) {
          // avoid adding two signs
          return;
        } else if (signs.includes(lastHistoryElement)) {
          // change sign
          history.pop();
          addElementToHistory(actualElement);
        } else {
          addElementToHistory(actualElement);
        }
        break;
      case '⌫':
        if (!signs.includes(lastHistoryElement)) {
          if (lastHistoryElement != '=') {
            eraseLastNumber();
            setDisplay([...display]);
            setHistory([...history]);
            if (
              display.length == 0 ||
              (display.length == 1 && display[0] == '')
            ) {
              setDisplay(['0']);
              setHistory(['0']);
            }
          } else if (lastHistoryElement == '=') {
            setHistory([display[0]]);
            return;
          } else if (
            display.length == 0 ||
            (display.length == 1 && display[0] == '')
          ) {
            setDisplay(['0']);
          }
        }
        break;
      case 'CE':
        setDisplay(['0']);
        setHistory([]);
        break;
      case 'C':
        setDisplay(['0']);
        setHistory([]);
        break;
      case '=':
        if (lastDisplayedElement[lastDisplayedElement.length - 1] == ',') {
          return;
        } else if (lastHistoryElement == '=') {
          history[0] = display[0];
          history.pop();
          setHistory([...history]);
          setDisplay([calculateHistory().replace(/\./g, ',')]);
          replaceAlternativeSigns(history);
          addElementToHistory(actualElement);
        } else if (signs.includes(lastHistoryElement)) {
          return;
        } else {
          //calcul final
          addElementToHistory(actualElement);
          setDisplay([calculateHistory().replace(/\./g, ',')]);
        }
        break;
      case ',':
        if (verifyNumber(lastDisplayedElement)) {
          const tempNumber = display.pop() + ',';
          history.pop();
          display.push(tempNumber);
          history.push(tempNumber);
          setDisplay([...display]);
          setHistory([...history]);
        }
        if (lastHistoryElement == '=') {
          //if press , and last is = replace by 0,
          setHistory(['0,']);
          setDisplay(['0,']);
        } else if (
          (lastDisplayedElement == '0' && lastHistoryElement == '0') ||
          lastHistoryElement == '' ||
          history.length == 0
        ) {
          setDisplay(['0,']);
          setHistory(['0,']);
        } else if (lastDisplayedElement.includes(',')) {
          return;
        }
        break;
      default:
        if (lastHistoryElement == '=') {
          // reset screen if last is ' = '
          setDisplay([actualElement]);
          setHistory([actualElement]);
        } else if (signs.includes(lastHistoryElement)) {
          // clean display for new operation
          display.pop();
          addElementToDisplay(actualElement);
          addElementToHistory(actualElement);
        } else if (display.length == 1 && display[0] == '0') {
          //replace 0 with actual number if only 0 is displayed at screen
          display.pop();
          history.pop();
          addElementToDisplay(actualElement);
          addElementToHistory(actualElement);
        } else if (
          //if lastElement = number : add to it
          display.length > 0 &&
          verifyNumber(lastDisplayedElement) &&
          actualElement != 'x²'
        ) {
          const tempLastNumber = display.pop() + actualElement;
          history.pop();
          console.log('lastNumber : ', tempLastNumber);
          addElementToDisplay(tempLastNumber);
          addElementToHistory(tempLastNumber);
        } else {
          // add to the next place , if x² it adds ² (so it shows ²)
          addElementToDisplay(transformChar());
        }
        break;
    }
  };

  // const removeEmptyStrings = () => {
  //   if (display.includes('')) {
  //     const indexDisplay = display.indexOf('');
  //     display.slice(indexDisplay, 1);
  //     setDisplay([...display]);
  //   } else if (history.includes('')) {
  //     const indexHistory = history.indexOf('');
  //     display.slice(indexHistory, 1);
  //     setHistory([...history]);
  //   }
  // };

  useEffect(() => {
    console.log('display : ', display);
    console.log('history : ', history);
  }, [display]);

  return (
    <div className="mainContainer">
      <div className="bander">
        <span>Standard calculator</span>
      </div>
      <header>
        <div className="contentContainer" id="contentContainer">
          <span className="calculHistory">
            {history.map((element) => element)}
          </span>
          <span
            id="lineOfElements"
            className={`lineOfElements ${'reduceFontSize'}`}
          >
            {display.map((element) => element)}
          </span>
        </div>
      </header>
      <div className="body">
        {characterList.map((character, key) => (
          <Button
            key={key}
            character={character}
            onClick={(e) => {
              handleClick(e);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Calculator;

//TODO
/*
SQRT
Couper après après la virgule si trop de 0 exemple : 12.60000001 -> 12.6
Réduire la font-size si trop de nombres : somme des char = 13 on reduit
CE et C différence
Resize la calculette
nombres negatifs quand on delete il reste le -
Bonus :
Espacer les nombres quand nécessaire : 100 000 / 50 000 / 5 000
*/
