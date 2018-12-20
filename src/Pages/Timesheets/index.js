import React, { Component } from 'react'
import { Table, DatePicker, Row, Col, Select} from 'antd'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import * as column from './columns'
import './index.css'

const moment = extendMoment(Moment)

export default class Timesheets extends Component {
  state = {
    start: moment().format('YYYY-MM-DD'),
    end: null,
    data: null,
    noDays: 14
  }
  selectDate() {
    return (
      <DatePicker
        style={{ width: '100%', maxWidth: 200, paddingLeft: 20 }}
        onChange={(date) => {
          if (date) {
            this.setState({
              start: date.format('YYYY-MM-DD')
            })
          }
        }}
        defaultValue={moment()}
        format='Do MMM YYYY' />
    )
  }
  dateTo() {
    return (
      <DatePicker
        style={{ width: '100%', maxWidth: 200, paddingLeft: 20 }}
        value={moment(this.state.end, 'YYYY-MM-DD')}
        disabled
        format='Do MMM YYYY' />
    )
  }
  selectDayNumber(){
    return(
      <Select style={{width: '100%', maxWidth: 200, paddingLeft: 20 }} defaultValue={14} onChange={(val) => this.setState({noDays: val})}>
        <Select.Option key={14}>14</Select.Option>
        <Select.Option key={7}>7</Select.Option>
      </Select>
    )
  }
  componentDidMount() {
    this.loadTimesheet()
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.dailyPrestarts !== this.props.dailyPrestarts ||
       prevState.start !== this.state.start ||
        prevState.noDays !== this.state.noDays) {
      this.setState({
        data: null,
        end: moment(this.state.start, 'YYYY-MM-DD').add(this.state.noDays, 'days').format('YYYY-MM-DD')
      }, () => this.loadTimesheet())
    }
  }
  calcTimeDiff(startTime, endTime) {
    if (!startTime || !endTime) {
      return parseFloat(0)
    }
    // parse time using 24-hour clock and use UTC to prevent DST issues
    var start = moment.utc(startTime, "h.mm");
    var end = moment.utc(endTime, "h.mm");
    // account for crossing over to midnight the next day
    if (end.isBefore(start)) end.add(1, 'day');
    // calculate the duration
    var d = moment.duration(end.diff(start));
    // format a string result
    return parseFloat(moment.utc(+d).format('HH.mm'))
  }
  calcOverTimeOne(startTime, endTime, day) {
    if (startTime && endTime) {

      startTime = moment(`2018-12-10 ${startTime}`, 'YYYY-MM-DD h.mm');
      endTime = moment(`2018-12-10 ${endTime}`, 'YYYY-MM-DD h.mm');

      var dayEndTime = moment(`2018-12-10 20:00`, 'YYYY-MM-DD HH:mm');
      var overtimeOne = moment.duration(0);

      if (endTime.isAfter(dayEndTime)) {
        var time = startTime.isAfter(dayEndTime) ? startTime : dayEndTime;
        overtimeOne = moment.duration(endTime.diff(time));
      }
      if (day === 'Saturday') {
        overtimeOne = moment.duration(endTime.diff(startTime));
      }
      if (overtimeOne.as('hours') === 2 || overtimeOne.as('hours') > 2) {
        return 2
      } else {
        return overtimeOne.as('hours')
      }
    } else {
      return 0
    }
  }
  calcOverTimeTwo(startTime, endTime, day) {
    if (startTime && endTime) {

      startTime = moment(`2018-12-10 ${startTime}`, 'YYYY-MM-DD h.mm');
      endTime = moment(`2018-12-10 ${endTime}`, 'YYYY-MM-DD h.mm');

      var dayEndTimeTwo = moment(`2018-12-10 22:00`, 'YYYY-MM-DD HH:mm');
      var overtimeTwo = moment.duration(0);

      if (endTime.isAfter(dayEndTimeTwo)) {
        var time = startTime.isAfter(dayEndTimeTwo) ? startTime : dayEndTimeTwo;
        overtimeTwo = moment.duration(endTime.diff(time));
      }
      if (day === 'Saturday') {
        overtimeTwo = moment.duration(endTime.diff(startTime));
        overtimeTwo.subtract(2, 'hours')
      }
      if (day === 'Sunday') {
        overtimeTwo = moment.duration(endTime.diff(startTime));
      }
      return overtimeTwo.as('hours')
    } else {
      return 0
    }
  }
  loadTimesheet() {
    var data = [];
    this.props.dailyPrestarts.forEach(prestart => {
      if ((prestart.form_values['80e9'] > this.state.start && prestart.form_values['80e9'] < this.state.end) || (prestart.form_values['80e9'] === this.state.start || prestart.form_values['80e9'] === this.state.end)) {
        prestart.form_values['86b7'].forEach(entry => {
          if (entry.form_values['cc82'] === 'company_personnel') {
            var start = (entry.form_values['33d3']) ? entry.form_values['33d3'].choice_values[1] : '';
            var end = (entry.form_values['2748']) ? entry.form_values['2748'].choice_values[1] : '';
            var hoursDiff = this.calcTimeDiff(start, end);
            var overTimeOne = (this.calcOverTimeOne(start, end, moment(prestart.form_values['80e9']).format('dddd')) !== 0) ? this.calcOverTimeOne(start, end, moment(prestart.form_values['80e9']).format('dddd')) : 0
            var overTimeTwo = (this.calcOverTimeTwo(start, end, moment(prestart.form_values['80e9']).format('dddd')) !== 0) ? this.calcOverTimeTwo(start, end, moment(prestart.form_values['80e9']).format('dddd')) : 0

            var obj = {
              id: entry.id,
              name: entry.form_values[8464].choice_values[0],
            };
            const index = data.findIndex((e) => e.name === obj.name);
            if (index === -1) {
              obj[moment(prestart.form_values['80e9']).format('D-MMM')] = hoursDiff;
              obj.hours = hoursDiff;
              obj.ot1 = overTimeOne
              obj.ot2 = overTimeTwo
              obj[moment(prestart.form_values['80e9']).format('Do-MMM') + '_start'] = start
              obj[moment(prestart.form_values['80e9']).format('Do-MMM') + '_end'] = end
              data.push(obj);
            } else {
              if (data[index][moment(prestart.form_values['80e9']).format('D-MMM')]) {
                data[index][moment(prestart.form_values['80e9']).format('D-MMM')] += hoursDiff;
                data[index].hours += hoursDiff
                data[index].ot1 += overTimeOne
                data[index].ot2 += overTimeTwo
                data[index][moment(prestart.form_values['80e9']).format('Do-MMM') + '_start'] = start
                data[index][moment(prestart.form_values['80e9']).format('Do-MMM') + '_end'] = end
              } else {
                Object.assign(data[index], { [moment(prestart.form_values['80e9']).format('D-MMM')]: hoursDiff })
                data[index].hours += hoursDiff
                data[index].ot1 += overTimeOne
                data[index].ot2 += overTimeTwo
                data[index][moment(prestart.form_values['80e9']).format('Do-MMM') + '_start'] = start
                data[index][moment(prestart.form_values['80e9']).format('Do-MMM') + '_end'] = end
              }
            }
          }
        })
      }
    })
    this.setState({
      data
    })
  }
  render() {
    return (
      <div>
        <div style={{ marginBottom: 10 }}>
          <Row gutter={10}>
            <Col span={8}><h2>From: {this.selectDate()}</h2></Col>
            <Col span={8}><h2>To: {this.dateTo()}</h2></Col>
            <Col span={8}><h2>Days: {this.selectDayNumber()}</h2></Col>
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
          size="middle" />
      </div>
    )
  }
}