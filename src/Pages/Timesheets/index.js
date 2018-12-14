import React, { Component } from 'react'
import { Select, Table, DatePicker, Row, Col } from 'antd'
import * as column from './columns'
import './index.css'

const Option = Select.Option;

export default class Timesheets extends Component {
  selectEmployee() {
    return (
      <Select showSearch placeholder="Select employee" style={{ width: '100%', paddingBottom: 10 }} onChange={this.handleBoreSelect}>
        <Option key='one'>Kevin Johnes</Option>
        <Option key='two'>John Smith</Option>
        <Option key='three'>Jane Doe</Option>
      </Select>
    )
  }
  selectDate() {
    return <DatePicker.WeekPicker style={{ width: '100%' }}/>
  }
  render() {
    return (
      <div>
        <div style={{ paddingBottom: 10 }}>
          <Row>
            <Col span={16} style={{ paddingRight: 5 }}>
              {this.selectEmployee()}
            </Col>
            <Col span={8} style={{ paddingLeft: 5 }}>
              {this.selectDate()}
            </Col>
          </Row>
        </div>
        <Table
          pagination={false}
          bordered
          id='boresTableOne'
          className='boreTables tableResizer dailyReportTables'
          columns={column.timesheet}
          dataSource={column.data}
          rowKey='id'
          size="middle" />
      </div>
    )
  }
}