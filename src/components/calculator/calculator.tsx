import React, { useEffect, useState } from 'react';
import './calculator.scss';
import Button from '../button/button';
import { evaluate } from 'mathjs';

type Props = {};
function Calculator({}: Props) {
  const [history, setHistory] = useState<string[]>([]);
  const [display, setDisplay] = useState<string[]>(['0']);
  const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ','];
  const signs = ['+', '-', '*', '÷', 'x', '/'];
  const lastDisplayedElement = display[display.length - 1];
  const lastHistoryElement = history[history.length - 1];

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

  const roundBigNumbers = (stringList: string[]) => {
    const newString: string[] = [];
    stringList.forEach((string) => {
      newString.push(
        (
          Math.round((parseFloat(string) + Number.EPSILON) * 10000) / 10000
        ).toString()
      );
    });
    return newString;
  };
  const addElementToDisplay = (element: string) => {
    display && setDisplay([...display, element]);
  };

  const addElementToHistory = (element: string) => {
    if (history.length == 0) {
      history.push(element);
    } else history && setHistory([...history, element]);
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
    return roundBigNumbers([evaluate(history.join(' ')).toString()]);
  };

  const replaceAlternativeSigns = (stringList: string[]) => {
    for (var i = 0; i < stringList.length; i++) {
      if (stringList[i] == '/') {
        stringList[i] = '÷';
      } else if (stringList[i] == '*') {
        stringList[i] = 'x';
      } else if (stringList[i] == '^2') {
        stringList[i] = '²';
      }
    }
  };

  const verifyNumber = (element: string) => {
    let stringWithoutSigns = element;
    for (var i = 0; i < element.length; i++) {
      if (element[0] == '+' || '-') {
        stringWithoutSigns = element.substring(1);
      }
      if (!numbers.includes(stringWithoutSigns[i])) {
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
          // no signs after a comma
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
          // addElementToHistory(actualElement);
          history.push(actualElement);
          setHistory([...history]);
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
          if (history[0] == '-' && history[1][0] == '-') {
            // -- problem
            history.shift();
          }
          history[0] = display[0];
          history.pop(); // remove =
          setHistory([...history]);
          setDisplay([calculateHistory()[0].replace(/\./g, ',')]);
          replaceAlternativeSigns(history);
          addElementToHistory(actualElement);
        } else if (signs.includes(lastHistoryElement)) {
          return;
        } else {
          //calcul final
          addElementToHistory(transformChar());
          setDisplay([calculateHistory()[0].replace(/\./g, ',')]);
          console.log('het');
        }
        break;
      case ',':
        if (
          verifyNumber(lastDisplayedElement) &&
          !lastDisplayedElement.includes(',')
        ) {
          const tempNumber = display.pop() + ',';
          history.pop();
          display.push(tempNumber);
          history.push(tempNumber);
          setDisplay([...display]);
          setHistory([...history]);
        } else if (lastHistoryElement == '=') {
          //if press , and last is = replace by 0,
          setHistory(['0,']);
          setDisplay(['0,']);
        } else if (
          (lastDisplayedElement == '0' &&
            lastHistoryElement == '0' &&
            history.length < 2) ||
          lastHistoryElement == '' ||
          history.length == 0
        ) {
          setDisplay(['0,']);
          setHistory(['0,']);
        } else if (lastDisplayedElement.includes(',')) {
          return;
        } else {
          // -3
          const tempNumber = display.pop() + ',';
          history.pop(); //-
          display.push(tempNumber);
          history.push(tempNumber);
          if (history[0] == '-' && history[1][0] == '-') {
            history.shift();
          }
          setDisplay([...display]);
          setHistory([...history]);
        }
        break;
      case 'x²':
        if (signs.includes(lastHistoryElement)) {
          return;
        } else if (lastHistoryElement == '=') {
          setHistory([lastDisplayedElement, '²']);
          addElementToDisplay('²');
        } else {
          if (history.length == 0) {
            addElementToHistory('0');
          }
          addElementToDisplay(transformChar());
          addElementToHistory(transformChar());
        }
        break;
      case '+/-':
        if (history[0] == '-') {
          history.shift();
          display.shift();
          setHistory([...history]);
          setDisplay([...display]);
        } else {
          history.unshift('-');
          display.unshift('-');
          setHistory([...display]);
          setDisplay([...display]);
        }
        break;
      case '%':
        break;
      case '1/x':
        break;
      case '²√x':
        break;
      default:
        if (lastHistoryElement == '-') {
          display.pop();
          history.pop();
          addElementToDisplay('-' + actualElement);
          addElementToHistory('-' + actualElement);
        } else if (lastHistoryElement == '=') {
          // reset screen if last is ' = '
          setDisplay([actualElement]);
          setHistory([actualElement]);
        } else if (signs.includes(lastHistoryElement)) {
          // clean display for new operation
          if (lastDisplayedElement == '²') {
            display.pop();
          }
          setDisplay([actualElement]);
          addElementToHistory(actualElement);
        } else if (display.length == 1 && display[0] == '0') {
          //replace 0 with actual number if only 0 is displayed at screen
          display.pop();
          history.pop();
          addElementToDisplay(actualElement);
          addElementToHistory(actualElement);
        } else if (
          //if lastElement = number : add to it
          display.length > 0
        ) {
          console.log('test add');
          const tempLastNumber = display.pop() + actualElement;
          history.pop();
          addElementToDisplay(tempLastNumber);
          addElementToHistory(tempLastNumber);
        } else {
          console.log('test add normal');
          addElementToDisplay(transformChar());
          addElementToHistory(actualElement);
        }
        break;
    }
  };

  useEffect(() => {}, [display]);

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
