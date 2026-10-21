import React, { useState } from 'react';
import { retroAudio } from '../../services/audio';

export const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState<number>(0);

  const inputDigit = (digit: string) => {
    retroAudio.playMineClick();
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    retroAudio.playMineClick();
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearAll = () => {
    retroAudio.playSwitchClick('button');
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    retroAudio.playSwitchClick('button');
    setDisplay('0');
  };

  const performOperation = (nextOp: string) => {
    retroAudio.playMineClick();
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operation) {
      const currentValue = prevValue || 0;
      let newValue = currentValue;

      switch (operation) {
        case '+':
          newValue = currentValue + inputValue;
          break;
        case '-':
          newValue = currentValue - inputValue;
          break;
        case '*':
          newValue = currentValue * inputValue;
          break;
        case '/':
          newValue = inputValue !== 0 ? currentValue / inputValue : 0;
          break;
        default:
          break;
      }

      setPrevValue(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperation(nextOp === '=' ? null : nextOp);
  };

  const handleSpecial = (type: 'sqrt' | 'percent' | 'invert' | 'negate') => {
    retroAudio.playMineClick();
    const val = parseFloat(display);
    let result = val;

    if (type === 'sqrt') {
      result = Math.sqrt(val);
    } else if (type === 'percent') {
      result = (prevValue || 0) * (val / 100);
    } else if (type === 'invert') {
      result = val !== 0 ? 1 / val : 0;
    } else if (type === 'negate') {
      result = -val;
    }

    setDisplay(String(result));
    setWaitingForOperand(true);
  };

  const handleMemory = (action: 'MC' | 'MR' | 'MS' | 'M+') => {
    retroAudio.playSwitchClick('button');
    const val = parseFloat(display);
    if (action === 'MC') setMemory(0);
    if (action === 'MR') setDisplay(String(memory));
    if (action === 'MS') {
      setMemory(val);
      setWaitingForOperand(true);
    }
    if (action === 'M+') {
      setMemory((prev) => prev + val);
      setWaitingForOperand(true);
    }
  };

  return (
    <div className="p-2 bg-[#c0c0c0] font-sans text-xs select-none h-full flex flex-col justify-between">
      {/* Display screen */}
      <div className="win3-box-sunken bg-white p-1 mb-2 text-right">
        <div className="flex items-center justify-between text-gray-500 text-[10px] px-1">
          <span>{memory !== 0 ? 'M' : ''}</span>
          <span className="font-mono text-base font-bold text-black truncate">{display}</span>
        </div>
      </div>

      {/* Button Grid */}
      <div className="grid grid-cols-5 gap-1">
        {/* Row 1 */}
        <button type="button" onClick={() => handleMemory('MC')} className="win3-button py-1 text-red-700 font-bold">MC</button>
        <button type="button" onClick={() => handleDigitBackspace()} className="win3-button py-1">Back</button>
        <button type="button" onClick={clearEntry} className="win3-button py-1">CE</button>
        <button type="button" onClick={clearAll} className="win3-button py-1 text-red-700 font-bold">C</button>
        <button type="button" onClick={() => handleSpecial('negate')} className="win3-button py-1 font-bold">+/-</button>

        {/* Row 2 */}
        <button type="button" onClick={() => handleMemory('MR')} className="win3-button py-1 text-red-700 font-bold">MR</button>
        <button type="button" onClick={() => inputDigit('7')} className="win3-button py-1 font-bold text-blue-900 bg-white">7</button>
        <button type="button" onClick={() => inputDigit('8')} className="win3-button py-1 font-bold text-blue-900 bg-white">8</button>
        <button type="button" onClick={() => inputDigit('9')} className="win3-button py-1 font-bold text-blue-900 bg-white">9</button>
        <button type="button" onClick={() => performOperation('/')} className="win3-button py-1 text-red-700 font-bold">/</button>

        {/* Row 3 */}
        <button type="button" onClick={() => handleMemory('MS')} className="win3-button py-1 text-red-700 font-bold">MS</button>
        <button type="button" onClick={() => inputDigit('4')} className="win3-button py-1 font-bold text-blue-900 bg-white">4</button>
        <button type="button" onClick={() => inputDigit('5')} className="win3-button py-1 font-bold text-blue-900 bg-white">5</button>
        <button type="button" onClick={() => inputDigit('6')} className="win3-button py-1 font-bold text-blue-900 bg-white">6</button>
        <button type="button" onClick={() => performOperation('*')} className="win3-button py-1 text-red-700 font-bold">*</button>

        {/* Row 4 */}
        <button type="button" onClick={() => handleMemory('M+')} className="win3-button py-1 text-red-700 font-bold">M+</button>
        <button type="button" onClick={() => inputDigit('1')} className="win3-button py-1 font-bold text-blue-900 bg-white">1</button>
        <button type="button" onClick={() => inputDigit('2')} className="win3-button py-1 font-bold text-blue-900 bg-white">2</button>
        <button type="button" onClick={() => inputDigit('3')} className="win3-button py-1 font-bold text-blue-900 bg-white">3</button>
        <button type="button" onClick={() => performOperation('-')} className="win3-button py-1 text-red-700 font-bold">-</button>

        {/* Row 5 */}
        <button type="button" onClick={() => handleSpecial('sqrt')} className="win3-button py-1">sqrt</button>
        <button type="button" onClick={() => inputDigit('0')} className="win3-button py-1 font-bold text-blue-900 bg-white">0</button>
        <button type="button" onClick={inputDecimal} className="win3-button py-1 font-bold text-blue-900 bg-white">.</button>
        <button type="button" onClick={() => performOperation('=')} className="win3-button py-1 text-red-700 font-bold bg-[#ffff80]">=</button>
        <button type="button" onClick={() => performOperation('+')} className="win3-button py-1 text-red-700 font-bold">+</button>
      </div>
    </div>
  );

  function handleDigitBackspace() {
    retroAudio.playMineClick();
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  }
};
