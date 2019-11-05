import React, { useState, useRef, useEffect, useContext, } from 'react';
import './Header.css';
import { notes, scales } from 'util/music';
import ReducerCtx from 'contexts/reducer';

import Modal, { SettingsModal } from 'components/Modal';
import SubHeader from 'components/SubHeader';
import ProfileNav from 'components/ProfileNav';

// Icon
import { IoIosSettings, IoIosSearch } from 'react-icons/io';

/**
 * Header
 * 
 */
export default (props) => {
  const {state, dispatch} = useContext(ReducerCtx);
  const {
    findScale,
    useScale,
    selectedScale,
    scaleNotes,
  } = state;

  const {
    title,
    modules,
  } = props;

  const [openSettingsModal, setOpenSettingsModal] = useState(false);
  const settingsRef = useRef(null);

  const NavLink = ({btnRef, icon, title, onClick, active, id}) => (
    <li className='NavLink'>
      <button ref={btnRef} onClick={onClick} id={id}
        className={active ? 'active' : ''}
      >
        {icon}
        <span className='title'>{title}</span>
      </button>
    </li>
  );

  // Start SetScale component related things
  const [openSetScale, setOpenSetScale] = useState(false);
  const setScaleRef = useRef(null);
  const isEventListenerActive = useRef(false);

  const onClickHandler = (e) => {
    if (setScaleRef.current && !setScaleRef.current.contains(e.target)) setOpenSetScale(false);
  };

  useEffect(() => {
    if (isEventListenerActive.current && !openSetScale) {
      document.removeEventListener('mousedown', onClickHandler, false);
      isEventListenerActive.current = false;
    } else if (!isEventListenerActive.current && openSetScale) {
      document.addEventListener('mousedown', onClickHandler, false);
      isEventListenerActive.current = true;
    }
  }, [openSetScale]);
  
  const SetScale = () => {
    return (
      <li id='SetScaleLi' ref={setScaleRef}>
        <div className='SetScale'
          onClick={() => setOpenSetScale(true)}
        >
          {!openSetScale && !useScale && <span>None</span>}
          {openSetScale && (
            <input type='checkbox' checked={useScale} 
              onChange={(e) => dispatch({type: 'setUseScale', useScale: e.target.checked})}
            />
          )}
          {!openSetScale && useScale && <span>{notes[scaleNotes[0]].toUpperCase()}</span>}
          {openSetScale && (
            <select value={scaleNotes[0]} 
              onChange={(e) => dispatch({
                type: 'setScaleNotes', 
                key: e.target.value, 
                scale: selectedScale
              })}
            >
              {notes.map((n, i) => <option key={i} value={i}>
                {n.toUpperCase()}
              </option>)}
            </select>
          )}
          {!openSetScale && useScale && <span>{scales[selectedScale].short}</span>}
          {openSetScale && (
            <select value={selectedScale} 
              onChange={(e) => dispatch({
                type: 'setScaleNotes', 
                key: scaleNotes[0], 
                scale: e.target.value,
              })}
            >
              {Object.getOwnPropertyNames(scales).map(k => <option key={k} value={k}>
                {scales[k].name}
              </option>)}
            </select>
          )}
        </div>
      </li>
    );
  };
  // End SetScale component things

  return (
    <React.Fragment>
      <header className='Header'>
        <h1 id='logo'>Guitar</h1>
        <div className='title'>{title}</div>
        <div className='navigation'>
          <nav>
            <ul>
              {modules.includes('scale') && (
                <React.Fragment>
                  <SetScale />
                  <NavLink icon={<IoIosSearch />} active={findScale}
                    onClick={() => dispatch({type: 'setFindScale', findScale: !findScale})}
                  />
                </React.Fragment>
              )}
              {modules.includes('settings') && (
                <NavLink btnRef={settingsRef} icon={<IoIosSettings />}
                  onClick={() => setOpenSettingsModal(true)} 
                  active={openSettingsModal} id='settings'
                />
              )}
              {modules.includes('profile') && (
                <ProfileNav />
              )}
            </ul>
          </nav>
        </div>
      </header>
      <SubHeader />
      <Modal open={openSettingsModal} 
        closeFn={() => setOpenSettingsModal(false)} 
        refEl={settingsRef} position={{y: 24}}
        fixed='right' edgeMargin={8}
      >
        <SettingsModal />
      </Modal>
    </React.Fragment>
  );
};