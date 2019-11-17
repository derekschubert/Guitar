import React from 'react';
import { Router, BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

class MyRouter extends BrowserRouter {
  render() {
    return (
      <Router history={history}>
        {this.props.children}
      </Router>
    );
  }
};

export default MyRouter;