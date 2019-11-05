import React from 'react';
import './Settings.css';

import Header from 'components/Header';
import { NavLink } from 'react-router-dom';

const Settings = () => {
  return (
    <React.Fragment>
      <Header title='Settings' modules={['settings', 'profile']} />
      <div className='Settings'>
        <div className='sidebar'>
          <NavLink activeClassName='active' exact to='/profile'>Profile</NavLink>
          <NavLink activeClassName='active' exact to='/settings'>Settings</NavLink>
        </div>
        <div className='settings'>
          Lets list some settings!
        </div>
      </div>
    </React.Fragment>
  );
};

export default Settings;