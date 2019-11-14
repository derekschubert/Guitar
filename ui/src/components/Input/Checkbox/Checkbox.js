import React from 'react';
import './Checkbox.css';

const Checkbox = ({ checked, onClick, name, style }) => (
  <div className='Checkbox'>
    <span className={checked ? 'checked' : ''} 
      onClick={onClick} name={name} style={style}
    ></span>
  </div>
);

export default Checkbox;