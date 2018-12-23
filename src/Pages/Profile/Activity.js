import React, { Component } from 'react'
import { db } from '../../firebase'
import { Table } from 'antd'
import { userActivity } from './columns'

export default class Activity extends Component {
  state = {
    userData: []
  }
  componentDidMount() {
    this.loadUserActivityData()
  }
  loadUserActivityData() {
    db.onceGetUsers()
      .then(val => {
        Object.entries(val.val()).forEach(user => {
          if (user[0] !== this.props.user.id && user[0] !== '13nBwfjw44ZOM76bEFrnXsyy1ij1') {
            this.setState({
              userData: [...this.state.userData,{
                id: user[0],
                user: user[1],
              }]
            })
          }
        })        
      })
  }

  render() {        
    return (
      <div>
        <h2>Active Accounts</h2>
        <Table 
          columns={userActivity(db.deleteUser())}
          dataSource={this.state.userData}
          pagination={false}
          style={{width: '100%'}}
          rowKey='id' />
      </div>
    )
  }
}
