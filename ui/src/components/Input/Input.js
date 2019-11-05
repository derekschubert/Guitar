import React, { useState } from 'react';
import './Input.css';
import { notes } from 'util/music';

/**
 * WithLabel wraps around any input (html or component) and adds a label in the specified position
 * 
 * Props:
 * - label: string*          (label text)
 * - name: string*           (htmlName tag applied to label & passed on to children)
 * - position: string = left (position of the label relative to input - 'top' / 'left' / 'right' / 'bottom')
 * - passProps: bool = true  (clone children and pass all props through)
 * - *                       (any additional props to be passed to child elements)
 */
const WithLabel = (props) => {
  const {
    label,
    name,
    children,
    position = 'left',
    passProps = true,
  } = props;

  if (!label) return console.error('WithLabel must have a defined label prop!');
  if (!name) return console.error('WithLabel must have a defined name prop!');
  
  return (
    <div className={`WithLabel ${position}`}>
      <label name={name}>{label}</label>
      {!passProps && children}
      {passProps && React.Children.map(children, child => React.cloneElement(child, {
        ...props,
      }))}
    </div>
  );
};

/**
 * NumberInput is an input with btns on either side of the input
 * 
 * Props:
 * - value: int*      (value of the input, required)
 * - onChange: func*  (function to change value, required)
 */
const NumberInput = ({ value, onChange }) => {
  if (value === null) return console.error('NumberInput requires the value prop!');
  if (onChange === null) return console.error('NumberInput requires the onChange prop!');

  return (
    <div className='NumberInput'>
      <button onClick={() => onChange(-1)}>-</button>
      <input type='number' value={value}
        onChange={(e) => onChange(e)}
      />
      <button onClick={() => onChange(1)}>+</button>
    </div>
  );
};

/**
 * StringInput is a standard stylized text input
 * 
 * Props:
 * - value: int*      (value of the input, required)
 * - onChange: func*  (function to change value, required)
 */
const StringInput = ({ value, onChange, name }) => {
  if (value === null) return console.error('StringInput requires the value prop!');
  if (onChange === null) return console.error('StringInput requires the onChange prop!');

  return (
    <div className='StringInput'>
      <input type='text' value={value} 
        onChange={(e) => onChange(e)} 
        name={name}
      />
    </div>
  );
};

const TuningInput = (props) => {
  const {
    name,  
  } = props;

  const [fullTuning, setFullTuning] = useState([2, 9, 4, 9, 1, 4]);
  const setTuning = (newNote, index) => {
    let newTuning = [...fullTuning];
    newTuning[index] = newNote;
    setFullTuning(newTuning);
  };

  const Tuning = ({ tuning, setTuning }) => {
    return (
      <select value={tuning} className='Tuning'
        onChange={(e) => {
          e.preventDefault();
          setTuning(e);
        }}
      >
        {notes.map((n, i) => (
          <option key={i} value={i}>{n}</option>
        ))}
      </select>
    );
  };

  return (
    <div className='TuningInput' name={name}>
      {fullTuning.map((n, i) => (
        <Tuning key={i} tuning={n}
          setTuning={(e) => setTuning(e.target.value, i)}
        />
      ))}
    </div>
  );
};

export {
  WithLabel,
  NumberInput,
  StringInput,
  TuningInput,
};