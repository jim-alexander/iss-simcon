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
      start: moment().startOf('week').format('YYYY-MM-DD'),
      end: moment().endOf('week').format('YYYY-MM-DD')
    },
    data: null,
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
        onChange={(date) => {
          if (date) {
            this.setState({
              selectedWeek: {
                start: date.startOf('week').format('YYYY-MM-DD'),
                end: date.endOf('week').format('YYYY-MM-DD')
              }
            })}
          }
        }
        defaultValue={moment()} />
    )
  }
  componentDidMount() {
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
    var nameList = [];
    var data = [{
      id: 0,
      title: 'Job',
      sun: '',
      mon: '',
      tue: '',
      wed: '',
      thur: '',
      fri: '',
      sat: ''
    }, {
      id: 1,
      title: 'Start',
      sun: '',
      mon: '',
      tue: '',
      wed: '',
      thur: '',
      fri: '',
      sat: ''
    }, {
      id: 2,
      title: 'Break',
      sun: '',
      mon: '',
      tue: '',
      wed: '',
      thur: '',
      fri: '',
      sat: ''
    }, {
      id: 3,
      title: 'Finish',
      sun: '',
      mon: '',
      tue: '',
      wed: '',
      thur: '',
      fri: '',
      sat: '',
    }]
    this.props.dailyPrestarts.forEach(prestart => {
      if (prestart.form_values['86b7']) {
        prestart.form_values['86b7'].forEach(entry => {
          if (entry.form_values['cc82'] === 'company_personnel') {
            nameList.push(entry.form_values['8464'].choice_values[0])
            if (this.state.selectedName && this.state.selectedWeek.start) {
              var prestartDate = new Date(prestart.form_values['80e9']).getTime();
              var checkStart = new Date(this.state.selectedWeek.start).getTime();
              var checkEnd = new Date(this.state.selectedWeek.end).getTime();
              if ((prestartDate > checkStart && prestartDate < checkEnd) || (prestartDate === checkStart || prestartDate === checkEnd)) {
                if (entry.form_values['8464'].choice_values[0] === this.state.selectedName) {
                  if (moment(prestart.form_values['80e9']).format('dddd') === 'Sunday') {
                    data[1].sun = entry.form_values['d294']; //Start
                    data[3].sun = entry.form_values['1696'] //finish
                  } else if (moment(prestart.form_values['80e9']).format('dddd') === 'Monday') {
                    data[1].mon = entry.form_values['d294']; //Start
                    data[3].mon = entry.form_values['1696'] //finish
                  } else if (moment(prestart.form_values['80e9']).format('dddd') === 'Tuesday') {
                    data[1].tue = entry.form_values['d294']; //Start
                    data[3].tue = entry.form_values['1696'] //finish
                  } else if (moment(prestart.form_values['80e9']).format('dddd') === 'Wednesday') {
                    data[1].wed = entry.form_values['d294']; //Start
                    data[3].wed = entry.form_values['1696'] //finish
                  } else if (moment(prestart.form_values['80e9']).format('dddd') === 'Thursday') {
                    data[1].thur = entry.form_values['d294']; //Start
                    data[3].thur = entry.form_values['1696'] //finish
                  } else if (moment(prestart.form_values['80e9']).format('dddd') === 'Friday') {
                    data[1].fri = entry.form_values['d294']; //Start
                    data[3].fri = entry.form_values['1696'] //finish
                  } else if (moment(prestart.form_values['80e9']).format('dddd') === 'Saturday') {
                    data[1].sat = entry.form_values['d294']; //Start
                    data[3].sat = entry.form_values['1696'] //finish
                  }
                }
              }
            }
          }
        })
      }
    })
    function sort_unique(arr) {
      return arr.sort().filter(function (el, i, a) {
        return (i === a.indexOf(el));
      });
    }
    this.setState({
      nameList: sort_unique(nameList),
      data
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