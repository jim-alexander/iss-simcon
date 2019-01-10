import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import SignInPage from '../Session/SignIn';
import PasswordForgetPage from '../Pages/Profile/PasswordForget';
import ClientPortal from './ClientPortal';
import PlantVerificationPage from '../PlantVerification';
import withAuthentication from '../Session/withAuthentication';
import * as routes from '../constants/routes';

import './index.css';

import { Layout } from 'antd';

class App extends React.Component {
  render() {
    if (window.location.pathname.includes('plant-verification')) {
      return (
        <Router>
          <Layout>
            <Route path={routes.PLANTVERIFICATION} component={() => <PlantVerificationPage />} />
          </Layout>
        </Router>
      );
    } else if (window.location.pathname.includes('signin')){
      return (
        <Router>
          <Layout>
            <Route exact path={routes.SIGN_IN} component={() => <SignInPage />} />
            <Route exact path={routes.PASSWORD_FORGET} component={() => <PasswordForgetPage />} />
          </Layout>
        </Router>
      );
    } else {
      return (
        <Router>
          <Layout>
            <Route exact path={routes.SIGN_IN} component={() => <SignInPage />} />
            <Route exact path={routes.PASSWORD_FORGET} component={() => <PasswordForgetPage />} />
            <Route path={routes.CLIENTPORTAL} component={() => <ClientPortal />} />
          </Layout>
        </Router>
      );
    }
  }
}

export default withAuthentication(App);
