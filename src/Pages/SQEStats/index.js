import React, { Component } from 'react'
import { Select, Table, DatePicker, Row, Col } from 'antd'
import * as column from './columns'

const Option = Select.Option;

export default class SQEStats extends Component {
  selectJob() {
    return (
      <Select showSearch placeholder="Select a job Number" style={{ width: '100%', paddingBottom: 10 }} onChange={this.handleBoreSelect}>
        <Option key='one'>1823</Option>
        <Option key='two'>1234</Option>
        <Option key='three'>185523</Option>
      </Select>
    )
  }
  selectDate() {
    return <DatePicker.MonthPicker style={{ width: '100%' }} format='MM-YYYY'/>
  }
  render() {
    return (
      <div>
        <div style={{ paddingBottom: 10 }}>
          <Row>
            <Col span={16} style={{ paddingRight: 5 }}>
              {this.selectJob()}
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
          columns={column.plantRegister}
          dataSource={null}
          rowKey='id'
          size="middle" />
      </div>
    )
  }
}