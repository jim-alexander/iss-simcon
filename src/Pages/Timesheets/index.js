import React, { Component } from 'react'
import { Table, DatePicker, Row, Col, Select } from 'antd'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import { db } from '../../firebase'
import * as column from './columns'
import './index.css'

const moment = extendMoment(Moment)

export default class Timesheets extends Component {
  state = {
    start: moment().subtract(14, 'days').format('YYYY-MM-DD'),
    end: moment().subtract(1, 'days').format('YYYY-MM-DD'),
    data: null,
    noDays: 14
  }
  selectDate() {
    return (
      <DatePicker
        style={{ width: '100%' }}
        onChange={(date) => {
          if (date) {
            this.setState({
              start: date.format('YYYY-MM-DD')
            })
          } else {
            this.setState({
              start: '1996-01-01'
            })
          }
        }}
        defaultValue={moment().subtract(14, 'days')}
        format='Do MMM YYYY' />
    )
  }
  dateTo() {
    return (
      <DatePicker
        style={{ width: '100%' }}
        value={moment(this.state.end, 'YYYY-MM-DD')}
        disabled
        format='Do MMM YYYY' />
    )
  }
  selectDayNumber() {
    return (
      <Select style={{ width: '100%' }} value={this.state.noDays} onChange={(val) => this.setState({ noDays: val })}>
        <Select.Option key={14}>14</Select.Option>
        <Select.Option key={7}>7</Select.Option>
      </Select>
    )
  }
  componentDidMount() {
    this.loadTimesheet()
    db.lastViewedPage(this.props.user.id, 'timesheets');

  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.dailyPrestarts !== this.props.dailyPrestarts ||
      prevState.start !== this.state.start ||
      prevState.noDays !== this.state.noDays) {
      db.lastViewedPage(this.props.user.id, 'timesheets');

      this.setState({
        data: null,
        end: moment(this.state.start, 'YYYY-MM-DD').add((this.state.noDays - 1), 'days').format('YYYY-MM-DD')
      }, () => this.loadTimesheet())
    }
  }
  //TODO: Total hours fix and OT1 OT2 check 
  calcTimeDiff(startTime, endTime) {
    if (!startTime || !endTime) {
      return null
    }
    // parse time using 24-hour clock and use UTC to prevent DST issues
    var start = moment.utc(startTime, "h.mm");
    var end = moment.utc(endTime, "h.mm");
    // account for crossing over to midnight the next day
    if (end.isBefore(start)) end.add(1, 'day');
    // calculate the duration
    var d = moment.duration(end.diff(start));
    // format a string result    
    return moment.utc(+d).format('HH.mm')
  }
  calcOverTimeOne(startTime, endTime, day) {
    if (startTime && endTime) {

      startTime = moment(`2018-12-10 ${startTime}`, 'YYYY-MM-DD h.mm');
      endTime = moment(`2018-12-10 ${endTime}`, 'YYYY-MM-DD h.mm');

      let overtimeOne = moment.duration(0);
      let hours = moment.duration(endTime.diff(startTime))

      if (moment(day, 'dddd').day() <= 5 && moment(day, 'dddd').day() >= 1) {
        if (hours.asHours() >= 8 && hours.asHours() <= 10) {
          overtimeOne.add(hours.subtract(8, 'hours'))
        }
        else if (hours.asHours() > 10) {
          overtimeOne.add(2, 'hours')
        }
      }
      if (day === 'Saturday') {
        if (hours.asHours() <= 2) {
          overtimeOne.add(hours)
        } else if (hours.asHours() > 2) {
          overtimeOne.add(2, 'hours')
        }
      }
      return overtimeOne.asHours()

    } else {
      return 0
    }
  }
  calcOverTimeTwo(startTime, endTime, day) {
    if (startTime && endTime) {

      startTime = moment(`2018-12-10 ${startTime}`, 'YYYY-MM-DD h.mm');
      endTime = moment(`2018-12-10 ${endTime}`, 'YYYY-MM-DD h.mm');

      let overtimeTwo = moment.duration(0);
      let hours = moment.duration(endTime.diff(startTime))

      if (hours.asHours() > 10) {
        overtimeTwo.add(hours.subtract(10, 'hours'))
      }
      if (day === 'Saturday') {
        if (hours.asHours() > 2) {
          overtimeTwo.add(hours.subtract(2, 'hours'))
        } else {
          overtimeTwo.add(hours)
        }
      }
      if (day === 'Sunday') {
        overtimeTwo.add(hours)
      }
      return overtimeTwo.asHours()
    } else {
      return 0
    }
  }
  loadTimesheet() {
    var data = [];
    this.props.dailyPrestarts.forEach(prestart => {
      if ((prestart.form_values['80e9'] > this.state.start && prestart.form_values['80e9'] < this.state.end) || (prestart.form_values['80e9'] === this.state.start || prestart.form_values['80e9'] === this.state.end)) {
        if (prestart.form_values['86b7']) {
          prestart.form_values['86b7'].forEach(entry => {
            if (entry.form_values['cc82'] === 'company_personnel') {
              var start = (entry.form_values['33d3']) ? entry.form_values['33d3'].choice_values[1] : undefined;
              var end = (entry.form_values['2748']) ? entry.form_values['2748'].choice_values[1] : undefined;

              var hoursDiff = this.calcTimeDiff(start, end);
              var overTimeOne = (this.calcOverTimeOne(start, end, moment(prestart.form_values['80e9']).format('dddd')) !== 0) ? this.calcOverTimeOne(start, end, moment(prestart.form_values['80e9']).format('dddd')) : 0
              var overTimeTwo = (this.calcOverTimeTwo(start, end, moment(prestart.form_values['80e9']).format('dddd')) !== 0) ? this.calcOverTimeTwo(start, end, moment(prestart.form_values['80e9']).format('dddd')) : 0

              var addHours = (hoursDiff !== null) ? moment(hoursDiff, 'HH.mm').format('HH') : '00'
              var addMins = (hoursDiff !== null) ? moment(hoursDiff, 'HH.mm').format('m') : '0'
              var name = (entry.form_values['57fb']) ? entry.form_values['57fb'].choice_values[0] : null
              var obj = {
                id: entry.id,
                name,
              };
              var travel = (entry.form_values['935b']) ? parseFloat(entry.form_values['935b']) : 0
              var lafha = (entry.form_values['b574'] === 'yes') ? 1 : 0

              const index = data.findIndex((e) => e.name === obj.name);

              if (index === -1) {
                obj[moment(prestart.form_values['80e9']).format('D-MMM')] = moment(hoursDiff, 'HH.mm').format('HH:mm');
                obj.ot1 = overTimeOne;
                obj.ot2 = overTimeTwo;
                obj.travel = travel;
                obj.lafha = lafha;
                obj.hours = moment.duration({
                  hours: addHours,
                  minutes: addMins
                })
                obj.hours_minus = moment.duration({
                  hours: addHours,
                  minutes: addMins
                })
                  .subtract(obj.ot1, 'hours')
                  .subtract(obj.ot2, 'hours')

                data.push(obj);
              } else {
                //Called when multiple signins occure on prestart
                if (data[index][moment(prestart.form_values['80e9']).format('D-MMM')]) {
                  data[index][moment(prestart.form_values['80e9']).format('D-MMM')] += " " + moment(hoursDiff, 'HH.mm').format('HH:mm');
                  data[index].hours = data[index].hours.add(parseInt(addHours, 0), 'hours').add(parseInt(addMins, 0), 'minutes')
                  data[index].hours_minus = data[index].hours_minus
                    .add(parseInt(addHours, 0), 'hours')
                    .add(parseInt(addMins, 0), 'minutes')
                    .subtract(overTimeOne, 'hours')
                    .subtract(overTimeTwo, 'hours')
                  data[index].ot1 += overTimeOne;
                  data[index].ot2 += overTimeTwo;
                  data[index].travel += travel;
                  data[index].lafha += lafha;
                } else {
                  Object.assign(data[index], { [moment(prestart.form_values['80e9']).format('D-MMM')]: moment(hoursDiff, 'HH.mm').format('HH:mm') })
                  data[index].hours = data[index].hours.add(parseInt(addHours, 0), 'hours').add(parseInt(addMins, 0), 'minutes')
                  data[index].hours_minus = data[index].hours_minus
                    .add(parseInt(addHours, 0), 'hours')
                    .add(parseInt(addMins, 0), 'minutes')
                    .subtract(overTimeOne, 'hours')
                    .subtract(overTimeTwo, 'hours')
                  data[index].ot1 += overTimeOne;
                  data[index].ot2 += overTimeTwo;
                  data[index].travel += travel;
                  data[index].lafha += lafha;
                }
              }
            }
          })
        }

      }
    })
    this.setState({
      data
    })
  }
  render() {
    return (
      <div>
        <div>
          <Row gutter={10}>
            <Col xs={0} sm={0} md={10} lg={10} xl={10}><h3>From</h3></Col>
            <Col xs={0} sm={0} md={10} lg={10} xl={10}><h3>To</h3></Col>
            <Col xs={0} sm={0} md={4} lg={4} xl={4}><h3>Days</h3></Col>
          </Row>
          <Row gutter={10}>
            <Col xs={24} sm={24} md={10} lg={10} xl={10} style={{ marginBottom: '10px' }}>{this.selectDate()}</Col>
            <Col xs={24} sm={24} md={10} lg={10} xl={10} style={{ marginBottom: '10px' }}>{this.dateTo()}</Col>
            <Col xs={24} sm={24} md={4} lg={4} xl={4} style={{ marginBottom: '10px' }}>{this.selectDayNumber()}</Col>
          </Row>
        </div>
        <Table
          pagination={false}
          bordered
          id='timesheet'
          className='boreTables tableResizer dailyReportTables'
          columns={column.timesheet(moment(this.state.start).format('D-MMM-YYYY'), this.state.noDays)}
          dataSource={this.state.data}
          rowClassName={(record) => {
            if (record.name === ' ') {
              return 'date'
            }
          }}
          rowKey='id'
          onSelect={(record, selected, selectedRows) => {
            console.log(record, selected, selectedRows)
          }}
          size="middle" />
      </div>
    )
  }
}