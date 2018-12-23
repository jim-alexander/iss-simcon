import React, { Component } from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';

import { auth, db } from '../../firebase';
import * as routes from '../../constants/routes';
import { Input, Button, Form, Select, Modal, Divider, Row, Col, message } from 'antd';
import './index.css'

const Option = Select.Option;

const SignUpPage = ({ history, title, visible, onOk, onCancel }) =>
  <div>
    <SignUpForm history={history} title={title} visible={visible} onOk={onOk} onCancel={onCancel} />
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

    auth.doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {

        // Create a user in your own accessible Firebase Database too
        db.doCreateUser(authUser.user.uid, username, email, role)
          .then(() => {
            this.setState(() => ({ ...INITIAL_STATE }));
            message.info(`You have been signed in as:  ${username}`);
            this.props.onOk()
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
      <Modal
        title={this.props.title}
        visible={this.props.visible}
        onOk={this.props.onOk}
        onCancel={this.props.onCancel}
        footer={null}
      >
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
          {error && <p>{error.message}</p>}
          <Divider />
          <Row gutter={10}>
            <Col span={12}>
            <Button key="back" onClick={this.props.onCancel}>Cancel</Button>
            </Col>
            <Col span={12}>
              <Button disabled={isInvalid} htmlType="submit" type='primary' style={{ maxWidth: 150, width: '100%' }}>
                Sign Up
              </Button>
            </Col>
          </Row>

        </Form>
      </Modal>

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

