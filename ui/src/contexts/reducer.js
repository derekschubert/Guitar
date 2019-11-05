import React, { createContext } from 'react';
import reducer from 'reducer';

const ReducerCtx = createContext({});

const ReducerProvider = ({ children }) => {
  const [state, dispatch] = reducer();

  return (
    <ReducerCtx.Provider value={{ state, dispatch }}>
      {children}
    </ReducerCtx.Provider>
  );
};

export { ReducerProvider, };
export default ReducerCtx;