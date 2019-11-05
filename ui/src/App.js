import React from 'react';
import './App.css';
import { ReducerProvider } from 'contexts/reducer';

import Loading from 'components/Loading';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import PrivateRoute from 'components/PrivateRoute';

import Guitar from 'views/Guitar';
import Settings from 'views/Settings';
import Profile from 'views/Settings/Profile';
import StateStorage from 'components/StateStorage';

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <ReducerProvider>
          <Loading />
          <StateStorage />
          <Switch>
            <Route path='/' exact component={Guitar} />
            <PrivateRoute path="/settings" component={Settings} />
            <PrivateRoute path="/profile" component={Profile} />
          </Switch>
        </ReducerProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
