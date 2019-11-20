import React, { useState, useContext, useEffect, } from 'react';
import './SetTuning.css';
import { displayTuning, } from 'util/music';
import ReducerCtx from 'contexts/reducer';

// Components
import { IoIosArrowForward } from 'react-icons/io';
import {
  WithLabel, TuningInput, Checkbox, StringInput
} from 'components/Input';

const SetTuning = ({ value, onChange, style }) => {
  const { state, dispatch } = useContext(ReducerCtx);
  const {
    tuning,
    tunings,
  } = state;
  const [showDiv, setShowDiv] = useState(false);
  const [useCreateNew, setUseCreateNew] = useState(false);
  const [createName, setCreateName] = useState("");
  const [saveCreateNew, setSaveCreateNew] = useState(false);

  // Tuning Input Controls
  const [fullTuning, setFullTuning] = useState(tuning);
  useEffect(() => {
    setFullTuning(tuning);
  }, [tuning]);

  const setTuningHandler = () => {
    const newTuning = fullTuning.map(t => parseInt(t));

    if (saveCreateNew) {
      dispatch({ type: 'setAndSaveTuning', tuning: newTuning, name: createName });
    } else {
      dispatch({ type: 'setTuning', tuning: newTuning });
    }
    setShowDiv(false);
    setUseCreateNew(false);
  };
  // End Tuning Input Controls


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

  return (
    <div className='TuningQuickSetting' style={style}>
      <button onClick={() => setShowDiv(!showDiv)}>{value}</button>
      <div className={`select ${showDiv ? 'show' : ''}`}>
        <div className={`container ${useCreateNew ? 'create' : ''}`}>
          <div className='inner'>
            <div className={`create-new ${useCreateNew ? '' : 'hide'}`}>
              <WithLabel name='create-new-tuning'
                label='Tuning'
                position='top'
              >
                <TuningInput 
                  fullTuning={fullTuning} 
                  setFullTuning={setFullTuning} 
                />
              </WithLabel>
              <WithLabel name='create-new-save'
                label='Save tuning?'
                position='right' passProps={false}
              >
                <Checkbox checked={saveCreateNew} 
                  onClick={() => setSaveCreateNew(!saveCreateNew)}
                  style={{width: 'auto', marginRight: '12px'}}
                />
              </WithLabel>
              <WithLabel name='create-new-tuning-name'
                label='Name'
                position='top' className={`tuning-name${saveCreateNew ? '' : ' hide'}`}
              >
                <StringInput value={createName} 
                  onChange={(e) => setCreateName(e.target.value)}
                />
              </WithLabel>
            </div>
            <div className='options'>
              {tunings.map((t, i) => <Option key={i} tuning={t.tuning} name={t.name} />)}
            </div>
          </div>
        </div>
        <div className='controls'>
          <button className={useCreateNew ? 'btn-half' : ''}
            onClick={() => setUseCreateNew(!useCreateNew)}
          >
            {useCreateNew ? 'Cancel' : 'Create New'}
          </button>
          <button className='btn-half'
            onClick={setTuningHandler}
          >
            {saveCreateNew ? 'Save' : 'Set'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetTuning;