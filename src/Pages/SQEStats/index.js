import React, { Component } from 'react'
import { Select, Table, DatePicker, Row, Col } from 'antd'
import * as column from './columns'
import moment from 'moment'
import './index.css'

const Option = Select.Option;

export default class SQEStats extends Component {
  state = {
    selectedJob: [],
    selectedDate: null,
    data: [],
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
  selectDate() {
    return <DatePicker.MonthPicker
      style={{ width: '100%' }} format='MM-YYYY'
      placeholder='Select Month'
      onChange={(date) => {
        if (date) {
          this.setState({
            selectedDate: date.format('YYYY-MM-DD')
          })
        } else {
          this.setState({
            selectedDate: null
          })
        }
      }} />
  }
  componentDidMount() {
    this.buildTable()
    
    
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.jobFiles !== this.props.jobFiles ||
      prevState.selectedJob !== this.state.selectedJob ||
      prevState.selectedDate !== this.state.selectedDate) {
      this.setState({
        data: null
      }, () => this.buildTable())
    }
  }
  calcTimeDiff(startTime, endTime) {
    if (!startTime || !endTime) {
      return null
    }
    var start = moment.utc(startTime, "h.mm");
    var end = moment.utc(endTime, "h.mm");
    if (end.isBefore(start)) end.add(1, 'day');
    var d = moment.duration(end.diff(start));
    return moment.utc(+d).format('HH:mm')
  }
  buildTable() {
    var data = []
    if (this.state.selectedDate !== null) {
      var startOf = moment(this.state.selectedDate, 'YYYY-MM-DD').startOf('month')
      var endOf = moment(this.state.selectedDate, 'YYYY-MM-DD').endOf('month')
    } else {
      startOf = moment().startOf('year')
      endOf = moment().endOf('year')
    }
    function dataCalc(job, dailyPrestarts, siteInspections, toolboxMinutes, dailyDiarys, calcTimeDiff) {
      var obj = {
        id: job.id,
        job: job.form_values['5b1c'],
        title: job.form_values['7af6'],
        manHours: moment.duration(0),
        manHoursSub: moment.duration(0),
        siteInspections: 0,
        toolbox: 0,
        hazards: 0,
        diesel: 0,
        unleaded: 0,
        water: 0
      }
      //Man Hours
      dailyPrestarts.forEach(prestart => {
        if (job.project_id === prestart.project_id) {
          var prestartDate = moment(prestart.form_values['80e9'], 'YYYY-MM-DD')
          if ((prestartDate > startOf && prestartDate < endOf) || (prestartDate === startOf && prestartDate === endOf)) {
            if (prestart.form_values['86b7']) {
              prestart.form_values['86b7'].forEach(log => {
                var start = (log.form_values['33d3']) ? log.form_values['33d3'].choice_values[1] : '';
                var end = (log.form_values['2748']) ? log.form_values['2748'].choice_values[1] : '';
                var hoursWorked = calcTimeDiff(start, end)
                var addHours = moment(hoursWorked, 'HH:mm').format('HH')
                var addMins = moment(hoursWorked, 'HH:mm').format('m')

                if (log.form_values['cc82'] === 'company_personnel') {
                  obj.manHours.add(parseInt(addHours, 0), 'hours').add(parseInt(addMins, 0), 'minutes')
                }
                if (log.form_values['cc82'] === 'sub_contractor') {
                  obj.manHoursSub.add(parseInt(addHours, 0), 'hours').add(parseInt(addMins, 0), 'minutes')
                }
              })
            }
            if (prestart.form_values['27d8']) {
              prestart.form_values['27d8'].forEach(() => {
                obj.hazards++
              })
            }
          }
        }
      })
      //Site Inspections
      siteInspections.forEach(inspection => {
        if (inspection.project_id === job.project_id) {
          var inspectionDate = moment(inspection.form_values['91dd'], 'YYYY-MM-DD')
          if ((inspectionDate > startOf && inspectionDate < endOf) || (inspectionDate === startOf && inspectionDate === endOf)) {
            if (inspection.form_values['d187']) {
              inspection.form_values['d187'].forEach(() => {
                obj.hazards++
              })
            }
            obj.siteInspections++
          }
        }
      })
      //ToolBox Minutes
      toolboxMinutes.forEach(toolbox => {
        if (toolbox.project_id === job.project_id) {
          var toolBoxDate = moment(toolbox.form_values['2318'], 'YYYY-MM-DD')
          if ((toolBoxDate > startOf && toolBoxDate < endOf) || (toolBoxDate === startOf && toolBoxDate === endOf)) {
            if (toolbox.form_values['59aa']) {
              toolbox.form_values['59aa'].forEach(() => {
                obj.hazards++
              })
            }
            obj.toolbox++
          }
        }
      })
      //Materials
      dailyDiarys.forEach(diary => {
        if (diary.project_id === job.project_id) {
          var diaryDate = moment(diary.form_values['bea6'], 'YYYY-MM-DD')
          if ((diaryDate > startOf && diaryDate < endOf) || (diaryDate === startOf && diaryDate === endOf)) {
            var diesel = (diary.form_values['da81']) ? parseInt(diary.form_values['da81'], 0) : 0;
            var unleaded = (diary.form_values['1946']) ? parseInt(diary.form_values['1946'], 0) : 0;
            var water = (diary.form_values['6872']) ? parseInt(diary.form_values['6872'], 0) : 0;
            obj.diesel += diesel
            obj.unleaded += unleaded
            obj.water += water
          }
        }
      })
      return obj
    }
    if (this.state.selectedJob.length !== 0) {
      this.state.selectedJob.forEach(selection => {
        this.props.jobFiles.forEach(job => {
          if (job.project_id === selection) {
            data.push(dataCalc(job, this.props.dailyPrestarts, this.props.siteInspections, this.props.toolboxMinutes, this.props.dailyDiarys, this.calcTimeDiff))
          }
        })
      })
    } else {
      this.props.jobFiles.forEach(job => {
        data.push(dataCalc(job, this.props.dailyPrestarts, this.props.siteInspections, this.props.toolboxMinutes, this.props.dailyDiarys, this.calcTimeDiff))
      })
    }
    this.setState({
      data
    })
  }
  render() {
    return (
      <div>
        <Row>
          <Col span={16} style={{ paddingRight: 5 }}>
            {this.selectJob()}
          </Col>
          <Col span={8} style={{ paddingLeft: 5 }}>
            {this.selectDate()}
          </Col>
        </Row>
        <Table
          pagination={false}
          bordered
          id='boresTableOne'
          className='boreTables tableResizer dailyReportTables'
          columns={column.plantRegister()}
          dataSource={this.state.data}
          rowKey='id'
          size="middle" />
      </div>
    )
  }
}