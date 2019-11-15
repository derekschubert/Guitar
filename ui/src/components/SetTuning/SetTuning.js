import React, { useState, } from 'react';
import './SetTuning.css';
import { displayTuning, } from 'util/music';

// Components
import { IoIosArrowForward } from 'react-icons/io';
import {
  WithLabel, TuningInput, Checkbox, StringInput
} from 'components/Input';

const SetTuning = ({ value, onChange, style }) => {
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
                <TuningInput />
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
              {/* TODO: pull from state/api */}
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

export default SetTuning;