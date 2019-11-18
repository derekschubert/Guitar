import React, { useContext } from 'react';
import './String.css';
import ReducerCtx from 'contexts/reducer';

import Fret from 'components/Fret';

/**
 * String is responsible for generating all the Frets on its string
 * 
 * Props:
 * - openNote: int*         (index of note in notes array)
 * - mode: string = 'note' (note / position - either display frets & their associated notes, or display fret position)
 */
export default (props) => {
  const {state} = useContext(ReducerCtx);
  const {
    frets,
    capo,
    showFretsBeforeCapo,
    startFretCountAtCapo,
  } = state;

  const {
    openNote,
    mode = 'note',
  } = props;

  if (mode !== 'note' && mode !== 'position') {
    return console.error('Invalid position prop value in String component');
  }

  // Generate array w/ all fret notes in order,
  // starting from the given openNote.
  // (12 notes per octave)
  let fretNotes = [];
  for (let i = showFretsBeforeCapo ? 0 : capo; i <= frets; i++) {
    if (mode === 'note') fretNotes.push((i + openNote) % 12);
    else if (mode === 'position') fretNotes.push(i);
  }

  return (
    <div className={`String ${mode === 'position' ? 'position' : ''}`}>
      <div className='line'></div>
      {fretNotes.map((k, i) => (
        <Fret key={i} note={k} forceMute={showFretsBeforeCapo && i < capo}
          open={i === (showFretsBeforeCapo ? capo : 0)}
          mode={mode}
        />
      ))}
    </div>
  );
};