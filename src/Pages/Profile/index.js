import React from 'react'
import SignUp from '../../Session/SignUp'
import { Tabs, Icon, Divider } from 'antd'

import PasswordChange from './PasswordChange'
import Loader from '../Loader'

class Profile extends React.Component {
    accountManagement = () => {
      if (this.props.user.role === 'admin') {
        return (
          <Tabs.TabPane tab={<span><Icon type="solution" />Account Management</span>} key="2">
            <SignUp />
            <Divider />
            <h2>Delete account</h2>
            <h3>Coming soon...</h3>
          </Tabs.TabPane>
        )
      }
      else {
        return null
      }
    }

  render () {
    if (this.props.user.role === '') {
      return <Loader />
    }
    return(
      <div>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab={<span><Icon type="user" />Profile</span>} key="1">
            <h2>Username </h2>
            <p><Icon type="user" style={{paddingRight: '10px'}}/>  {this.props.user.username}</p>
            <h2>Email </h2>
            <p><Icon type="mail" style={{paddingRight: '10px'}}/>  {this.props.user.email}</p>
            <h2>Role</h2>
            <p><Icon type="tag-o" style={{paddingRight: '10px'}} />  {this.props.user.role}</p>
          </Tabs.TabPane>
          {this.accountManagement()}
          <Tabs.TabPane tab={<span><Icon type="key" />Password</span>} key="3">
            <PasswordChange />
          </Tabs.TabPane>
        </Tabs>

      </div>
    )
  }
}

export default Profile;
