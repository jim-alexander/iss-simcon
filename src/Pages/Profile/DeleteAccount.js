import React, { Component } from 'react'
import { Button, Popconfirm, message } from 'antd'
import { firebase, auth, db } from '../../firebase'

export default class DeleteAccount extends Component {

  deleteUser = () => {
    
  }

  promptConfirm(e) {
    console.log(e);
    if (firebase.auth.currentUser) {
      var id = firebase.auth.currentUser.uid
      auth.doDeleteUser().then(() => {
        db.deleteUser(id).then(() => {
          console.log("User has been deleted.");
          message.success('User has been deleted.');
        }).catch((err) => {
          console.log(err);
          message.error('This user has to have logged in recently to be deleted. Please logout and in again to delete account.');
        })
      })
    }
  }

  promptCancel(e) {
    console.log(e);
    message.error('User not deleted.');
  }

  render() {
    console.log();

    return (
      <div style={{ maxWidth: 300 }}>
        <h2>Delete Account</h2>
        <p>This is permanent</p>

        <Popconfirm title="Are you sure delete this user?" onConfirm={this.promptConfirm} onCancel={this.promptCancel} okText="Yes" cancelText="No">
          <Button type="danger"  style={{maxWidth: 150, width: '100%'}}>
            Delete
          </Button>
        </Popconfirm>

      </div>
    )
  }
}
