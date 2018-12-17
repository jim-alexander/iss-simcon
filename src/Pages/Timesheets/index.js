import React, { Component } from 'react'
import { Select, Table, DatePicker, Row, Col } from 'antd'
import moment from 'moment'
import * as column from './columns'
import './index.css'

const Option = Select.Option;

export default class Timesheets extends Component {
  state = {
    nameList: [],
    selectedName: null,
    selectedWeek: {
      start: null,
      end: null
    },
    data: null
  }
  selectEmployee() {
    return (
      <Select
        showSearch
        placeholder="Select employee"
        style={{ width: '100%', paddingBottom: 10 }}
        onChange={(name) => this.setState({ selectedName: name })}>
        {this.state.nameList.map(name => {
          return <Option key={name}>{name}</Option>
        })}
      </Select>
    )
  }
  selectDate() {
    return (
      <DatePicker.WeekPicker
        style={{ width: '100%' }}
        onChange={(date) => this.setState({
          selectedWeek: {
            start: date.startOf('week').format('YYYY-MM-DD'),
            end: date.endOf('week').format('YYYY-MM-DD')
          }
        })} />
    )
  }
  componentDidMount(){
    this.loadTimesheet()
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.dailyPrestarts !== this.props.dailyPrestarts || prevState.selectedWeek !== this.state.selectedWeek || prevState.selectedName !== this.state.selectedName) {
      this.setState({
        nameList: [],
        data: null
      }, () => this.loadTimesheet())
    }
  }
  //TODO: Push only unqiue names to name list
  //TODO: Push timesheet data to object for table

  loadTimesheet() {
    this.props.dailyPrestarts.forEach(prestart => {
      if (prestart.form_values['86b7']) {
        prestart.form_values['86b7'].forEach(entry => {
          if (entry.form_values['cc82'] === 'company_personnel') {
            this.setState(prevState => ({
              nameList: [...prevState.nameList, entry.form_values['8464'].choice_values[0]]
            }))

            if (this.state.selectedName && this.state.selectedWeek.start) {
              var prestartDate = new Date(prestart.form_values['80e9']).getTime();
              var checkStart = new Date(this.state.selectedWeek.start).getTime();
              var checkEnd = new Date(this.state.selectedWeek.end).getTime();
              var sunday = {}, monday = {}, tuesday = {}, wednesday = {}, thursday = {}, friday = {}, saturday = {};

              if ((prestartDate > checkStart && prestartDate < checkEnd) || (prestartDate === checkStart || prestartDate === checkEnd)) {
                if (entry.form_values['8464'].choice_values[0] === this.state.selectedName) {
                  console.log(prestart, entry);
                  if (moment(prestart.form_values['80e9']).format('dddd') === 'Sunday') {
                    sunday = {
                      job: '', //prestart.project_id
                      start: entry.form_values['d294'],
                      break: '.5',
                      finish: entry.form_values['1696']
                    }
                  } else if (moment(prestart.form_values['80e9']).format('dddd') === 'Monday') {
                     monday = {
                      job: '', //prestart.project_id
                      start: entry.form_values['d294'],
                      break: '.5',
                      finish: entry.form_values['1696']
                    }
                  } else if (moment(prestart.form_values['80e9']).format('dddd') === 'Tuesday') {
                     tuesday = {
                      job: '', //prestart.project_id
                      start: entry.form_values['d294'],
                      break: '.5',
                      finish: entry.form_values['1696']
                    }
                  } else if (moment(prestart.form_values['80e9']).format('dddd') === 'Wednesday') {
                     wednesday = {
                      job: '', //prestart.project_id
                      start: entry.form_values['d294'],
                      break: '.5',
                      finish: entry.form_values['1696']
                    }
                  } else if (moment(prestart.form_values['80e9']).format('dddd') === 'Thursday') {
                     thursday = {
                      job: '', //prestart.project_id
                      start: entry.form_values['d294'],
                      break: '.5',
                      finish: entry.form_values['1696']
                    }
                  } else if (moment(prestart.form_values['80e9']).format('dddd') === 'Friday') {
                     friday = {
                     job: '', //prestart.project_id
                      start: entry.form_values['d294'],
                      break: '.5',
                      finish: entry.form_values['1696']
                    }
                  } else if (moment(prestart.form_values['80e9']).format('dddd') === 'Saturday') {
                     saturday = {
                      job: '', //prestart.project_id
                      start: entry.form_values['d294'],
                      break: '.5',
                      finish: entry.form_values['1696']
                    }
                  } 
                  this.setState({
                    data: [{
                      id: 0,
                      title: 'Job',
                      sun: '1234',
                      mon: '1432',
                      tue: '1331',
                      wed: '1231',
                      thur: '1231',
                      fri: '1233',
                      sat: '1231'
                    },{
                      id: 1,
                      title: 'Start',
                      sun: sunday.start,
                      mon: monday.start,
                      tue: tuesday.start,
                      wed: wednesday.start,
                      thur: thursday.start,
                      fri: friday.start,
                      sat: saturday.start
                    },{
                      id: 2,
                      title: 'Break',
                      sun: '.5',
                      mon: '.5',
                      tue: '.5',
                      wed: '.5',
                      thur: '.5',
                      fri: '.5',
                      sat: '.5'
                    },{
                      id: 3,
                      title: 'Finish',
                      sun: sunday.finish,
                      mon: monday.finish,
                      tue: tuesday.finish,
                      wed: wednesday.finish,
                      thur: thursday.finish,
                      fri: friday.finish,
                      sat: saturday.finish,
                    }]
                  })
                }
              } 
            }
          }
        })
      }
    })
  }
  render() {    
    return (
      <div>
        <Row>
          <Col span={16} style={{ paddingRight: 5 }}>
            {this.selectEmployee()}
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
          columns={column.timesheet}
          dataSource={this.state.data}
          rowKey='id'
          size="middle" />
      </div>
    )
  }
}