import React, { useContext } from 'react';
import './Fretboard.css';
import ReducerCtx from 'contexts/reducer';

import String from 'components/String';

/**
 * Fretboard
 *
 */
export default () => {
  const {state} = useContext(ReducerCtx);
  const {
    tuning,
  } = state;

  return (
    <div className='Fretboard-container'>
      <div className='Fretboard'>
        <String openNote={0} mode='position' />
        {tuning.map((k, i) => <String key={i} openNote={k} />)}
        <String openNote={0} mode='position' />
      </div>
    </div>
  );
};