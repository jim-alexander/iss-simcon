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
    timeSet: 12
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
            })
          }
        }
        }
        defaultValue={moment()}
        renderExtraFooter={() => 'This Week'} />
    )
  }
  selectTimeOption() {
    return (
      <Select style={{ width: '100%' }} onChange={(val) => this.setState({ timeSet: parseInt(val, 10) })} defaultValue='12 Hour'>
        <Option key={12}>12 Hour</Option>
        <Option key={24}>24 Hour</Option>
      </Select>
    )
  }
  componentDidMount() {
    this.loadTimesheet()
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.dailyPrestarts !== this.props.dailyPrestarts || prevState.selectedWeek !== this.state.selectedWeek || prevState.selectedName !== this.state.selectedName || prevState.timeSet !== this.state.timeSet) {
      this.setState({
        nameList: [],
        data: null
      }, () => this.loadTimesheet())
    }
  }
  loadTimesheet() {
    var nameList = [];
    var data = [{
      id: 0,
      title: 'Job',
      sun: null,
      mon: null,
      tue: null,
      wed: null,
      thur: null,
      fri: null,
      sat: null
    }, {
      id: 1,
      title: 'Start',
      sun: null,
      mon: null,
      tue: null,
      wed: null,
      thur: null,
      fri: null,
      sat: null
    }, {
      id: 2,
      title: 'Break',
      sun: null,
      mon: null,
      tue: null,
      wed: null,
      thur: null,
      fri: null,
      sat: null
    }, {
      id: 3,
      title: 'Finish',
      sun: null,
      mon: null,
      tue: null,
      wed: null,
      thur: null,
      fri: null,
      sat: null,
    }, {
      id: 4,
      title: 'Total',
      sun: null,
      mon: null,
      tue: null,
      wed: null,
      thur: null,
      fri: null,
      sat: null,
    }]
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

                  if (this.state.timeSet === 12) {
                    var startTime = (moment(entry.form_values['d294'], 'HH:mm').isValid()) ? moment(entry.form_values['d294'], 'HH:mm').format('h:mm a') : ''
                    var endTime = (moment(entry.form_values['1696'], 'HH:mm').isValid()) ? moment(entry.form_values['1696'], 'HH:mm').format('h:mm a') : ''
                  } else {
                    startTime = entry.form_values['d294']
                    endTime = entry.form_values['1696']
                  }
                  var total = calcTimeDiff(entry.form_values['d294'], entry.form_values['1696']);

                  if (moment(prestart.form_values['80e9']).format('dddd') === 'Sunday') {
                    data[1].sun = startTime; //Start
                    data[3].sun = endTime //finish
                    data[4].sun = total //Total
                  } else if (moment(prestart.form_values['80e9']).format('dddd') === 'Monday') {
                    data[1].mon = startTime; //Start
                    data[3].mon = endTime //finish
                    data[4].mon = total //Total
                  } else if (moment(prestart.form_values['80e9']).format('dddd') === 'Tuesday') {
                    data[1].tue = startTime; //Start
                    data[3].tue = endTime //finish
                    data[4].tue = total //Total
                  } else if (moment(prestart.form_values['80e9']).format('dddd') === 'Wednesday') {
                    data[1].wed = startTime; //Start
                    data[3].wed = endTime //finish
                    data[4].wed = total //Total
                  } else if (moment(prestart.form_values['80e9']).format('dddd') === 'Thursday') {
                    data[1].thur = startTime; //Start
                    data[3].thur = endTime //finish
                    data[4].thur = total //Total
                  } else if (moment(prestart.form_values['80e9']).format('dddd') === 'Friday') {
                    data[1].fri = startTime; //Start
                    data[3].fri = endTime //finish
                    data[4].fri = total //Total
                  } else if (moment(prestart.form_values['80e9']).format('dddd') === 'Saturday') {
                    data[1].sat = startTime; //Start
                    data[3].sat = endTime //finish
                    data[4].sat = total //Total
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
        <Row gutter={10}>
          <Col span={10}>
            {this.selectEmployee()}
          </Col>
          <Col span={9}>
            {this.selectDate()}
          </Col>
          <Col span={5}>
            {this.selectTimeOption()}
          </Col>
        </Row>
        <Table
          pagination={false}
          bordered
          id='boresTableOne'
          className='boreTables tableResizer dailyReportTables'
          columns={column.timesheet}
          dataSource={this.state.data}
          rowClassName={(record) => {
            if (record.title === 'Total') {
              return 'total'

            }

          }}
          rowKey='id'
          size="middle" />
      </div>
    )
  }
}