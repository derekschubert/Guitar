import React, { useState } from 'react';
import { notes } from 'util/music';
import './TuningInput.css';

// TODO: add comments
const TuningInput = (props) => {
  const {
    name,
    fullTuning,
    setFullTuning,  
  } = props;

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

export default TuningInput;