import React, { useContext } from 'react';
import './Loading.css';

import ReducerCtx from 'contexts/reducer';
import { useAuth0 } from 'util/auth0';

// TODO: Stop this loader from being rerendered an 6x...
const Loading = () => {
  const { loading } = useAuth0();
  const {state} = useContext(ReducerCtx);

  /* eslint-disable jsx-a11y/heading-has-content */
  return (
    <div className={`Loading ${(loading || !state.loaded) ? 'loading' : 'finished'}`}>
      <h1 aria-label='loading'></h1>
    </div>
  );
  /* eslint-enable jsx-a11y/heading-has-content */
}

export default Loading;