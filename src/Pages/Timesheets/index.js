import React, { Component } from 'react'
import { Table, DatePicker, Row, Col } from 'antd'
import moment from 'moment'
import * as column from './columns'
import './index.css'

export default class Timesheets extends Component {
  state = {
    start: moment().format('YYYY-MM-DD'),
    end: null,
    data: null,
  }
  selectDate() {
    return (
      <DatePicker
        style={{ width: '100%', maxWidth: 250, paddingLeft: 20 }}
        onChange={(date) => {
          if (date) {
            this.setState({
              start: date.format('YYYY-MM-DD')
            })
          }
        }}
        defaultValue={moment()}
        format='Do MMMM YYYY' />
    )
  }
  dateTo() {
    return (
      <DatePicker
        style={{ width: '100%', maxWidth: 250, paddingLeft: 20 }}
        disabled={true}
        value={moment(this.state.end, 'YYYY-MM-DD')}
        format='Do MMMM YYYY' />
    )
  }
  componentDidMount() {
    this.loadTimesheet()
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.dailyPrestarts !== this.props.dailyPrestarts || prevState.start !== this.state.start || prevState.selectedName !== this.state.selectedName || prevState.timeSet !== this.state.timeSet) {
      this.setState({
        data: null,
        end: moment(this.state.start, 'YYYY-MM-DD').add(13, 'days').format('YYYY-MM-DD')
      }, () => this.loadTimesheet())
    }
  }
  calcTimeDiff(startTime, endTime) {
    if (!startTime || !endTime) {
      return '00:00'
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
  loadTimesheet() {
    var data = [];
    this.props.dailyPrestarts.forEach(prestart => {
      if ((prestart.form_values['80e9'] > this.state.start && prestart.form_values['80e9'] < this.state.end) || (prestart.form_values['80e9'] === this.state.start || prestart.form_values['80e9'] === this.state.end)) {
        prestart.form_values['86b7'].forEach(entry => {
          if (entry.form_values['cc82'] === 'company_personnel') {
            var start = (entry.form_values['33d3']) ? entry.form_values['33d3'].choice_values[1] : '';
            var end = (entry.form_values['2748']) ? entry.form_values['2748'].choice_values[1] : '';
            var hoursDiff = this.calcTimeDiff(start, end);
            var obj = {
              id: entry.id,
              name: entry.form_values[8464].choice_values[0],
            };
            const index = data.findIndex((e) => e.name === obj.name);
            if (index === -1) {
              obj[moment(prestart.form_values['80e9']).format('D-MMM')] = hoursDiff
              data.push(obj);
            } else {
              if (data[index][moment(prestart.form_values['80e9']).format('D-MMM')]) {
                data[index][moment(prestart.form_values['80e9']).format('D-MMM')] += hoursDiff
              } else {
                Object.assign(data[index], { [moment(prestart.form_values['80e9']).format('D-MMM')]: hoursDiff })
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
            <Col span={12}><h2>From: {this.selectDate()}</h2></Col>
            <Col span={12}><h2>To: {this.dateTo()}</h2></Col>
          </Row>

        </div>
        <Table
          pagination={false}
          bordered
          id='timesheet'
          className='boreTables tableResizer dailyReportTables'
          columns={column.timesheet(moment(this.state.start).format('D-MMM-YYYY'))}
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