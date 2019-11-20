import { scales } from 'util/music';

const setCapo = (state, v) => {
  let newCapo;
  
  // User manually typed input or used arrow keys
  // vs User used increment/decrement buttons
  if (typeof(v) === 'string') {
    newCapo = parseInt(v);
  } else newCapo = parseInt(state.capo) + v;

  // Ensure capo is in valid range (high & low)
  if (newCapo < 0) newCapo = 0;
  if (newCapo >= state.frets) newCapo = state.frets - 1;
  
  return {
    ...state,
    capo: newCapo,
  };
};

const setFrets = (state, v) => {
  let newFrets;

  // User manually typed input or used arrow keys
  // vs User used increment/decrement buttons
  if (typeof(v) === 'string') {
    newFrets = parseInt(v);
  } else newFrets = parseInt(state.frets) + v;

  if (newFrets < 1) newFrets = 1;
  if (newFrets > 30) newFrets = 30;

  return {
    ...state,
    frets: newFrets,
  }
};

const setScaleNotes = (state, key, scale) => {
  let newScaleNotes = scales[scale].notes.map(ni => 
    (parseInt(key) + parseInt(ni)) % 12
  );

  return {
    ...state,
    scaleNotes: newScaleNotes,
    selectedScale: scale,
  };
};

const setFindScale = (state, findScale) => {
  if (findScale) return {
    ...state,
    findScale,
    selectedNotes: [],
  };

  return {
    ...state, 
    findScale,
  }
};

const setFoundScale = (state, scale) => {
  return {
    ...state,
    findScale: false,
    selectedNotes: [],
    useScale: true,
    scaleNotes: scale.scale,
    selectedScale: scale.scaleType,
  }
};

const setAndSaveTuning = (state, tuning, name) => {
  return {
    ...state,
    tuning,
    tunings: [...state.tunings, {tuning, name}],
  };
}

export {
  setCapo,
  setFrets,
  setScaleNotes,
  setFindScale,
  setFoundScale,
  setAndSaveTuning,
};