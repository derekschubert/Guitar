import React, { useState, useContext } from 'react';
import './SubHeader.css';
import ReducerCtx from 'contexts/reducer';
import { allScales, notes, scales } from 'util/music';

const SubHeader = () => {
  const {state, dispatch} = useContext(ReducerCtx);
  const {
    findScale,
    selectedNotes,
  } = state;

  const showScales = selectedNotes.length >= 3;
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [filteredScales, setFilteredScales] = useState([]);

  // TODO: Optimize this so after first search it only 
  // searches all scales again if a note is removed
  // -- filters current list of potential scales
  // Also add user filters to limit to certain scales
  let foundScales = {};

  if (showScales) {
    // Get all scaleTypes that aren't filtered
    const scales = Object.getOwnPropertyNames(allScales).filter(k => 
      !filteredScales.includes(k)
    );
    
    // For each valid scaleType, search through all
    // root keys and find the scales that include all 
    // user inputted notes.
    scales.forEach(s => {
      Object.entries(allScales[s]).forEach(([k, v]) => {
        if (!filteredNotes.includes(parseInt(k))) {
          // check if scale includes all selected notes          
          if (selectedNotes.every(i => v.scale.includes(i))) {
            // instantiate scaleType arr if not yet rdy (major / minor)
            // push new scale into appropriate scaleType
            if (!foundScales[s]) foundScales[s] = [];
            foundScales[s].push(v);
          } 
        }
      });
    })
  }

  // TODO: on hover of a 'found' scale, preview the notes on the fretboard
  // by highlighting all notes of the scale w/ our green box shadow
  // (css already exists w/ hover, just need logic)
  const FoundScales = ({ found }) => (
    <div className='FoundScales'>
      <h3>Results</h3>
      <div className='scales'>
        {Object.entries(found).map(([k, v]) => (
          <div className='scale' key={k}>
            <h4>{k}</h4>
            <div className='roots'>
              {v.map(s => (
                <span key={s.full}
                  onClick={() => dispatch({
                    type: 'setFoundScale',
                    foundScale: s,
                  })}
                >
                  {s.full}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Specifically for Find Scale
  // if need others, move layouts to SubHeaders.js and add
  // appropriate logic
  return (
    <div className={`SubHeader ${findScale ? 'active' : ''}`}>
      <div className='filter'>
        <h3>Filter</h3>
        <div className='notes'>
          {notes.map((n, i) => {
            const isIncluded = filteredNotes.includes(i);
            return (
              <span key={n}
                className={isIncluded ? 'filtered' : ''}
                onClick={() => {
                  if (isIncluded) 
                    setFilteredNotes(filteredNotes.filter(j => j !== i));
                  else setFilteredNotes([...filteredNotes, i]);
                }}
              >
                {n}
              </span>
            );
          })}
        </div>
        <div className='scales'>
          {Object.entries(scales).map(([k, v]) => {
            const isIncluded = filteredScales.includes(v.name);

            return (
              <span key={k}
                className={isIncluded ? 'filtered' : ''}
                onClick={() => {
                  if (isIncluded)
                    setFilteredScales(filteredScales.filter(i => i !== v.name));
                  else setFilteredScales([...filteredScales, v.name]);
                }}
              >
                {v.name}
              </span>
            );
          })}
        </div>
      </div>
      <div className='results'>
        {showScales ? <FoundScales found={foundScales} /> : `Select ${3 - selectedNotes.length} more notes!`}
      </div>
    </div>
  );
};

export default SubHeader;