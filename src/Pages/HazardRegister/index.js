import React, { Component } from 'react'
import { Select, Table } from 'antd'
import * as column from './columns'
import { db } from '../../firebase'
import { inspectionHazards } from './inspectionHazards'
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
        mode="multiple"
        placeholder="Select Job Number(s)"
        style={{ width: '100%', paddingBottom: 10 }}
        onChange={(job) => { this.setState({ selectedJob: job }) }}>
        {this.props.jobFiles.map(job => {
          return (<Option key={job.project_id}>{job.form_values["5b1c"]}</Option>)
        })}
      </Select>
    )
  }
  componentDidMount() {
    db.lastViewedPage(this.props.user.id, 'Hazard Register');
    this.loadHazardData()
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedJob !== this.state.selectedJob || prevProps.hazards !== this.props.hazards) {
      db.lastViewedPage(this.props.user.id, 'Hazard Register');
      this.loadHazardData()
    }
  }
  loadHazardData() {
    var data = []
    const createObj = (hazard, recordedBy, assignedTo, dateIdentified, description, closeOutDate) => {
      let obj = {
        id: `${hazard.id}-${description}`,
        status: hazard.status,
        dateIdentified,
        recordedBy,
        description,
        assignedTo,
        closeOutDate,
      }
      return obj
    }
    if (this.state.selectedJob.length === 0) {
      this.props.hazards.forEach(hazard => {
        let recordedBy = (hazard.form_values['4a01']) ? hazard.form_values['4a01'].choice_values[0] : ''
        let assignedTo = (hazard.form_values['81c2']) ? hazard.form_values['81c2'].choice_values[0] : ''
        data.push(createObj(hazard, recordedBy, assignedTo, hazard.form_values['9ab6'], hazard.form_values['9c0b'], hazard.form_values['126d']))
      })
      this.props.toolboxMinutes.forEach(toolbox => {
        if (toolbox.form_values['042c']) {
          let recordedBy = (toolbox.form_values['014b']) ? toolbox.form_values['014b'].choice_values[0] : ''
          let assignedTo = (toolbox.form_values['6718']) ? toolbox.form_values['6718'].choice_values[0] : ''
          data.push(createObj(toolbox, recordedBy, assignedTo, toolbox.form_values['2318'], toolbox.form_values['042c'], toolbox.form_values['6796']))
        }
      })
      this.props.dailyDiarys.forEach(diary => {
        if (diary.form_values['eda0']) {
          let recordedBy = (diary.form_values['cfa2']) ? diary.form_values['cfa2'].choice_values[0] : ''
          let assignedTo = (diary.form_values['5b46']) ? diary.form_values['5b46'].choice_values[0] : ''
          data.push(createObj(diary, recordedBy, assignedTo, diary.form_values['bea6'], diary.form_values['eda0'], diary.form_values['e2ab']))
        }
      })
      this.props.siteInspections.forEach(inspection => {
        let inspectedBy = (inspection.form_values['0923']) ? inspection.form_values['0923'].choice_values[0] : null
        let dateInspected = inspection.form_values['91dd']
        inspectionHazards(inspection.form_values).forEach(entry => {
          if (entry.comments) {
            data.push(createObj(inspection, inspectedBy, entry.assignedTo, dateInspected, entry.comments, null))
          }
        })
      })
    } else {
      this.props.hazards.forEach(hazard => {
        this.state.selectedJob.forEach(job => {
          if (hazard.project_id === job) {
            let recordedBy = (hazard.form_values['4a01']) ? hazard.form_values['4a01'].choice_values[0] : ''
            let assignedTo = (hazard.form_values['81c2']) ? hazard.form_values['81c2'].choice_values[0] : ''
            data.push(createObj(hazard, recordedBy, assignedTo, hazard.form_values['9ab6'], hazard.form_values['9c0b'], hazard.form_values['126d']))

          }
        })
      })
      this.props.toolboxMinutes.forEach(toolbox => {
        if (toolbox.form_values['042c']) {
          this.state.selectedJob.forEach(job => {
            if (toolbox.project_id === job) {
              let recordedBy = (toolbox.form_values['014b']) ? toolbox.form_values['014b'].choice_values[0] : ''
              let assignedTo = (toolbox.form_values['6718']) ? toolbox.form_values['6718'].choice_values[0] : ''
              data.push(createObj(toolbox, recordedBy, assignedTo, toolbox.form_values['2318'], toolbox.form_values['042c'], toolbox.form_values['6796']))
            }
          })
        }
      })
      this.props.dailyDiarys.forEach(diary => {
        if (diary.form_values['eda0']) {
          this.state.selectedJob.forEach(job => {
            if (diary.project_id === job) {
              let recordedBy = (diary.form_values['cfa2']) ? diary.form_values['cfa2'].choice_values[0] : ''
              let assignedTo = (diary.form_values['5b46']) ? diary.form_values['5b46'].choice_values[0] : ''
              data.push(createObj(diary, recordedBy, assignedTo, diary.form_values['bea6'], diary.form_values['eda0'], diary.form_values['e2ab']))
            }
          })
        }
      })
      this.props.siteInspections.forEach(inspection => {
        this.state.selectedJob.forEach(job => {
          if (inspection.project_id === job) {
            let inspectedBy = (inspection.form_values['0923']) ? inspection.form_values['0923'].choice_values[0] : null
            let dateInspected = inspection.form_values['91dd']
            inspectionHazards(inspection.form_values).forEach(entry => {
              if (entry.comments) {
                data.push(createObj(inspection, inspectedBy, entry.assignedTo, dateInspected, entry.comments, null))
              }
            })
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
