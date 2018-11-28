import React, { Component } from 'react'
import { db } from '../../firebase'
import { Table } from 'antd'
import { userActivity } from '../../constants/columns'

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
          if (user[0] !== this.props.user.id) {
            this.setState({
              userData: [...this.state.userData, user[1]]
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
          columns={userActivity}
          dataSource={this.state.userData}
          pagination={false}
          size='small'
          style={{width: '100%'}} />
      </div>
    )
  }
}
