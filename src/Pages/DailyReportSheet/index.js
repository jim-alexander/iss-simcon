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
      jobInfo: null,
      companyPersonnel: [],
      compPersTotal: moment.duration({
        hours: 0,
        minutes: 0
      }),
      subContrTotal: moment.duration({
        hours: 0,
        minutes: 0
      }),
      comments: [],
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
    if (this.state.selectedDate !== prevState.selectedDate
      || this.state.selectedJob !== prevState.selectedJob
      || this.props.jobFiles !== prevProps.jobFiles
      || this.props.dailyPrestarts !== prevProps.dailyPrestarts) {

      this.setState({
        hideDate: false,
        jobInfo: null,
        companyPersonnel: [],
        compPersTotal: moment.duration({
          hours: 0,
          minutes: 0
        }),
        subContrTotal: moment.duration({
          hours: 0,
          minutes: 0
        }),
        comments: [],
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
        style={{ width: '100%' }}
        onChange={(job) => { this.setState({ selectedJob: job, selectedDate: '' }) }}>
        {this.props.jobFiles.map(job => {
          return (<Option key={job.project_id}>{job.form_values["5b1c"]}</Option>)
        })}
      </Select>

    )
  }
  selectDate() {
    let disabled = (!this.state.selectedJob) ? true : false;
    let dates = []
    this.props.dailyPrestarts.forEach(prestart => {
      if (this.state.selectedJob === prestart.project_id) {
        if (dates.indexOf(prestart.form_values["80e9"]) === -1) {
          dates.push(prestart.form_values["80e9"]);
        }
      }
    })
    return (
      <Select showSearch placeholder="Select date" disabled={disabled} style={{ width: '100%', paddingBottom: 10 }} onChange={(date) => { this.setState({ selectedDate: date }) }}>
        {dates.map(date => {
          return (<Option key={date}>{moment(date).format('DD/MM/YYYY')}</Option>)
        })}
      </Select>
    )
  }

  updatePageData() {
    var jobInfo = [{
      id: 0,
      title: null,
      projectManager: null,
      siteSupervisor: null,
      day: null,
    }]
    var contractors = [];
    function calcTimeDiff(startTime, endTime) {
      if (!startTime || !endTime) {
        return '00:00'
      }
      // parse time using 24-hour clock and use UTC to prevent DST issues
      var start = moment.utc(startTime, "HH:mm");
      var end = moment.utc(endTime, "HH:mm");
      // account for crossing over to midnight the next day
      if (end.isBefore(start)) end.add(1, 'day');
      // calculate the duration
      var d = moment.duration(end.diff(start));
      // format a string result
      return moment.utc(+d).format('HH:mm');
    }
    this.props.jobFiles.forEach(file => {
      if (file.project_id === this.state.selectedJob) {
        if (file.form_values['3033']) {
          var proMan = file.form_values['3033'].choice_values[0]
        }
        jobInfo[0].id = 0
        jobInfo[0].title = file.form_values['7af6']
        jobInfo[0].projectManager = proMan
      }
    })
    if (this.state.selectedJob || this.state.selectedJob !== '') {
      this.props.dailyPrestarts.forEach(file => {
        if (file.form_values['80e9'] === this.state.selectedDate && file.project_id === this.state.selectedJob) {
          if (file.form_values['556f']) {
            var siteSuper = file.form_values['556f'].choice_values[0]
          }
          jobInfo[0].siteSupervisor = siteSuper
          jobInfo[0].day = moment(file.form_values['80e9']).format('dddd')

          if (file.form_values['86b7']) {
            file.form_values['86b7'].forEach(log => {
              var start = (log.form_values['33d3']) ? log.form_values['33d3'].choice_values[1].replace('.', ':') : '';
              var end = (log.form_values['2748']) ? log.form_values['2748'].choice_values[1].replace('.', ':') : '';
              var diff = calcTimeDiff(start, end);

              if (log.form_values['cc82'] === 'company_personnel') {
                if (log.form_values['57fb']) {
                  var compName = log.form_values['57fb'].choice_values[0]
                }
                if (moment(diff, 'HH:mm').format('m') !== 0) {
                  var addMins = moment(diff, 'HH:mm').format('m');
                } else { addMins = 0 }
                if (moment(diff, 'HH:mm').format('HH') !== 0) {
                  var addHours = moment(diff, 'HH:mm').format('HH');
                } else { addHours = 0 }

                this.setState(prevState => ({
                  companyPersonnel: [...prevState.companyPersonnel, {
                    id: log.id,
                    name: compName,
                    start,
                    end,
                    hours: diff
                  }],
                  compPersTotal: prevState.compPersTotal
                    .add(parseInt(addHours, 0), 'hours')
                    .add(parseInt(addMins, 0), 'minutes')
                }))

              }
              else if (log.form_values['cc82'] === 'sub_contractor') {
                if (moment(diff, 'HH:mm').format('m') !== 0) {
                  var addMins2 = moment(diff, 'HH:mm').format('m');
                } else { addMins2 = 0 }
                if (moment(diff, 'HH:mm').format('h') !== 0) {
                  var addHours2 = moment(diff, 'HH:mm').format('HH');
                } else { addHours2 = 0 }
                const index = contractors.findIndex((e) => e.company === log.form_values['c1e2']);
                if (log.form_values['86f1']) {
                  console.log(log);
                  let photos = []
                  if (log.form_values['c92c']) {
                    log.form_values['c92c'].forEach(photo => photos.push(<div key={photo.photo_id}><a href={`https://web.fulcrumapp.com/api/v2/photos/${photo.photo_id}`} target="_blank" rel="noopener noreferrer">Photo</a><br /></div>))
                  }
                  this.setState(prevState => ({
                    hiredPlant: [...prevState.hiredPlant, {
                      id: log.id,
                      supplier: log.form_values['c1e2'],
                      equipment: log.form_values['d9b4'],
                      start,
                      end,
                      total: diff,
                      docket: photos,
                    }]
                  }))
                } else {
                  if (index === -1) {
                    contractors.push({
                      id: log.id,
                      company: log.form_values['c1e2'],
                      noOfEmployees: 1,
                      hours: moment.duration({
                        hours: parseFloat(addHours2),
                        minutes: parseFloat(addMins2)
                      })
                    })
                  } else {
                    contractors[index].noOfEmployees++
                    contractors[index].hours.add(parseFloat(addMins2), 'minutes').add(parseFloat(addHours2), 'hours')
                  }
                }
              }
              this.setState({ subContractors: contractors })
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
          if (file.form_values['0bd7']) {
            let comments = []
            let listComments = file.form_values['0bd7'].split('\n')
            listComments.forEach(comment => comments.push(<div key={comment}>{comment}<br /></div>))
            this.setState(prevState => ({
              comments: [...prevState.comments, {
                id: file.id,
                comments: file.form_values['0bd7'],
              }]
            }))
          }
        }
      })
      this.props.dailyDiarys.forEach(diary => {
        if (diary.form_values['bea6'] === this.state.selectedDate && diary.project_id === this.state.selectedJob) {
          if (diary.form_values['7d44']) {
            diary.form_values['7d44'].forEach(material => {
              let photos = []
              if (material.form_values['76de']) {
                material.form_values['76de'].forEach(photo => photos.push(<div key={photo.photo_id}><a href={`https://web.fulcrumapp.com/api/v2/photos/${photo.photo_id}`} target="_blank" rel="noopener noreferrer">Photo</a><br /></div>))
              }
              this.setState(prevState => ({
                materialsDelivered: [...prevState.materialsDelivered, {
                  id: material.id,
                  supplier: material.form_values['0e3e'],
                  item: material.form_values['2672'],
                  quantity: material.form_values['b178'],
                  photo: photos //todo
                }]
              }))
            })
          }
          if (diary.form_values['f491']) {
            diary.form_values['f491'].forEach(plant => {
              this.setState(prevState => ({
                hiredPlant: [...prevState.hiredPlant, {
                  id: plant.id,
                  supplier: plant.form_values['b889'],
                  equipment: plant.form_values['8c5c'],
                  start: plant.form_values['2851'],
                  end: plant.form_values['acac'],
                  total: calcTimeDiff(plant.form_values['2851'], plant.form_values['acac']),
                  docket: '', //todo
                }]
              }))
            })
          }
          this.setState({
            SQEStats: [{
              id: diary.id,
              fuel: diary.form_values['da81'],
              water: diary.form_values['6872'],
              comments: diary.form_values['d5e3']
            }]
          })
          if (diary.form_values['d5e3']) {
            let comments = []
            let listComments = diary.form_values['d5e3'].split('\n')
            listComments.forEach(comment => comments.push(<div key={comment}>{comment}<br /></div>))

            this.setState(prevState => ({
              comments: [...prevState.comments, {
                id: diary.id,
                comments: comments,
              }]
            }))
          }
        }
      })
    }
    if (this.state.selectedJob) {
      this.setState({
        jobInfo
      })
    }
  }

  render() {
    return (
      <div>
        <Row gutter={10}>
          <Col xs={24} sm={24} md={16} lg={16} xl={16} style={{ marginBottom: 10 }}>
            {this.selectJob()}
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            {this.selectDate()}
          </Col>
        </Row>
        <div className='boresPadding'>
          <Table
            pagination={false}
            locale={{ emptyText: 'No Data' }}
            bordered
            id='boresTableOne'
            className='boreTables tableResizer dailyReportTables'
            columns={column.jobDetails1}
            dataSource={this.state.jobInfo}
            rowKey='id'
            size="middle" />
        </div>
        <div className='boresPadding'>
          <Table
            pagination={false}
            locale={{ emptyText: 'No Data' }}
            title={() => 'Company Personnel'}
            footer={() => `Total Hours: ${this.state.compPersTotal.asHours()}`}
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
            locale={{ emptyText: 'No Data' }}
            title={() => 'Sub Contractors'}
            footer={() => `Total Hours: ${this.state.subContrTotal.asHours()}`}
            bordered
            id='boresTableThree'
            className='boreTables tableResizer dailyReportTables'
            columns={column.timesheetContractors}
            dataSource={this.state.subContractors}
            rowKey='id'
            size="middle" />
        </div>
        <div className='boresPadding'>
          <Row gutter={10}>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <Table
                pagination={false}
                locale={{ emptyText: 'No Data' }}
                title={() => 'Company Plant'}
                bordered
                id='boresTableFour'
                className='boreTables tableResizer dailyReportTables'
                columns={column.companyPlant}
                dataSource={this.state.companyPlant}
                rowKey='id'
                size="middle" />
            </Col>
            <Col xs={24} sm={24} md={16} lg={16} xl={16}>
              <Table
                pagination={false}
                locale={{ emptyText: 'No Data' }}
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
            locale={{ emptyText: 'No Data' }}
            title={() => 'Materials Delivered'}
            bordered
            id='boresTableSeven'
            className='boreTables tableResizer dailyReportTables'
            columns={column.materialsReceived}
            dataSource={this.state.materialsDelivered}
            rowKey='id'
            size="middle" />
        </div>
        <div className='boresPadding'>
          <Table
            size='small'
            rowKey='id'
            pagination={false}
            locale={{ emptyText: 'No Data' }}
            dataSource={this.state.comments}
            className='boreTables tableResizer dailyReportTables'
            columns={[{ title: 'Comments', key: 'comments', dataIndex: 'comments' }]}></Table>
        </div>
      </div>
    );
  }
}

export default DailyReportSheet;
