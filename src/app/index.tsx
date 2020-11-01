/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import { GlobalStyle } from 'styles/global-styles';

import { HomePage } from './containers/HomePage/Loadable';
// import { NotFoundPage } from './components/NotFoundPage/Loadable';

import 'bootstrap/dist/css/bootstrap.min.css';

export function App() {
  return (
    <BrowserRouter>
      <Helmet titleTemplate="%s - Germicule" defaultTitle="Germicule">
        <meta
          name="description"
          content="Visualise your contacts and their covid risk factors"
        />
      </Helmet>

      <Switch>
        <Route component={HomePage} />
        {/* <Route component={NotFoundPage} /> */}
      </Switch>
      <GlobalStyle />
    </BrowserRouter>
  );
}
