import React, { useContext, } from 'react';
import './Settings.css';
import ReducerCtx from 'contexts/reducer';
import { displayTuning, } from 'util/music';
import { stringToBool } from 'util/conversion';

import Header from 'components/Header';
import { WithLabel, NumberInput, Select,
} from 'components/Input';
import SetTuning from 'components/SetTuning';
import { NavLink } from 'react-router-dom';

const Settings = () => {
  const {state, dispatch} = useContext(ReducerCtx);
  const {
    tuning,
    strings,
    frets,
    capo,
    showFretsBeforeCapo,
    showFretCountAbove,
    showFretCountBelow,
    startFretCountAtCapo,
  } = state;
  const tuningText = displayTuning(tuning);

  const Title = ({ children }) => (
    <h4 className='settings-title'>{children}</h4>
  );
  const marginLeft = {marginLeft: 'auto'}

  return (
    <React.Fragment>
      <Header title='Settings' modules={['settings', 'profile']} />
      <div className='Settings'>
        <div className='sidebar'>
          <NavLink activeClassName='active' exact to='/profile'
            className='link block'
          >
            Profile
          </NavLink>
          <NavLink activeClassName='active' exact to='/settings'
            className='link block'
          >
            Settings
          </NavLink>
          <hr />
          <NavLink activeClassName='active' exact to='/chords'
            className='link block'
          >
            Chord Book
          </NavLink>
          <NavLink activeClassName='active' exact to='/presets'
            className='link block'
          >
            Presets
          </NavLink>
        </div>
        <div className='settings'>
          <Title>Guitar</Title>
          <WithLabel label='Tuning' name='tuning'>
            <SetTuning value={tuningText} style={marginLeft}
              onChange={(newTuning) => dispatch({type: 'setTuning', tuning: newTuning})} 
            />
          </WithLabel>
          <hr />
          <WithLabel label='String count' name='string-count'>
            <NumberInput value={strings} style={marginLeft}
              onChange={(e) => dispatch({type: 'setStrings', strings: e.target ? e.target.value : e})}
            />
          </WithLabel>
          <hr />
          <WithLabel label='Fret count' name='fret-count'>
            <NumberInput value={frets} style={marginLeft}
              onChange={(e) => dispatch({type: 'setFrets', frets: e.target ? e.target.value : e})}
            />
          </WithLabel>
          <hr />
          <WithLabel label='Capo position' name='capo-position'>
            <NumberInput value={capo} style={marginLeft}
              onChange={(e) => dispatch({type: 'setCapo', capo: e.target ? e.target.value : e})}
            />
          </WithLabel>

          <Title>Fretboard</Title>
          <WithLabel label='Show strings before capo' name='show-strings-before-capo'>
            <Select value={showFretsBeforeCapo} style={marginLeft}
              options={[[true, 'Yes'], [false, 'No']]}
              onChange={(e) => dispatch({type: 'setShowFretsBeforeCapo', value: stringToBool(e.target.value)})}
            />
          </WithLabel>
          <hr />
          <WithLabel label='Show fret counter ABOVE fretboard' name='fret-counter-above'>
            <Select value={showFretCountAbove} style={marginLeft}
              options={[[true, 'Yes'], [false, 'No']]}
              onChange={(e) => dispatch({type: 'setShowFretCountAbove', value: stringToBool(e.target.value)})}
            />
          </WithLabel>
          <hr />
          <WithLabel label='Show fret counter BELOW fretboard' name='fret-counter-below'>
            <Select value={showFretCountBelow} style={marginLeft}
              options={[[true, 'Yes'], [false, 'No']]}
              onChange={(e) => dispatch({type: 'setShowFretCountBelow', value: stringToBool(e.target.value)})}
            />
          </WithLabel>
          <hr />
          <WithLabel label='Start fret counter at capo position' name='fret-counter-capo'>
            <Select value={startFretCountAtCapo} style={marginLeft}
              options={[[true, 'Yes'], [false, 'No']]}
              onChange={(e) => dispatch({type: 'setStartFretCountAtCapo', value: stringToBool(e.target.value)})}
            />
          </WithLabel>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Settings;