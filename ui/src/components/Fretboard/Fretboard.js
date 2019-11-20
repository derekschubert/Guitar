import React, { useContext } from 'react';
import './Fretboard.css';
import ReducerCtx from 'contexts/reducer';

import String from 'components/String';

/**
 * Fretboard
 *
 */
const Fretboard = () => {
  const {state} = useContext(ReducerCtx);
  const {
    tuning,
    showFretCountAbove,
    showFretCountBelow,
  } = state;

  return (
    <div className='Fretboard-container'>
      <div className='Fretboard'>
        {showFretCountBelow && <String openNote={0} mode='position' />}
        {tuning.map((k, i) => <String key={i} openNote={k} />)}
        {showFretCountAbove && <String openNote={0} mode='position' />}
      </div>
    </div>
  );
};

export default Fretboard;