import React from 'react'
import { Tabs, Icon, Divider, Button, } from 'antd'
import { db } from '../../firebase'

import SignUp from './SignUp'
import Activity from './Activity'
import DeleteAccount from './DeleteAccount'
import PasswordChange from './PasswordChange'
import Loader from '../Loader'

class Profile extends React.Component {
  state = {
    createAccountVisible: false
  }
  componentDidMount() {
    db.lastViewedPage(this.props.user.id, 'profile')
  }
  componentDidUpdate() {
    db.lastViewedPage(this.props.user.id, 'profile')
  }
  showModal = () => {
    this.setState({
      createAccountVisible: true,
    });
  }

  handleOk = (e) => {
    console.log(e);
    this.setState({
      createAccountVisible: false,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      createAccountVisible: false,
    });
  }

  signUpForm = (role) => {
    if (role === 'admin') {
      return (
        <div>

          <Activity user={this.props.user} />
          <Button
            type="primary"
            ghost
            style={{ marginTop: 15 }}
            onClick={this.showModal}>
            Create Account
          </Button>
          <SignUp title="Create Account"
            visible={this.state.createAccountVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel} />
          <Divider />
        </div>
      )
    }
    else {
      return null
    }
  }

  render() {
    if (this.props.user.role === '') {
      return <Loader />
    }
    return (
      <div>
        <Tabs defaultActiveKey="2">
          <Tabs.TabPane tab={<span><Icon type="user" />Profile</span>} key="1">
            <h2>Username </h2>
            <p><Icon type="user" style={{ paddingRight: '10px' }} />  {this.props.user.username}</p>
            <h2>Email </h2>
            <p><Icon type="mail" style={{ paddingRight: '10px' }} />  {this.props.user.email}</p>
            <h2>Role</h2>
            <p><Icon type="tag-o" style={{ paddingRight: '10px' }} />  {this.props.user.role}</p>
          </Tabs.TabPane>
          <Tabs.TabPane tab={<span><Icon type="solution" />Account Management</span>} key="2">
            {this.signUpForm(this.props.user.role)}
            <PasswordChange />
            <Divider />
            <DeleteAccount />
          </Tabs.TabPane>
        </Tabs>

      </div>
    )
  }
}

export default Profile;
