import React, { Component } from 'react'
import { auth } from '../../firebase'
import { Input, Button, Form, message } from 'antd'


const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  successMessage = () => {
    message.success('Password successfully changed.');
  };
  errorMessage = (err) => {
    message.error('Error: ', err);
  };

  onSubmit = (event) => {
    const { passwordOne } = this.state;

    auth.doPasswordUpdate(passwordOne)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        this.successMessage()
      })
      .catch(error => {
        this.setState(updateByPropertyName('error', error));
        this.errorMessage(error)
      });

    event.preventDefault();
  }

  render() {
    const {
      passwordOne,
      passwordTwo,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '';

    return (
      <Form onSubmit={this.onSubmit} style={{maxWidth: 300}}>
        <h2>Change Password</h2>
        <Input
          value={passwordOne}
          onChange={event => this.setState(updateByPropertyName('passwordOne', event.target.value))}
          type="password"
          placeholder="New Password"
          style={{marginBottom: 10}}
        />
        <Input
          value={passwordTwo}
          onChange={event => this.setState(updateByPropertyName('passwordTwo', event.target.value))}
          type="password"
          placeholder="Confirm New Password"
          style={{marginBottom: 10}}
        />
        <Button disabled={isInvalid} htmlType="submit">
          Reset My Password
        </Button>
      </Form>
    );
  }
}

export default PasswordChangeForm;
