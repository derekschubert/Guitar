import React from 'react';
import './WithLabel.css';

/**
 * WithLabel wraps around any input (html or component) and adds a label in the specified position
 * 
 * Props:
 * - label: string*          (label text)
 * - name: string*           (htmlName tag applied to label & passed on to children)
 * - position: string = left (position of the label relative to input - 'top' / 'left' / 'right' / 'bottom')
 * - passProps: bool = true  (clone children and pass all props through)
 * - className: string = ''  (className to apply to html)
 * - *                       (any additional props to be passed to child elements)
 */
const WithLabel = (props) => {
  const {
    label,
    name,
    children,
    position = 'left',
    passProps = true,
    className = '',
  } = props;

  if (!label) return console.error('WithLabel must have a defined label prop!');
  if (!name) return console.error('WithLabel must have a defined name prop!');
  
  return (
    <div className={`WithLabel ${position} ${className}`}>
      <label name={name}>{label}</label>
      {!passProps && children}
      {passProps && React.Children.map(children, child => React.cloneElement(child, {
        ...props,
      }))}
    </div>
  );
};

export default WithLabel;