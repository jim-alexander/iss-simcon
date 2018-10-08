import React, { Component } from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';

import { auth, db } from '../firebase';
import * as routes from '../constants/routes';
import { Input, Button, Form, Select } from 'antd';
import './index.css'

const Option = Select.Option;

const SignUpPage = ({ history }) =>
  <div>
    <h2>Create Account</h2>
    <SignUpForm history={history} />
  </div>

const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  role: '',
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUpForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const {
      role,
      username,
      email,
      passwordOne,
    } = this.state;

    const {
      history,
    } = this.props;

    auth.doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {

        // Create a user in your own accessible Firebase Database too
        db.doCreateUser(authUser.user.uid, username, email, role)
          .then(() => {
            this.setState(() => ({ ...INITIAL_STATE }));
            history.push(routes.CLIENTPORTAL);
          })
          .catch(error => {
            this.setState(updateByPropertyName('error', error));
          });

      })
      .catch(error => {
        this.setState(updateByPropertyName('error', error));
      });

    event.preventDefault();
  }

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      username === '' ||
      email === '';
    return (
      <Form onSubmit={this.onSubmit} id='signupForm'>
        <Select onChange={event => this.setState(updateByPropertyName('role', event))} className='somePadding' placeholder="Select a role">
          <Option value="client">Client</Option>
          <Option value="admin">Admin</Option>
          <Option value="maintenance">Maintenance</Option>
        </Select>
      <Input
          value={username}
          onChange={event => this.setState(updateByPropertyName('username', event.target.value))}
          type="text"
          placeholder="Name"
          className='somePadding'
        />
      <Input
          value={email}
          onChange={event => this.setState(updateByPropertyName('email', event.target.value))}
          type="text"
          placeholder="Email Address"
          className='somePadding'
        />
      <Input
          value={passwordOne}
          onChange={event => this.setState(updateByPropertyName('passwordOne', event.target.value))}
          type="password"
          placeholder="Password"
          className='somePadding'
        />
      <Input
          value={passwordTwo}
          onChange={event => this.setState(updateByPropertyName('passwordTwo', event.target.value))}
          type="password"
          placeholder="Confirm Password"
          className='somePadding'
        />
      <Button disabled={isInvalid} htmlType="submit" style={{maxWidth: 150, width: '100%'}}>
          Sign Up
        </Button>

        { error && <p>{error.message}</p> }
      </Form>
    );
  }
}

const SignUpLink = () =>
  <p>
    Don't have an account?
    {' '}
    <Link to={routes.SIGN_UP}>Sign Up</Link>
  </p>

export default withRouter(SignUpPage);

export {
  SignUpForm,
  SignUpLink,
};


// WEBPACK FOOTER //
// ./src/components/SignUp/index.js
