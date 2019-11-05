import React, { useState, useContext, } from 'react';
import './Modals.css';

import { useAuth0 } from 'util/auth0';
import ReducerCtx from 'contexts/reducer';
import { displayTuning, } from 'util/music';

import { Link } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';
import { 
  WithLabel, NumberInput, StringInput, TuningInput,
} from 'components/Input';

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

// Instantiated inside SettingsModal
const TuningQuickSetting = ({ value, onChange }) => {
  const [showDiv, setShowDiv] = useState(false);

  const Option = ({ tuning, name }) => {
    const [toggle, setToggle] = useState(true);
    const tuningText = displayTuning(tuning);
    return (
      <div className='Option'>
        <div className='outer'>
          <div className={`inner ${toggle ? 'inner-active' : ''}`}
            onClick={() => {onChange(tuning); setShowDiv(false);}}
          >
            <span className='tuning'>{tuningText}</span>
            <span className='name'>{name}</span>
          </div>
        </div>
        <button className={`toggle ${toggle ? '' : 'toggle-inactive'}`}
          onClick={() => setToggle(!toggle)}
        >
          <IoIosArrowForward />
        </button>
      </div>
    );
  };

  const [useCreateNew, setUseCreateNew] = useState(false);
  const [createName, setCreateName] = useState("");
  const [saveCreateNew, setSaveCreateNew] = useState(false);
  return (
    <div className='TuningQuickSetting'>
      <button onClick={() => setShowDiv(!showDiv)}>{value}</button>
      <div className={`select ${showDiv ? 'show' : ''}`}>
        <div className={`container ${useCreateNew ? 'create' : ''}`}>
          <div className='inner'>
            <div className={`create-new ${useCreateNew ? '' : 'hide'}`}>
              <WithLabel name='create-new-tuning'
                label='Tuning'
                position='top'
              >
                <TuningInput />
              </WithLabel>
              {saveCreateNew && <WithLabel name='create-new-tuning-name'
                label='Name'
                position='top'
              >
                <StringInput value={createName} 
                  onChange={(e) => setCreateName(e.target.value)}
                />
              </WithLabel>}
              <WithLabel name='create-new-save'
                label='Save tuning?'
                position='right' passProps={false}
              >
                <input type='checkbox' checked={saveCreateNew} 
                  name='create-new-save' style={{width: 'auto', marginRight: '12px'}}
                  onChange={(e) => setSaveCreateNew(e.target.checked)} 
                />
              </WithLabel>
            </div>
            <div className='options'>
              <Option tuning={[4, 9, 2, 7, 11, 4]} name={'Standard'} />
              <Option tuning={[2, 9, 4, 9, 1, 4]} name={'A Passing Feeling'} />
            </div>
          </div>
        </div>
        <div className='controls'>
          <button className={useCreateNew ? 'btn-half' : ''}
            onClick={() => setUseCreateNew(!useCreateNew)}
          >
            {useCreateNew ? 'Cancel' : 'Create New'}
          </button>
          <button className='btn-half'>
            {saveCreateNew ? 'Save' : 'Set'}
          </button>
        </div>
      </div>
    </div>
  );
};

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
      <QuickSetting name='capo' label='Capo'>
        <NumberInput value={capo} name='capo' 
          onChange={(e) => dispatch({type: 'setCapo', capo: e.target ? e.target.value : e})}
        />
      </QuickSetting>
      <QuickSetting name='tuning' label='Tuning'>
        <TuningQuickSetting value={tuningText} onChange={(newTuning) => dispatch({type: 'setTuning', tuning: newTuning})} />
      </QuickSetting>
      <QuickSetting name='frets' label='Fret Count'>
        <NumberInput value={frets} name='frets' 
          onChange={(e) => dispatch({type: 'setFrets', frets: e.target ? e.target.value : e})}
        />
      </QuickSetting>
      <button className='btn-link'>View all settings</button>
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