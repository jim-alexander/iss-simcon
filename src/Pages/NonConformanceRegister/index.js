import React, { Component } from 'react'
import { Select, Table } from 'antd'
import { columns } from './columns'
import './index.css'
export default class NonConformanceRegister extends Component {
  state = {
    selectedJob: [],
    data: []
  }
  componentDidMount() {
    this.tableData()
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.incidentNonConf !== this.props.incidentNonConf) {
      this.tableData()
    }
  }
  selectJob() {
    let sorted = this.props.jobFiles.sort((a, b) => {
      if (a.form_values['5f36']) {
        if (a.form_values['5f36'] < b.form_values['5f36']) return 1
        if (a.form_values['5f36'] > b.form_values['5f36']) return -1
        return 0
      }
      return null
    })
    return (
      <Select
        mode="multiple"
        placeholder="Select Job Number(s)"
        style={{ width: '100%', paddingBottom: 10 }}
        onChange={job => {
          this.setState({ selectedJob: job.substring(0, job.indexOf('p.lSS#@')) })
        }}>
        {sorted.map(job => {
          if (job.project_id) {
            return (
              <Select.Option key={`${job.project_id}p.lSS#@${job.form_values['5b1c']}`}>
                {job.form_values['5b1c']}
              </Select.Option>
            )
          }
          return null
        })}
      </Select>
    )
  }
  tableData() {
    let data = []
    this.props.incidentNonConf.forEach(record => {
      if (record.form_values['800c']) {
        if (record.form_values['800c'].choice_values[0] === 'Quality Non-Conformance') {
          data.push(record)
          console.log(record)
        }
      }
    })
    this.setState({ data })
  }
  render() {
    return (
      <div>
        {this.selectJob()}
        <Table
          bordered
          pagination={false}
          id="boresTableOne"
          className="boreTables tableResizer"
          columns={columns}
          dataSource={this.state.data}
          //   rowClassName={record => record.status}
          rowKey="id"
          size="middle"
        />
      </div>
    )
  }
}
