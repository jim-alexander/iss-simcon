import React, { Component } from 'react'
import { Table } from 'antd'
import moment from 'moment'

export default class Job extends Component {
  state = {
    visible: false,
  }
  render() {
    return (this.props.user.id === '13nBwfjw44ZOM76bEFrnXsyy1ij1') ? (
      <div>
        <h1>Devices</h1>
        <Table dataSource={this.props.devicesLastSynced} columns={[{
            title: 'Account Name',
            dataIndex: 'name',
            key: 'name',
          }, {
            title: 'Last Sync',
            dataIndex: 'last_sync',
            key: 'last_sync',
            render: date => {
              if (date) {
                return moment(date).fromNow()
              }
            }
          }]}
          style={{
            maxWidth: 500
          }}
          rowKey='name'
          bordered
          pagination={false}/>
      </div>
    ) : null
  }
}
