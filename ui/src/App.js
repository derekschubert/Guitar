import React from 'react';
import './App.css';
import { ReducerProvider } from 'contexts/reducer';

import Loading from 'components/Loading';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from 'components/PrivateRoute';

import Guitar from 'views/Guitar';
import Settings from 'views/Settings';
import Profile from 'views/Settings/Profile';
import StateStorage from 'components/StateStorage';

import { Auth0Provider } from 'util/auth0';
import config from './auth_config.json';
import { history } from 'components/Router';

const App = () => {
  // Routes user to correct location after login
  const onRedirectCallback = appState => {
    history.replace(appState && appState.targetUrl ? appState.targetUrl : '/');
  };

  return (
    <div className="App">
      <Auth0Provider domain={config.domain}
        client_id={config.clientId}
        redirect_uri={window.location.origin}
        onRedirectCallback={onRedirectCallback}
      >
        <ReducerProvider>
          <Loading />
          <StateStorage />
          <Switch>
            <Route path='/' exact component={Guitar} />
            <PrivateRoute path="/settings" component={Settings} />
            <PrivateRoute path="/profile" component={Profile} />
          </Switch>
        </ReducerProvider>
      </Auth0Provider>
    </div>
  );
}

export default App;
