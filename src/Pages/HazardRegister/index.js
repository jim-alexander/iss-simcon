import React, { Component } from 'react'
import { Select, Table, message } from 'antd'
import * as column from './columns'
import { db } from '../../firebase'
import { inspectionHazards } from './inspectionHazards'
import { Client } from 'fulcrum-app'
import moment from 'moment'
import './index.css'

const client = new Client(process.env.REACT_APP_SECRET_KEY)

const Option = Select.Option

export default class HazardRegister extends Component {
  constructor() {
    super()
    this.state = {
      selectedJob: [],
      data: null,
      loadingTable: false
    }
    this.closeHazard = this.closeHazard.bind(this)
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
        onChange={jobs => {
          this.setState({
            selectedJob: jobs.map(job => job.substring(0, job.indexOf('p.lSS#@')))
          })
        }}>
        {sorted.map(job => {
          if (job.project_id) {
            return <Option key={`${job.project_id}p.lSS#@${job.form_values['5b1c']}`}>{job.form_values['5b1c']}</Option>
          }
          return null
        })}
      </Select>
    )
  }
  componentDidMount() {
    db.lastViewedPage(this.props.user.id, 'Hazard Register')
    this.loadHazardData()
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedJob !== this.state.selectedJob || prevProps.hazards !== this.props.hazards) {
      db.lastViewedPage(this.props.user.id, 'Hazard Register')
      this.loadHazardData()
    }
  }
  loadHazardData() {
    var data = []
    const createObj = (
      hazard,
      recordedBy,
      assignedTo,
      dateIdentified,
      description,
      closeOutDate,
      formValues,
      closeOutLocation
    ) => {
      let status = hazard.status || closeOutDate ? 'Closed Out' : 'Action Required'
      const job = () => {
        let index = this.props.jobFiles.findIndex(job => job.project_id === hazard.project_id)
        let jobNumber = index > 0 ? this.props.jobFiles[index].form_values['5f36'] : 'none'
        return jobNumber
      }
      let obj = {
        id: `${hazard.id}-${Math.random()}`,
        jobNumber: job(),
        status,
        dateIdentified,
        recordedBy,
        description,
        assignedTo,
        closeOutDate,
        formValues,
        closeOutLocation
      }

      return obj
    }
    if (this.state.selectedJob.length === 0) {
      this.props.hazards.forEach(hazard => {
        let recordedBy = hazard.form_values['4a01'] ? hazard.form_values['4a01'].choice_values[0] : ''
        let assignedTo = hazard.form_values['81c2'] ? hazard.form_values['81c2'].choice_values[0] : ''
        data.push(
          createObj(
            hazard,
            recordedBy,
            assignedTo,
            hazard.form_values['9ab6'],
            hazard.form_values['9c0b'],
            hazard.form_values['126d'],
            hazard,
            '126d'
          )
        )
      })
      this.props.toolboxMinutes.forEach(toolbox => {
        if (toolbox.form_values['042c']) {
          let recordedBy = toolbox.form_values['014b'] ? toolbox.form_values['014b'].choice_values[0] : ''
          let assignedTo = toolbox.form_values['6718'] ? toolbox.form_values['6718'].choice_values[0] : ''
          data.push(
            createObj(
              toolbox,
              recordedBy,
              assignedTo,
              toolbox.form_values['2318'],
              toolbox.form_values['042c'],
              toolbox.form_values['6796'],
              toolbox,
              '6796'
            )
          )
        }
      })
      this.props.dailyDiarys.forEach(diary => {
        if (diary.form_values['eda0']) {
          let recordedBy = diary.form_values['cfa2'] ? diary.form_values['cfa2'].choice_values[0] : ''
          let assignedTo = diary.form_values['5b46'] ? diary.form_values['5b46'].choice_values[0] : ''
          data.push(
            createObj(
              diary,
              recordedBy,
              assignedTo,
              diary.form_values['bea6'],
              diary.form_values['eda0'],
              diary.form_values['e2ab'],
              diary,
              'e2ab'
            )
          )
        }
      })
      this.props.siteInspections.forEach(inspection => {
        let inspectedBy = inspection.form_values['0923'] ? inspection.form_values['0923'].choice_values[0] : null
        let dateInspected = inspection.form_values['91dd']
        inspectionHazards(inspection.form_values).forEach(entry => {
          if (!entry.closeOutDate) {
            if (entry.comments) {
              data.push(
                createObj(
                  inspection,
                  inspectedBy,
                  entry.assignedTo,
                  dateInspected,
                  entry.comments,
                  null,
                  inspection,
                  entry.closeOutLocation
                )
              )
            }
          }
        })
      })
    } else {
      this.props.hazards.forEach(hazard => {
        this.state.selectedJob.forEach(job => {
          if (hazard.project_id === job) {
            let recordedBy = hazard.form_values['4a01'] ? hazard.form_values['4a01'].choice_values[0] : ''
            let assignedTo = hazard.form_values['81c2'] ? hazard.form_values['81c2'].choice_values[0] : ''
            data.push(
              createObj(
                hazard,
                recordedBy,
                assignedTo,
                hazard.form_values['9ab6'],
                hazard.form_values['9c0b'],
                hazard.form_values['126d'],
                hazard,
                '126d'
              )
            )
          }
        })
      })
      this.props.toolboxMinutes.forEach(toolbox => {
        if (toolbox.form_values['042c']) {
          this.state.selectedJob.forEach(job => {
            if (toolbox.project_id === job) {
              let recordedBy = toolbox.form_values['014b'] ? toolbox.form_values['014b'].choice_values[0] : ''
              let assignedTo = toolbox.form_values['6718'] ? toolbox.form_values['6718'].choice_values[0] : ''
              data.push(
                createObj(
                  toolbox,
                  recordedBy,
                  assignedTo,
                  toolbox.form_values['2318'],
                  toolbox.form_values['042c'],
                  toolbox.form_values['6796'],
                  toolbox,
                  '6796'
                )
              )
            }
          })
        }
      })
      this.props.dailyDiarys.forEach(diary => {
        if (diary.form_values['eda0']) {
          this.state.selectedJob.forEach(job => {
            if (diary.project_id === job) {
              let recordedBy = diary.form_values['cfa2'] ? diary.form_values['cfa2'].choice_values[0] : ''
              let assignedTo = diary.form_values['5b46'] ? diary.form_values['5b46'].choice_values[0] : ''
              data.push(
                createObj(
                  diary,
                  recordedBy,
                  assignedTo,
                  diary.form_values['bea6'],
                  diary.form_values['eda0'],
                  diary.form_values['e2ab'],
                  diary,
                  'e2ab'
                )
              )
            }
          })
        }
      })
      this.props.siteInspections.forEach(inspection => {
        this.state.selectedJob.forEach(job => {
          if (inspection.project_id === job) {
            let inspectedBy = inspection.form_values['0923'] ? inspection.form_values['0923'].choice_values[0] : null
            let dateInspected = inspection.form_values['91dd']
            inspectionHazards(inspection.form_values).forEach(entry => {
              if (!entry.closeOutDate) {
                if (entry.comments) {
                  data.push(
                    createObj(
                      inspection,
                      inspectedBy,
                      entry.assignedTo,
                      dateInspected,
                      entry.comments,
                      null,
                      inspection,
                      entry.closeOutLocation
                    )
                  )
                }
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
  closeHazard(hazard) {
    this.setState({ loadingTable: true })
    let obj = {
      form_id: '3e7888a5-26fa-449d-a183-b5a228c6e59a',
      status: 'Closed Out',
      project_id: hazard.formValues.project_id,
      form_values: {
        '4a01': { choice_values: [hazard.recordedBy] },
        '81c2': { choice_values: [hazard.assignedTo] },
        '9ab6': hazard.dateIdentified,
        '9c0b': hazard.description,
        '126d': moment().format('YYYY-MM-DD')
      }
    }
    if (hazard.formValues.form_id === '3e7888a5-26fa-449d-a183-b5a228c6e59a') {
      let update = hazard.formValues
      update.form_values[hazard.closeOutLocation] = moment().format('YYYY-MM-DD')
      update.status = 'Closed Out'
      client.records
        .update(update.id, update)
        .then(resp => {
          let data = this.state.data
          const index = data.indexOf(hazard)
          data[index].closeOutDate = obj.form_values['126d']
          data[index].status = 'Closed Out'
          this.setState({ data, loadingTable: false })
          message.success('Hazard closed out. ')
        })
        .catch(err => {
          message.error('An error occured.')
          this.setState({ loadingTable: false })
          console.log(err)
        })
    } else {
      client.records
        .create(obj)
        .then(resp => {
          let update = hazard.formValues
          update.form_values[hazard.closeOutLocation] = moment().format('YYYY-MM-DD')

          message.success('Created hazard in register.')
          console.log('Created hazard in register.', resp)

          client.records
            .update(update.id, update)
            .then(resp => {
              let data = this.state.data
              const index = data.indexOf(hazard)
              data[index].closeOutDate = obj.form_values['126d']
              data[index].status = 'Closed Out'
              this.setState({ data, loadingTable: false })
              console.log('Closed out hazard in form.', resp)
            })
            .catch(err => {
              message.error('An error occured.')
              this.setState({ loadingTable: false })
              console.log(err)
            })
        })
        .catch(err => {
          message.error('An error occured.')
          this.setState({ loadingTable: false })
          console.log(err)
        })
    }
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
          columns={column.hazardRegister(this.closeHazard)}
          dataSource={this.state.data}
          rowKey="id"
          loading={this.state.loadingTable}
          rowClassName={record => {
            return record.status
          }}
          size="middle"
        />
      </div>
    )
  }
}
