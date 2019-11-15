import React from 'react';
import './Select.css';

/**
 * Select props:
 * - value: any*      (value of the select input, required)
 * - onChange: func*  (function to change value, required)
 * - style
 */
const Select = ({ value, onChange, options, style }) => {
  return (
    <div className='Select' style={style}>
      <select value={value} onChange={onChange}>
        {options.map((v, i) => (
          <option key={i} value={v[0]}>{v[1]}</option>
        ))}
      </select>
    </div>
  );
};

export default Select;