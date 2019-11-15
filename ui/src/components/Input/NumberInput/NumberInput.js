import React from 'react';
import './NumberInput.css';

/**
 * NumberInput is an input with btns on either side of the input
 * 
 * Props:
 * - value: int*      (value of the input, required)
 * - onChange: func*  (function to change value, required)
 * - style
 */
const NumberInput = ({ value, onChange, style }) => {
  if (value === null) return console.error('NumberInput requires the value prop!');
  if (onChange === null) return console.error('NumberInput requires the onChange prop!');

  return (
    <div className='NumberInput' style={style}>
      <button onClick={() => onChange(-1)}>-</button>
      <input type='number' value={value}
        onChange={(e) => onChange(e)}
      />
      <button onClick={() => onChange(1)}>+</button>
    </div>
  );
};

export default NumberInput;