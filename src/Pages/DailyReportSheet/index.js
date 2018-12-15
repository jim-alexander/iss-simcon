import React from 'react'
import { Select, Table, Row, Col } from 'antd'
import './index.css'
import * as column from './columns'
import { db } from '../../firebase'
import moment from 'moment'

const Option = Select.Option;

class DailyReportSheet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: '',
      selectedJob: '',
      reportList: [],
      hideDate: true,
      jobData1: [],
      jobData2: [],
      companyPersonnel: [],
      subContractors: [],
      companyPlant: [],
      hiredPlant: [],
      materialsDelivered: [],
      SQEStats: []
    };
  }
  componentDidMount() {
    db.lastViewedPage(this.props.user.id, 'home');
  }
  componentDidUpdate(prevProps, prevState) {
    db.lastViewedPage(this.props.user.id, 'home');
    if (this.state.selectedDate !== prevState.selectedDate || this.state.selectedJob !== prevState.selectedJob) {
      this.setState({
        hideDate: false,
        companyPersonnel: [],
        subContractors: [],
        companyPlant: [],
        hiredPlant: [],
        materialsDelivered: [],
        SQEStats: []
      }, () => {
        this.updatePageData();
      })
    }
  }
  selectJob() {
    return (
      <Select
        showSearch
        placeholder="Select a job Number"
        style={{ width: '100%', paddingBottom: 10 }}
        onChange={(job) => { this.setState({ selectedJob: job, selectedDate: ''}) }}>
        {this.props.jobFiles.map(job => <Option key={job.project_id}>{job.form_values["5b1c"]}</Option>)}
      </Select>
    )
  }
  selectDate() {
    return (
      <Select showSearch placeholder="Select date" style={{ width: '100%', paddingBottom: 10 }} onChange={(date) => { this.setState({ selectedDate: date }) }}>
        {this.props.dailyPrestarts.map(prestart => {
          if (this.state.selectedJob === prestart.project_id) {
            return (<Option key={prestart.form_values["80e9"]}>{moment(prestart.form_values["80e9"]).format('DD/MM/YYYY')}</Option>)
          } else {
            return null
          }
        })}
      </Select>
    )
  }

  updatePageData() {
    function calcTimeDiff(startTime, endTime) {
      if (!startTime || !endTime) {
        return ''
      }
      // parse time using 24-hour clock and use UTC to prevent DST issues
      var start = moment.utc(startTime, "HH:mm");
      var end = moment.utc(endTime, "HH:mm");
      // account for crossing over to midnight the next day
      if (end.isBefore(start)) end.add(1, 'day');
      // calculate the duration
      var d = moment.duration(end.diff(start));
      // format a string result
      return moment.utc(+d).format('H:mm');
    }
    this.props.jobFiles.forEach(file => {
      if (file.project_id === this.state.selectedJob) {
        if (file.form_values['3033']) {
          var projectManager = file.form_values['3033'].choice_values[0]
        }
        this.setState({
          jobData1: [{
            id: file.id,
            title: file.form_values['7af6'],
            projectManager
          }]
        })

      }
    })
    if (this.state.selectedJob || this.state.selectedJob !== '') {
      this.props.dailyPrestarts.forEach(file => {
        if (file.form_values['80e9'] === this.state.selectedDate && file.project_id === this.state.selectedJob) {
          if (file.form_values['556f']) {
            var siteSupervisor = file.form_values['556f'].choice_values[0]
          }
          this.setState({
            jobData2: [{
              id: file.id,
              siteSupervisor,
              day: moment(file.form_values['80e9']).format('dddd')
            }]
          })
          if (file.form_values['86b7']) {

            file.form_values['86b7'].forEach(log => {
              if (log.form_values['cc82'] === 'company_personnel') {
                if (log.form_values[8464]) {
                  var compName = log.form_values[8464].choice_values[0]
                }
                this.setState(prevState => ({
                  companyPersonnel: [...prevState.companyPersonnel, {
                    id: log.id,
                    name: compName,
                    start: log.form_values['d294'],
                    end: log.form_values['1696'],
                    hours: calcTimeDiff(log.form_values['d294'], log.form_values['1696'])
                  }]
                }))
              }
              else if (log.form_values['cc82'] === 'sub_contractor') {
                this.setState(prevState => ({
                  subContractors: [...prevState.subContractors, {
                    id: log.id,
                    name: log.form_values[9666],
                    start: log.form_values['d294'],
                    end: log.form_values['1696'],
                    hours: calcTimeDiff(log.form_values['d294'], log.form_values['1696'])
                  }]
                }))
              }
            })
          }
          if (file.form_values['2cf0']) {
            file.form_values['2cf0'].choice_values.forEach(item => {
              this.setState(prevState => ({
                companyPlant: [...prevState.companyPlant, {
                  id: item,
                  item,
                }]
              }))
            })
          }
        }
      })
      this.props.dailyDiarys.forEach(diary => {
        if (diary.form_values['bea6'] === this.state.selectedDate && diary.project_id === this.state.selectedJob) {
          diary.form_values['7d44'].forEach(material => {
            this.setState(prevState => ({
              materialsDelivered: [...prevState.materialsDelivered, {
                id: material.id,
                supplier: material.form_values['0e3e'],
                item: material.form_values['2672'],
                quantity: material.form_values['b178'],
                docket: 'todo',
                photo: 'todo'
              }]
            }))
          })
          diary.form_values['f491'].forEach(plant => {
            this.setState(prevState => ({
              hiredPlant: [...prevState.hiredPlant, {
                id: plant.id,
                supplier: plant.form_values['b889'],
                equipment: plant.form_values['8c5c'],
                start: plant.form_values['2851'],
                end: plant.form_values['acac'],
                total: calcTimeDiff(plant.form_values['2851'], plant.form_values['acac']),
                docket: 'todo',
              }]
            }))
          })
          this.setState({
            SQEStats: [{
              id: diary.id,
              fuel: diary.form_values['da81'],
              water: diary.form_values['6872'],
              comments: diary.form_values['d5e3']
            }]
          })
        }
      })
    }
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
        <div className='boresPadding'>
          <Row gutter={10}>
            <Col span={12}>
              <Table
                pagination={false}
                bordered
                id='boresTableOne'
                className='boreTables tableResizer dailyReportTables'
                columns={column.jobDetails1}
                dataSource={this.state.jobData1}
                rowKey='id'
                size="middle" />
            </Col>
            <Col span={12}>
              <Table
                pagination={false}
                bordered
                id='boresTableOne'
                className='boreTables tableResizer dailyReportTables'
                columns={column.jobDetails2}
                dataSource={this.state.jobData2}
                rowKey='id'
                size="middle" />
            </Col>
          </Row>
        </div>
        <div className='boresPadding'>
          <Table
            pagination={false}
            title={() => 'Company Personnel'}
            footer={() => 'Total: 9:54'}
            bordered
            id='boresTableTwo'
            className='boreTables tableResizer dailyReportTables'
            columns={column.timesheet}
            dataSource={this.state.companyPersonnel}
            rowKey='id'
            size="middle" />
        </div>
        <div className='boresPadding'>
          <Table
            pagination={false}
            title={() => 'Sub Contractors'}
            footer={() => 'Total: 2:26'}
            bordered
            id='boresTableThree'
            className='boreTables tableResizer dailyReportTables'
            columns={column.timesheet}
            dataSource={this.state.subContractors}
            rowKey='id'
            size="middle" />
        </div>
        <div className='boresPadding'>
          <Row gutter={10}>
            <Col span={8}>
              <Table
                pagination={false}
                title={() => 'Company Plant'}
                bordered
                id='boresTableFour'
                className='boreTables tableResizer dailyReportTables'
                columns={column.companyPlant}
                dataSource={this.state.companyPlant}
                rowKey='id'
                size="middle" />
            </Col>
            <Col span={16}>
              <Table
                pagination={false}
                title={() => 'Hired Plant'}
                bordered
                id='boresTableFive'
                className='boreTables tableResizer dailyReportTables'
                columns={column.hiredPlant}
                dataSource={this.state.hiredPlant}
                rowKey='id'
                size="middle" />
            </Col>
          </Row>
        </div>
        <div className='boresPadding'>
          <Table
            pagination={false}
            title={() => 'Materials Delivered'}
            bordered
            id='boresTableSeven'
            className='boreTables tableResizer dailyReportTables'
            columns={column.materialsReceived}
            dataSource={this.state.materialsDelivered}
            rowKey='id'
            size="middle" />
        </div>
        <div className="boresPadding">
          <Table
            pagination={false}
            title={() => 'SQE Stats'}
            bordered
            id='boresTableSeven'
            className='boreTables tableResizer dailyReportTables'
            columns={column.sqeStats}
            dataSource={this.state.SQEStats}
            rowKey='id'
            size="middle" /></div>
      </div>
    );
  }
}

export default DailyReportSheet;
