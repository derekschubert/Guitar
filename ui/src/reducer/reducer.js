import { useReducer } from 'react';
import { setCapo, setFrets, setScaleNotes, 
  setFindScale, setFoundScale, setAndSaveTuning,
} from './settings';
import { saveState } from 'reducer/storage';

const initialState = {
  capo: 0,
  frets: 12,
  tuning: [2, 9, 4, 9, 1, 4],
  tunings: [{name: 'Standard', tuning: [4, 9, 2, 7, 11, 4]}, {name: 'A Passing Feeling', tuning: [2, 9, 4, 9, 1, 4]}],
  strings: 6,
  showFretsBeforeCapo: true,
  showFretCountAbove: true,
  showFretCountBelow: true,
  startFretCountAtCapo: true,
  findScale: false,
  selectedNotes: [],
  scaleNotes: [0, 2, 4, 5, 7, 9, 11],
  selectedScale: 'major',
  useScale: false,
};

const reducer = (state, action) => {
  const actions = {
    setCapo: () => setCapo(state, action.capo),

    setTuning: () => ({...state, tuning: action.tuning}),

    setAndSaveTuning: () => setAndSaveTuning(state, action.tuning, action.name),

    setStrings: () => ({...state, strings: action.strings}),

    setFrets: () => setFrets(state, action.frets),

    setShowFretsBeforeCapo: () => ({...state, showFretsBeforeCapo: action.value}),

    setShowFretCountAbove: () => ({...state, showFretCountAbove: action.value}),

    setShowFretCountBelow: () => ({...state, showFretCountBelow: action.value}),

    setStartFretCountAtCapo: () => ({...state, startFretCountAtCapo: action.value}),

    setFindScale: () => setFindScale(state, action.findScale),

    setFoundScale: () => setFoundScale(state, action.foundScale),

    setSelectedNotes: () => ({...state, selectedNotes: action.selectedNotes}),

    setScaleNotes: () => setScaleNotes(state, action.key, action.scale),

    setUseScale: () => ({...state, useScale: action.useScale}),

    loadState: () => ({...state, ...action.loadedState, loaded: true,}),

    saveState: () => { saveState(state, action.isAuthenticated, action.user); return state; },

    default: () => {
      console.error('Default reducer method hit');
      return {...state};
    },
  };

  return (actions[action.type] || actions.default)();
};

export default () => useReducer(reducer, initialState);