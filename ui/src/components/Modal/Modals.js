import React, { useContext, } from 'react';
import './Modals.css';

import { useAuth0 } from 'util/auth0';
import ReducerCtx from 'contexts/reducer';
import { displayTuning, } from 'util/music';

import { Link } from 'react-router-dom';
import SetTuning from 'components/SetTuning';
import { NumberInput } from 'components/Input';

/**
 * Modals defines all modal subcomponents, in addition to
 * many (if not all) content instances. 
 * - each completed modal MAY be moved to be a subcomponent of the
 *   module instantiating it.
 */


/**
 * Modal Subcomponents & Parts
 */

 /**
  * QuickSetting is a specific subcomponent for the SettingsModal for layout purposes
  * 
  * Props:
  * - label: string = null  (label text next to children)
  * - name: string*         (html name of input & label 'for', required)
  */
const QuickSetting = ({ label, children, name }) => {
  return (
    <div className='QuickSetting'>
      {label && <label htmlFor={name}>{label}</label>}
      {children}
    </div>
  );
};

/**
 * Predefined Modal Contents
 */

// Instantiated inside of components/Header
const SettingsModal = () => {
  const {state, dispatch} = useContext(ReducerCtx);
  const {
    capo,
    tuning,
    frets,
  } = state;

  const tuningText = displayTuning(tuning);

  return (
    <React.Fragment>
      <QuickSetting name='tuning' label='Tuning'>
        <SetTuning value={tuningText} onChange={(newTuning) => dispatch({type: 'setTuning', tuning: newTuning})} />
      </QuickSetting>
      <QuickSetting name='capo' label='Capo'>
        <NumberInput value={capo} name='capo' 
          onChange={(e) => dispatch({type: 'setCapo', capo: e.target ? e.target.value : e})}
        />
      </QuickSetting>
      <QuickSetting name='frets' label='Fret Count'>
        <NumberInput value={frets} name='frets' 
          onChange={(e) => dispatch({type: 'setFrets', frets: e.target ? e.target.value : e})}
        />
      </QuickSetting>
      <Link to='/settings' className='link'>View all settings</Link>
    </React.Fragment>
  );
};

// Instantiated inside of components/ProfileNav
const ProfileModal = () => {
  const { isAuthenticated, logout } = useAuth0();
  if (!isAuthenticated) return null;

  return (
    <div className='ProfileModal'>
      
      <button className='btn-link' onClick={logout}>Logout</button> 
      <br />
      <Link to='/profile'>View Profile</Link>
    </div>
  );
};

export {
  SettingsModal,
  ProfileModal
}