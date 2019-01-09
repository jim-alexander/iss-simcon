import React, { Component } from 'react'
import { Select, Table } from 'antd'
import * as column from './columns'
import './index.css'

const Option = Select.Option;

export default class HazardRegister extends Component {
  state = {
    selectedJob: [],
    data: null
  }
  selectJob() {
    return (
      <Select
        showSearch
        mode="multiple"
        placeholder="Select Job Number(s)"
        style={{ width: '100%', paddingBottom: 10 }}
        onChange={(job) => { this.setState({ selectedJob: job }) }}>
        {this.props.jobFiles.map(job => <Option key={job.project_id}>{job.form_values["5b1c"]}</Option>)}
      </Select>
    )
  }
  componentDidMount() {
    this.loadHazardData()
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedJob !== this.state.selectedJob || prevProps.hazards !== this.props.hazards) {
      this.loadHazardData()
    }
  }
  loadHazardData() {
    var data = []
    const createObj = (hazard) => {
      let recordedBy = (hazard.form_values['4a01']) ? hazard.form_values['4a01'].choice_values[0] : ''
      let assignedTo = (hazard.form_values['81c2']) ? hazard.form_values['81c2'].choice_values[0] : ''      
      let obj = {
        id: hazard.id,
        status: hazard.status,
        dateIdentified: hazard.form_values['9ab6'],
        recordedBy,
        description: hazard.form_values['9c0b'],
        assignedTo,
        closeOutDate: hazard.form_values['126d'],
      }
      return obj
    }
    if (this.state.selectedJob.length === 0) {
      this.props.hazards.forEach(hazard => {
        data.push(createObj(hazard))
      })
    } else {
      this.props.hazards.forEach(hazard => {
        this.state.selectedJob.forEach(job => {
          if (hazard.project_id === job) {
            
            data.push(createObj(hazard))
          }
        })
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
          className='boreTables tableResizer'
          columns={column.hazardRegister}
          dataSource={this.state.data}
          rowKey='id'
          rowClassName={(record) => {
            return record.status
          }}
          size="middle" />
      </div>
    )
  }
}
