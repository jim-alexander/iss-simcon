import React, { Component } from 'react'
import { Select, Table } from 'antd'
import * as column from './columns'

const Option = Select.Option;

export default class SitePlantRegister extends Component {
  state = {
    selectedJob: [],
    data: null
  }
  selectJob() {
    return (
      <Select
        mode="multiple"
        placeholder="Select Job Number(s)"
        style={{ width: '100%', paddingBottom: 10 }}
        onChange={(job) => { this.setState({ selectedJob: job }) }}>
        {this.props.jobFiles.map(job => <Option key={job.project_id}>{job.form_values["5b1c"]}</Option>)}
      </Select>
    )
  }
  componentDidMount() {
    this.plantData()
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.plantVerifications !== this.props.plantVerifications 
      || prevState.selectedJob !== this.state.selectedJob) {
      this.plantData()
    }
  }
  plantData(){
    var data = []  
    function verifications(verification){
      let type = (verification.form_values['d8a2']) ? verification.form_values['d8a2'].choice_values[0] : ''
      let obj = {
        id: verification.id,
        date: verification.form_values['c553'],
        type,
        make: verification.form_values['7c25'],
        owner: verification.form_values['926d'],
        serial: verification.form_values['0abe'],
        records: 'todo',
      }
      return obj
    }
    if (this.state.selectedJob.length !== 0) {
      this.state.selectedJob.forEach(selection => {
        this.props.plantVerifications.forEach(verification => {
          if (selection === verification.project_id) {
            data.push(verifications(verification))
          }
        })
      })
    } else {
      this.props.plantVerifications.forEach(verification => {
        data.push(verifications(verification))
      })
    }
    this.setState({
      data
    })
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
          columns={column.plantRegister}
          dataSource={this.state.data}
          rowKey='id'
          size="middle" />
      </div>
    )
  }
}
