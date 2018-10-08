import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Layout, Input, Button, Form, Divider } from 'antd'
import logo from '../constants/nav_logo_white.png'

import { PasswordForgetLink } from '../Pages/Profile/PasswordForget'
import { auth } from '../firebase'
import * as routes from '../constants/routes'
import './index.css'

const { Content, Header } = Layout;

const SignInPage = ({ history }) =>
  <div>
    <Header>
      <div style={{ height: '32px', right: 0, position: 'absolute', paddingRight: '30px' }}>
        <img src={logo} alt="My logo" style={{ height: '100%' }} />
      </div>
      <span style={{
        color: 'white',
        fontWeight: 'bold',
        fontSize: 'x-large'
      }}>
        Simpson Construction
      </span>

    </Header>
    <Content style={{ margin: '24px 16px', minHeight: '89vh', background: '#f3f3f3' }}>
      <div style={{ padding: 24, background: '#fff', height: '100%', maxWidth: '300px', margin: 'auto' }}>
        <h1>Sign In</h1>
        <SignInForm history={history} />
        <Divider />
        <h4><a style={{ color: '#4c4c4c' }} href='https://simcon.com.au/'>
          Click here to return to main website. <br /> https://simcon.com.au/
        </a></h4>
      </div>
      <a href="http://www.infosync.solutions">
        <div id="builtBy">
          Built by Info Sync Solutions
        </div>
      </a>
    </Content>
  </div>

const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const {
      email,
      password,
    } = this.state;

    const {
      history,
    } = this.props;

    auth.doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        history.push(routes.CLIENTPORTAL);
      })
      .catch(error => {
        this.setState(updateByPropertyName('error', error));
      });

    event.preventDefault();
  }

  render() {
    const {
      email,
      password,
      error,
    } = this.state;

    const isInvalid =
      password === '' ||
      email === '';

    return (
      <Form onSubmit={this.onSubmit} id="SignInForm">
        <Input
          id="SignInEmail"
          value={email}
          onChange={event => this.setState(updateByPropertyName('email', event.target.value))}
          type="text"
          placeholder="Email Address"
        />
        <Input
          id="SignInPassword"
          value={password}
          onChange={event => this.setState(updateByPropertyName('password', event.target.value))}
          type="password"
          placeholder="Password"
        />
        <PasswordForgetLink />
        <Button disabled={isInvalid} htmlType="submit" id='SignInButton'>
          Sign In
        </Button>
        {error && <p id="SignInError">{error.message}</p>}
      </Form>
    );
  }
}

export default withRouter(SignInPage);

export {
  SignInForm,
};
