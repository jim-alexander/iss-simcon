import React, { Component } from 'react'
import { Select, Table } from 'antd'
import * as column from './columns'

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
    if (prevState.selectedJob !== this.state.selectedJob || prevProps.dailyPrestarts !== this.props.dailyPrestarts) {
      this.loadHazardData()
    }
  }
  loadHazardData() {
    var data = []
    function prestartData(prestart, hazard) {
      let recordedBy = (hazard.form_values['5de8']) ? hazard.form_values['5de8'].choice_values[1] : ''
      let assignedTo = (hazard.form_values['72a3']) ? hazard.form_values['72a3'].choice_values[1] : ''
      let obj = {
        id: hazard.id,
        dateIdentified: prestart.form_values['80e9'],
        recordedBy,
        description: hazard.form_values['067f'],
        assignedTo,
        closeOutDate: hazard.form_values['e12a'],
      }
      return obj
    }
    function siteInspectionData(inspection, hazard) {
      let recordedBy = (hazard.form_values['2bdc']) ? hazard.form_values['2bdc'].choice_values[1] : ''
      let assignedTo = (hazard.form_values['dd25']) ? hazard.form_values['dd25'].choice_values[1] : ''
      let obj = {
        id: hazard.id,
        dateIdentified: inspection.form_values['91dd'],
        recordedBy,
        description: hazard.form_values['77de'],
        assignedTo,
        closeOutDate: hazard.form_values['8fbb'],
      }
      return obj
    }
    function toolboxData(toolbox, hazard) {      
      let recordedBy = (hazard.form_values['81dd']) ? hazard.form_values['81dd'].choice_values[1] : ''
      let assignedTo = (hazard.form_values['7ac8']) ? hazard.form_values['7ac8'].choice_values[1] : ''
      let obj = {
        id: hazard.id,
        dateIdentified: toolbox.form_values['2318'],
        recordedBy,
        description: hazard.form_values['36b9'],
        assignedTo,
        closeOutDate: hazard.form_values['866d'],
      }
      return obj
    }
    if (this.state.selectedJob.length !== 0) {
      this.state.selectedJob.forEach(selection => {
        this.props.dailyPrestarts.forEach(prestart => {
          if (prestart.form_values['27d8']) {
            prestart.form_values['27d8'].forEach((hazard) => {
              if (prestart.project_id === selection) {
                data.push(prestartData(prestart, hazard))
              }
            })
          }
        })
        this.props.siteInspections.forEach(inspection => {
          if (inspection.form_values['d187']) {
            inspection.form_values['d187'].forEach((hazard) => {
              if (inspection.project_id === selection) {
                data.push(siteInspectionData(inspection, hazard))
              }
            })
          }
        })
        this.props.toolboxMinutes.forEach(toolbox => {
          if (toolbox.form_values['59aa']) {
            toolbox.form_values['59aa'].forEach((hazard) => {
              if (toolbox.project_id === selection) {
                data.push(toolboxData(toolbox, hazard))
              }
            })
          }
        })
      })
    } else {
      this.props.dailyPrestarts.forEach(prestart => {
        if (prestart.form_values['27d8']) {
          prestart.form_values['27d8'].forEach((hazard) => {
            data.push(prestartData(prestart, hazard))
          })
        }
      })
      this.props.siteInspections.forEach(inspection => {
        if (inspection.form_values['d187']) {
          inspection.form_values['d187'].forEach((hazard) => {
            data.push(siteInspectionData(inspection, hazard))
          })
        }
      })
      this.props.toolboxMinutes.forEach(toolbox => {
        if (toolbox.form_values['59aa']) {
          toolbox.form_values['59aa'].forEach((hazard) => {
            data.push(toolboxData(toolbox, hazard))
          })
        }
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
          size="middle" />
      </div>
    )
  }
}
