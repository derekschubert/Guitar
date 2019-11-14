import React from 'react';
import './StringInput.css';

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

export default StringInput;