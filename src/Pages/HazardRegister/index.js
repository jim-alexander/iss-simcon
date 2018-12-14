import React, { Component } from 'react'
import { Select, Table } from 'antd'
import * as column from './columns'

const Option = Select.Option;

export default class HazardRegister extends Component {
  selectJob() {
    return (
      <Select showSearch placeholder="Select a job Number" style={{ width: '100%', paddingBottom: 10 }} onChange={this.handleBoreSelect}>
        <Option key='one'>1823</Option>
        <Option key='two'>1234</Option>
        <Option key='three'>185523</Option>
      </Select>
    )
  }
  render() {
    return (
      <div>
        {this.selectJob()}
        <Table
          pagination={false}
          bordered
          id='boresTableOne'
          className='boreTables tableResizer dailyReportTables'
          columns={column.hazardRegister}
          dataSource={null}
          rowKey='id'
          size="middle" />
      </div>
    )
  }
}
