import React, { useContext, } from 'react';
import './Fret.css';
import ReducerCtx from 'contexts/reducer';

import { notes } from 'util/music';

/**
 * Fret props:
 * - note: int*                 (index of note in notes array [starts from C])
 * - open: bool = false         (if note is the string's open note)
 * - isSelected: bool = false   (whether note was selected by user)
 * - mode: string = 'note'      (passed down from String component, whether to display music note or position)
 */
export default (props) => {
  const { state, dispatch } = useContext(ReducerCtx);
  const {
    findScale,
    selectedNotes,
    scaleNotes,
    useScale,
  } = state;

  const {
    note,
    open = false, 
    mode = 'note'
  } = props;

  if (note === null) console.error('Fret component requires a Note prop!');
  
  let fretClass = 'Fret';
  fretClass += open ? ' open' : ' standard';
  fretClass += mode === 'position' ? ' position' : ' regular';
  fretClass += findScale ? ' find-scale' : '';
  fretClass += (findScale && selectedNotes.includes(note)) ? ' selected': '';
  
  let muted = false;
  if (mode !== 'position' && !findScale && useScale && !scaleNotes.includes(note)) {
    muted = true;
    fretClass += ' muted';
  }

  const NoteJSX = () => {
    if (muted) return (<span className='note'>x</span>);

    return notes[note].length === 2 ?
      (<span className='note'>
        {notes[note][0]}
        <span className='sharp'>#</span>
      </span>)
      : (<span className='note'>{notes[note]}</span>);
  }

  const PositionJSX = () => <span className='note'>
    {note}
  </span>;

  const fretClickHandler = () => {
    if (findScale) {
      // Includes note? Remove it!
      if (selectedNotes.includes(note)) {
        dispatch({
          type: 'setSelectedNotes', 
          selectedNotes: selectedNotes.filter(v => v !== note),
        });
      } else { // Doesn't include note? Add it!
        dispatch({
          type: 'setSelectedNotes',
          selectedNotes: [...selectedNotes, note],
        });
      }
    }
  };

  return (
    <div className={fretClass}
      onClick={fretClickHandler}
    >
      {mode === 'note' && <NoteJSX />}
      {mode === 'position' && <PositionJSX />}
    </div>
  );
};