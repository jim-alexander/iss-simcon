import React from 'react'
import SignUp from './SignUp'
import { Tabs, Icon, Divider } from 'antd'
import { db } from '../../firebase'

import DeleteAccount from './DeleteAccount'
import PasswordChange from './PasswordChange'
import Loader from '../Loader'

class Profile extends React.Component {
  componentDidMount(){
    db.lastViewedPage(this.props.user.id, 'profile')
  }
  componentDidUpdate(){
    db.lastViewedPage(this.props.user.id, 'profile')
  }

  signUpForm = (role) => {
    if (role === 'admin') {
      return (
        <div>
          <SignUp />
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
        <Tabs defaultActiveKey="1">
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
