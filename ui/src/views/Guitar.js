import React from 'react';
import Header from 'components/Header';
import Fretboard from 'components/Fretboard';

/**
 * Guitar View is the core part of the app
 */
const Guitar = () => (
  <React.Fragment>
    <Header title='Fretboard' modules={['profile', 'settings', 'scale']} />
    <Fretboard />
  </React.Fragment>
);

export default Guitar;