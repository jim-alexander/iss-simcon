import React from 'react'
import { Select, Table, Row, Col, Button, Icon, Input, message } from 'antd'
import './index.css'
import * as column from './columns'
import { db } from '../../firebase'
import { Client } from 'fulcrum-app'
import moment from 'moment'

const client = new Client(process.env.REACT_APP_SECRET_KEY)

const Option = Select.Option
class DailyReportSheet extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      datesList: [],
      selectedDate: 'Select a date',
      selectedJob: '',
      reportList: [],
      currentDailyPreStart: null,
      currentDailyDiary: null,
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
    }
    this.invoice = this.invoice.bind(this)
  }
  componentDidMount() {
    db.lastViewedPage(this.props.user.id, 'home')
  }
  componentDidUpdate(prevProps, prevState) {
    db.lastViewedPage(this.props.user.id, 'home')
    if (
      this.state.selectedDate !== prevState.selectedDate ||
      this.state.selectedJob !== prevState.selectedJob ||
      this.props.jobFiles !== prevProps.jobFiles ||
      this.props.dailyPrestarts !== prevProps.dailyPrestarts
    ) {
      this.setState(
        {
          datesList: [],
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
          SQEStats: [],
          sitePhotos: [],
          loadingSubContractorsTable: false,
          loadingHiredPlantTable: false,
          loadingMaterialsTable: false
        },
        () => {
          this.updatePageData()
        }
      )
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
        showSearch
        placeholder='Select a job Number'
        style={{ width: '100%' }}
        onChange={job => {
          this.setState({
            selectedJob: job.substring(0, job.indexOf('p.lSS#@'))
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
  getDates() {
    let dates = []
    this.props.dailyPrestarts.forEach(prestart => {
      if (this.state.selectedJob === prestart.project_id) {
        if (dates.indexOf(prestart.form_values['80e9']) === -1) {
          dates.push(prestart.form_values['80e9'])
        }
      }
    })
    dates.sort((a, b) => {
      a = moment(a, 'YYYY-MM-DD')
      b = moment(b, 'YYYY-MM-DD')
      if (a.isAfter(b)) {
        return -1
      } else if (a.isBefore(b)) {
        return 1
      } else {
        return 0
      }
    })
    if (this.state.selectedDate === 'Select a date' && dates.length !== 0) {
      this.setState({
        selectedDate: dates[0]
      })
    }
    this.setState({
      datesList: dates
    })
  }
  selectDate() {
    let disabled = this.state.datesList.length <= 0 ? true : false
    return (
      <Select
        showSearch
        value={this.state.selectedDate}
        placeholder='Select date'
        disabled={disabled}
        style={{ width: '100%', paddingBottom: 10 }}
        onChange={date => {
          this.setState({ selectedDate: date })
        }}>
        {this.state.datesList.map(date => {
          if (date) {
            return <Option key={date}>{moment(date).format('DD/MM/YYYY')}</Option>
          } else {
            return null
          }
        })}
      </Select>
    )
  }
  dateButtons() {
    const index = this.state.datesList.indexOf(this.state.selectedDate)
    let previousDisabled = index >= this.state.datesList.length - 1 ? true : false
    let nextDisabled = index <= 0 ? true : false
    return (
      <Button.Group style={{ width: '100%', marginBottom: 10 }}>
        <Button
          disabled={previousDisabled}
          style={{ width: '50%' }}
          onClick={() => {
            this.setState({ selectedDate: this.state.datesList[index + 1] })
          }}>
          <Icon type='left' />
          Previous Date
        </Button>
        <Button
          disabled={nextDisabled}
          style={{ width: '50%' }}
          onClick={() => {
            this.setState({ selectedDate: this.state.datesList[index - 1] })
          }}>
          Next Date
          <Icon type='right' />
        </Button>
      </Button.Group>
    )
  }
  searchBar() {
    return (
      <Input.Search
        placeholder='What are you looking for?'
        enterButton='Search'
        size='large'
        className='ant-dropdown-link'
        onSearch={value => {
          console.log(value)

          // this.props.jobFiles.forEach(record => {
          //   // (Object.values(record.form_values).includes(value)) ? results.push(record.form_values)
          //   //  : null
          // })
          // this.props.dailyPrestarts.forEach(record => {
          // })
          // this.props.dailyDiarys.forEach(record => {
          // })
        }}
      />
    )
  }
  updatePageData() {
    this.getDates()
    var jobInfo = [
      {
        id: 0,
        title: null,
        projectManager: null,
        siteSupervisor: null,
        day: null,
        weather: null
      }
    ]
    var contractors = []
    function calcTimeDiff(startTime, endTime, lunch) {
      if (!startTime || !endTime) {
        return '00:00'
      }
      let breakTime = lunch === 'yes' || lunch === undefined ? true : false
      // console.log(lunch, breakTime);

      // parse time using 24-hour clock and use UTC to prevent DST issues
      var start = moment.utc(startTime, 'HH:mm')
      var end = moment.utc(endTime, 'HH:mm')
      // account for crossing over to midnight the next day
      if (end.isBefore(start)) end.add(1, 'day')
      // calculate the duration
      var d = moment.duration(end.diff(start))
      if (d.asHours() > 5 && breakTime) {
        d.subtract(30, 'minutes')
      }

      // format a string result
      return moment.utc(+d).format('HH:mm')
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
    if (this.state.selectedJob) {
      this.props.dailyPrestarts.forEach(file => {
        if (file.form_values['80e9'] === this.state.selectedDate && file.project_id === this.state.selectedJob) {
          if (file.form_values['556f']) {
            var siteSuper = file.form_values['556f'].choice_values[0]
          }
          jobInfo[0].siteSupervisor = siteSuper
          jobInfo[0].day = moment(file.form_values['80e9']).format('dddd')
          this.setState({
            currentDailyPreStart: file
          })

          if (file.form_values['86b7']) {
            file.form_values['86b7'].forEach(log => {
              var start = log.form_values['33d3'] ? log.form_values['33d3'].choice_values[1].replace('.', ':') : ''
              var end = log.form_values['2748'] ? log.form_values['2748'].choice_values[1].replace('.', ':') : ''
              var diff = calcTimeDiff(start, end, log.form_values['54aa'])

              if (log.form_values['cc82'] === 'company_personnel') {
                var lafha = log.form_values['b574'] === 'yes' ? '✔' : null

                if (log.form_values['57fb']) {
                  var compName = log.form_values['57fb'].choice_values[0]
                }
                if (moment(diff, 'HH:mm').format('m') !== 0) {
                  var addMins = moment(diff, 'HH:mm').format('m')
                } else {
                  addMins = 0
                }
                if (moment(diff, 'HH:mm').format('HH') !== 0) {
                  var addHours = moment(diff, 'HH:mm').format('HH')
                } else {
                  addHours = 0
                }
                var absent = log.form_values['c9b8']
                  ? log.form_values['c9b8'].choice_values[0] !== 'No'
                    ? log.form_values['c9b8'].choice_values[0]
                    : null
                  : null

                this.setState(prevState => ({
                  companyPersonnel: [
                    ...prevState.companyPersonnel,
                    {
                      id: log.id,
                      name: compName,
                      start,
                      end,
                      absent,
                      hours: diff,
                      lafha
                    }
                  ],
                  compPersTotal: prevState.compPersTotal
                    .add(parseInt(addHours, 0), 'hours')
                    .add(parseInt(addMins, 0), 'minutes')
                }))
              } else if (log.form_values['cc82'] === 'sub_contractor') {
                let invoiced = log.form_values['fb30'] === 'yes' ? true : false

                if (moment(diff, 'HH:mm').format('m') !== 0) {
                  var addMins2 = moment(diff, 'HH:mm').format('m')
                } else {
                  addMins2 = 0
                }
                if (moment(diff, 'HH:mm').format('h') !== 0) {
                  var addHours2 = moment(diff, 'HH:mm').format('HH')
                } else {
                  addHours2 = 0
                }
                const index = contractors.findIndex(e => {
                  let check = e.company ? e.company.replace(' ', '').toUpperCase() : e.company
                  let checkTwo = log.form_values['c1e2']
                    ? log.form_values['c1e2'].replace(' ', '').toUpperCase()
                    : log.form_values['c1e2']
                  return check === checkTwo
                })

                if (log.form_values['86f1']) {
                  let photos = []
                  if (log.form_values['c92c']) {
                    log.form_values['c92c'].forEach(photo =>
                      photos.push(
                        <div key={photo.photo_id}>
                          <a
                            href={`https://web.fulcrumapp.com/api/v2/photos/${photo.photo_id}`}
                            target='_blank'
                            rel='noopener noreferrer'>
                            Photo
                          </a>
                          <br />
                        </div>
                      )
                    )
                  }
                  this.setState(prevState => ({
                    hiredPlant: [
                      ...prevState.hiredPlant,
                      {
                        from: 'prestart',
                        invoiced,
                        id: log.id,
                        supplier: log.form_values['c1e2'],
                        equipment: log.form_values['d9b4'],
                        start,
                        end,
                        total: diff,
                        docket: photos
                      }
                    ]
                  }))
                } else {
                  if (index === -1) {
                    contractors.push({
                      invoiced,
                      ids: [log.id],
                      id: log.id,
                      company: log.form_values['c1e2'],
                      noOfEmployees: 1,
                      hours: moment.duration({
                        hours: parseFloat(addHours2),
                        minutes: parseFloat(addMins2)
                      })
                    })
                    this.state.subContrTotal.add(parseInt(addHours2, 0), 'hours').add(parseInt(addMins2, 0), 'minutes')
                  } else {
                    contractors[index].noOfEmployees++
                    contractors[index].ids.push(log.id)
                    contractors[index].hours.add(parseFloat(addMins2), 'minutes').add(parseFloat(addHours2), 'hours')
                    this.state.subContrTotal.add(parseInt(addHours2, 0), 'hours').add(parseInt(addMins2, 0), 'minutes')
                  }
                }
              }
              this.setState({
                subContractors: contractors
              })
            })
          }
          if (file.form_values['2cf0']) {
            file.form_values['2cf0'].choice_values.forEach(item => {
              this.setState(prevState => ({
                companyPlant: [
                  ...prevState.companyPlant,
                  {
                    id: item,
                    item
                  }
                ]
              }))
            })
            if (file.form_values['2cf0'].other_values) {
              file.form_values['2cf0'].other_values.forEach(item => {
                this.setState(prevState => ({
                  companyPlant: [
                    ...prevState.companyPlant,
                    {
                      id: item,
                      item
                    }
                  ]
                }))
              })
            }
          }
          if (file.form_values['d291']) {
            let items = file.form_values['d291'].split('\n')
            items.forEach(item => {
              this.setState(prevState => ({
                companyPlant: [
                  ...prevState.companyPlant,
                  {
                    id: item,
                    item
                  }
                ]
              }))
            })
          }
          if (file.form_values['0bd7']) {
            let comments = []
            let listComments = file.form_values['0bd7'].split('\n')
            listComments.forEach(comment =>
              comments.push(
                <div key={Math.random()}>
                  {comment}
                  <br />
                </div>
              )
            )
            this.setState(prevState => ({
              comments: [
                ...prevState.comments,
                {
                  id: file.id,
                  comments: file.form_values['0bd7']
                }
              ]
            }))
          }
        }
      })
      this.props.dailyDiarys.forEach(diary => {
        if (diary.form_values['bea6'] === this.state.selectedDate && diary.project_id === this.state.selectedJob) {
          this.setState({
            currentDailyDiary: diary
          })
          jobInfo[0].weather = diary.form_values['8d15']

          if (diary.form_values['7d44']) {
            diary.form_values['7d44'].forEach(material => {
              let photos = []
              let invoiced = material.form_values['e07a'] === 'yes' ? true : false
              console.log(material)
              if (material.form_values['76de']) {
                material.form_values['76de'].forEach(photo =>
                  photos.push(
                    <div key={photo.photo_id}>
                      <a
                        href={`https://web.fulcrumapp.com/api/v2/photos/${photo.photo_id}`}
                        target='_blank'
                        rel='noopener noreferrer'>
                        Photo
                      </a>
                      <br />
                    </div>
                  )
                )
              }
              this.setState(prevState => ({
                materialsDelivered: [
                  ...prevState.materialsDelivered,
                  {
                    from: 'diaryMaterials',
                    id: material.id,
                    supplier: material.form_values['0e3e'],
                    item: material.form_values['2672'],
                    quantity: material.form_values['b178'],
                    photo: photos,
                    invoiced
                  }
                ]
              }))
            })
          }
          if (diary.form_values['f491']) {
            diary.form_values['f491'].forEach(plant => {
              let invoiced = plant.form_values['7449'] === 'yes' ? true : false
              let photos = []
              if (plant.form_values['5829']) {
                plant.form_values['5829'].forEach(photo =>
                  photos.push(
                    <div key={photo.photo_id}>
                      <a
                        href={`https://web.fulcrumapp.com/api/v2/photos/${photo.photo_id}`}
                        target='_blank'
                        rel='noopener noreferrer'>
                        Photo
                      </a>
                      <br />
                    </div>
                  )
                )
              }
              this.setState(prevState => ({
                hiredPlant: [
                  ...prevState.hiredPlant,
                  {
                    from: 'diary',
                    id: plant.id,
                    supplier: plant.form_values['b889'],
                    equipment: plant.form_values['8c5c'],
                    start: plant.form_values['2851'],
                    end: plant.form_values['acac'],
                    total: calcTimeDiff(plant.form_values['2851'], plant.form_values['acac']),
                    docket: photos,
                    invoiced
                  }
                ]
              }))
            })
          }
          this.setState({
            SQEStats: [
              {
                id: diary.id,
                fuel: diary.form_values['da81'],
                water: diary.form_values['6872'],
                comments: diary.form_values['d5e3']
              }
            ]
          })
          if (diary.form_values['d5e3']) {
            let comments = []
            let listComments = diary.form_values['d5e3'].split('\n')
            listComments.forEach(comment => {
              comments.push(
                <div key={Math.random()}>
                  {comment}
                  <br />
                </div>
              )
            })
            this.setState(prevState => ({
              comments: [
                ...prevState.comments,
                {
                  id: diary.id,
                  comments: comments
                }
              ]
            }))
          }
          // PHOTOS
          if (diary.form_values['93bf']) {
            diary.form_values['93bf'].forEach(photo =>
              this.setState(prevState => ({
                sitePhotos: [...prevState.sitePhotos, { id: photo.photo_id, caption: photo.caption }]
              }))
            )
          }
        }
      })
    }
    this.state.selectedJob && this.setState({ jobInfo })
  }
  invoice(record, invoiced, type) {
    this.setState({
      loadingSubContractorsTable: true,
      loadingHiredPlantTable: true,
      loadingMaterialsTable: true
    })
    let originalPrestart = this.state.currentDailyPreStart
    let originalDiary = this.state.currentDailyDiary
    let originalContractorsState = this.state.subContractors
    let originalPlantState = this.state.hiredPlant
    let materialsDeliveredState = this.state.materialsDelivered
    let value = invoiced ? 'yes' : 'no'
    if (type === 'sub') {
      record.ids.forEach(id => {
        let index = originalPrestart.form_values['86b7'].findIndex(e => e.id === id)
        originalPrestart.form_values['86b7'][index].form_values['fb30'] = value
      })
    } else if (type === 'prestart') {
      let index = originalPrestart.form_values['86b7'].findIndex(e => e.id === record.id)
      originalPrestart.form_values['86b7'][index].form_values['fb30'] = value
    } else if (type === 'diary') {
      let index = originalDiary.form_values['f491'].findIndex(e => e.id === record.id)
      originalDiary.form_values['f491'][index].form_values['7449'] = value
    } else if (type === 'diaryMaterials') {
      let index = originalDiary.form_values['7d44'].findIndex(e => e.id === record.id)
      originalDiary.form_values['7d44'][index].form_values['e07a'] = value
    }
    if (type === 'sub' || type === 'prestart') {
      client.records
        .update(originalPrestart.id, originalPrestart)
        .then(resp => {
          if (type === 'sub') {
            let index = this.state.subContractors.findIndex(e => e.id === record.id)
            originalContractorsState[index].invoiced = invoiced
            this.setState({
              subContractors: originalContractorsState,
              loadingSubContractorsTable: false,
              loadingHiredPlantTable: false
            })
          } else if (type === 'prestart') {
            let index = this.state.hiredPlant.findIndex(e => e.id === record.id)
            originalPlantState[index].invoiced = invoiced
            this.setState({
              hiredPlant: originalPlantState,
              loadingSubContractorsTable: false,
              loadingHiredPlantTable: false
            })
          }
          message.success('Invoice Status Changed!')
        })
        .catch(err => {
          message.error('An error occured.')
          this.setState({
            loadingSubContractorsTable: false,
            loadingHiredPlantTable: false
          })
          console.log(err)
        })
    } else if (type === 'diary' || type === 'diaryMaterials') {
      client.records
        .update(originalDiary.id, originalDiary)
        .then(resp => {
          if (type === 'diary') {
            let index = this.state.hiredPlant.findIndex(e => e.id === record.id)
            originalPlantState[index].invoiced = invoiced
            this.setState({
              hiredPlant: originalPlantState,
              loadingSubContractorsTable: false,
              loadingHiredPlantTable: false,
              loadingMaterialsTable: false
            })
            message.success('Invoice Status Changed!')
          }
          if (type === 'diaryMaterials') {
            let index = this.state.materialsDelivered.findIndex(e => e.id === record.id)
            materialsDeliveredState[index].invoiced = invoiced
            this.setState({
              materialsDelivered: materialsDeliveredState,
              loadingSubContractorsTable: false,
              loadingHiredPlantTable: false,
              loadingMaterialsTable: false
            })
            message.success('Invoice Status Changed!')
          } else {
            this.setState({
              loadingSubContractorsTable: false,
              loadingHiredPlantTable: false,
              loadingMaterialsTable: false
            })
          }
        })
        .catch(err => {
          message.error('An error occured.')
          this.setState({
            loadingSubContractorsTable: false,
            loadingHiredPlantTable: false,
            loadingMaterialsTable: false
          })
          console.log(err)
        })
    }
  }
  render() {
    return (
      <div>
        {/* <Row style={{ marginBottom: 10 }}>
          {this.searchBar()}
        </Row> */}
        <Row gutter={10} style={{ position: 'sticky', background: '#fff', zIndex: 20, paddingTop: 10, top: 0 }}>
          <Col xs={24} sm={24} md={10} lg={10} xl={10} style={{ marginBottom: 10 }}>
            {this.selectJob()}
          </Col>
          <Col xs={24} sm={24} md={7} lg={7} xl={7}>
            {this.selectDate()}
          </Col>
          <Col xs={24} sm={24} md={7} lg={7} xl={7}>
            {this.dateButtons()}
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
            size='middle'
          />
        </div>
        <div className='boresPadding'>
          <Table
            size='small'
            rowKey='id'
            pagination={false}
            locale={{ emptyText: 'No Data' }}
            dataSource={this.state.comments}
            className='boreTables tableResizer dailyReportTables'
            columns={[{ title: 'Comments', key: 'comments', dataIndex: 'comments' }]}
          />
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
            size='middle'
          />
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
            columns={column.timesheetContractors(this.invoice)}
            loading={this.state.loadingSubContractorsTable}
            dataSource={this.state.subContractors}
            rowKey='id'
            size='middle'
          />
        </div>
        <div className='boresPadding'>
          <Row gutter={10}>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <Table
                pagination={false}
                locale={{ emptyText: 'No Data' }}
                title={() => 'Company & Contractor Plant'}
                bordered
                id='boresTableFour'
                className='boreTables tableResizer dailyReportTables'
                columns={column.companyPlant}
                dataSource={this.state.companyPlant}
                rowKey='id'
                size='middle'
              />
            </Col>
            <Col xs={24} sm={24} md={16} lg={16} xl={16}>
              <Table
                pagination={false}
                locale={{ emptyText: 'No Data' }}
                title={() => 'Hired Plant'}
                bordered
                id='boresTableFive'
                className='boreTables tableResizer dailyReportTables'
                columns={column.hiredPlant(this.invoice)}
                loading={this.state.loadingHiredPlantTable}
                dataSource={this.state.hiredPlant}
                rowKey='id'
                size='middle'
              />
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
            columns={column.materialsReceived(this.invoice)}
            dataSource={this.state.materialsDelivered}
            loading={this.state.loadingMaterialsTable}
            rowKey='id'
            size='middle'
          />
        </div>
        <div className='boresPadding'>
          <Table
            pagination={false}
            locale={{ emptyText: 'No Data' }}
            title={() => 'Site Photos'}
            bordered
            id='boresTableEight'
            className='boreTables tableResizer dailyReportTables'
            columns={column.sitePhotos}
            dataSource={this.state.sitePhotos}
            loading={this.state.loadingMaterialsTable}
            rowKey='id'
            size='middle'
          />
        </div>
        {/* <Button onClick={() => {
          this.printAll()
        }}>Print All Dates</Button> */}
      </div>
    )
  }
}

export default DailyReportSheet
