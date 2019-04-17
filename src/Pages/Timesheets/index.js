import React, {Component} from 'react';
import {Table, DatePicker, Row, Col, Select} from 'antd';
import Moment from 'moment';
import {extendMoment} from 'moment-range';
import {db} from '../../firebase';
import * as column from './columns';
import './index.css';

const moment = extendMoment(Moment);

export default class Timesheets extends Component {
  state = {
    start: moment()
      .subtract(14, 'days')
      .format('YYYY-MM-DD'),
    end: moment()
      .subtract(1, 'days')
      .format('YYYY-MM-DD'),
    data: null,
    noDays: 14
  };
  selectDate() {
    return (
      <DatePicker
        style={{width: '100%'}}
        onChange={date => {
          if (date) {
            this.setState({
              start: date.format('YYYY-MM-DD')
            });
          } else {
            this.setState({
              start: '1996-01-01'
            });
          }
        }}
        defaultValue={moment().subtract(14, 'days')}
        format='Do MMM YYYY'
      />
    );
  }
  dateTo() {
    return (
      <DatePicker
        style={{width: '100%'}}
        value={moment(this.state.end, 'YYYY-MM-DD')}
        disabled
        format='Do MMM YYYY'
      />
    );
  }
  selectDayNumber() {
    return (
      <Select
        style={{width: '100%'}}
        value={this.state.noDays}
        onChange={val => this.setState({noDays: val})}>
        <Select.Option key={14}>14</Select.Option>
        <Select.Option key={7}>7</Select.Option>
      </Select>
    );
  }
  componentDidMount() {
    this.loadTimesheet();
    db.lastViewedPage(this.props.user.id, 'timesheets');
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.dailyPrestarts !== this.props.dailyPrestarts ||
      prevState.start !== this.state.start ||
      prevState.noDays !== this.state.noDays
    ) {
      db.lastViewedPage(this.props.user.id, 'timesheets');

      this.setState(
        {
          data: null,
          end: moment(this.state.start, 'YYYY-MM-DD')
            .add(this.state.noDays - 1, 'days')
            .format('YYYY-MM-DD')
        },
        () => this.loadTimesheet()
      );
    }
  }
  //TODO: Total hours fix and OT1 OT2 check
  calcTimeDiff(startTime, endTime, lunch, type) {
    if (!startTime || !endTime) {
      return null;
    }
    let breakTime = lunch === 'yes' || lunch === undefined ? true : false;
    // parse time using 24-hour clock and use UTC to prevent DST issues
    var start = moment.utc(startTime, 'h.mm');
    var end = moment.utc(endTime, 'h.mm');
    // account for crossing over to midnight the next day
    if (end.isBefore(start)) end.add(1, 'day');
    // calculate the duration
    var d = moment.duration(end.diff(start));
    // format a string result
    if (breakTime) {
      d.subtract(30, 'minutes');
    }
    if (type === 'duration') {
      return d;
    }
    return moment.utc(+d).format('H.mm');
  }
  calcOverTimeOne(startTime, endTime, day, lunch) {
    let hours = this.calcTimeDiff(startTime, endTime, lunch, 'duration');
    if (hours) {
      let overtimeOne = moment.duration(0);
      if (day === 'Sunday') {
        return 0;
      }
      if (parseFloat(startTime) > 18) {
        return 0;
      }
      if (moment(day, 'dddd').day() <= 5 && moment(day, 'dddd').day() >= 1) {
        if (hours.asHours() >= 8 && hours.asHours() <= 10) {
          overtimeOne.add(hours.subtract(8, 'hours'));
        } else if (hours.asHours() > 10) {
          overtimeOne.add(2, 'hours');
        }
      }
      if (day === 'Saturday') {
        if (hours.asHours() <= 2) {
          overtimeOne.add(hours);
        } else if (hours.asHours() > 2) {
          overtimeOne.add(2, 'hours');
        }
      }
      return overtimeOne.asHours();
    } else {
      return 0;
    }
  }
  calcOverTimeTwo(startTime, endTime, day, lunch) {
    let hours = this.calcTimeDiff(startTime, endTime, lunch, 'duration');
    if (hours) {
      let totalOvertime = moment.duration(0);

      if (day === 'Sunday') {
        totalOvertime.add(hours);
      } else if (day === 'Saturday') {
        if (hours.asHours() > 2) {
          totalOvertime.add(hours.subtract(2, 'hours'));
        } else {
          totalOvertime.add(hours);
        }
      } else {
        if (hours.asHours() > 10) {
          totalOvertime.add(hours.subtract(10, 'hours'));
        }
      }
      // //After 6pm and before 6 am
      // else {
      //   if (parseFloat(startTime) > 18) {
      //     totalOvertime.add(hours);
      //   } else if (parseFloat(startTime) < 6) {
      //     let calcBefore = moment.duration(
      //       moment('6:00', 'h:mm').diff(moment(startTime, 'h.mm'))
      //     );
      //     totalOvertime.add(calcBefore);
      //   }
      // }
      return totalOvertime.asHours();
    } else {
      return 0;
    }
  }
  loadTimesheet() {
    var data = [];
    this.props.dailyPrestarts.forEach(prestart => {
      if (
        (prestart.form_values['80e9'] > this.state.start &&
          prestart.form_values['80e9'] < this.state.end) ||
        (prestart.form_values['80e9'] === this.state.start ||
          prestart.form_values['80e9'] === this.state.end)
      ) {
        if (prestart.form_values['86b7']) {
          prestart.form_values['86b7'].forEach(entry => {
            if (entry.form_values['cc82'] === 'company_personnel') {
              var start = entry.form_values['33d3']
                ? entry.form_values['33d3'].choice_values[1]
                : undefined;
              var end = entry.form_values['2748']
                ? entry.form_values['2748'].choice_values[1]
                : undefined;

              var hoursDiff = this.calcTimeDiff(
                start,
                end,
                entry.form_values['54aa']
              );
              var overTimeOne =
                this.calcOverTimeOne(
                  start,
                  end,
                  moment(prestart.form_values['80e9']).format('dddd')
                ) !== 0
                  ? this.calcOverTimeOne(
                      start,
                      end,
                      moment(prestart.form_values['80e9']).format('dddd'),
                      entry.form_values['54aa']
                    )
                  : 0;
              var overTimeTwo =
                this.calcOverTimeTwo(
                  start,
                  end,
                  moment(prestart.form_values['80e9']).format('dddd')
                ) !== 0
                  ? this.calcOverTimeTwo(
                      start,
                      end,
                      moment(prestart.form_values['80e9']).format('dddd'),
                      entry.form_values['54aa']
                    )
                  : 0;

              var addHours =
                hoursDiff !== null
                  ? moment(hoursDiff, 'H.mm').format('H')
                  : '00';
              var addMins =
                hoursDiff !== null
                  ? moment(hoursDiff, 'H.mm').format('m')
                  : '0';
              var name = entry.form_values['57fb']
                ? entry.form_values['57fb'].choice_values[0]
                : null;
              var obj = {
                id: entry.id,
                name
              };
              var travel = entry.form_values['935b']
                ? parseFloat(entry.form_values['935b'])
                : 0;
              var lafha = entry.form_values['b574'] === 'yes' ? 1 : 0;
              var absent =
                entry.form_values['d0b3'] !== 'No'
                  ? entry.form_values['d0b3']
                  : null;

              const index = data.findIndex(e => e.name === obj.name);

              if (index === -1) {
                obj[
                  moment(prestart.form_values['80e9']).format('D-MMM')
                ] = absent
                  ? absent
                  : moment.duration({
                      hours: addHours,
                      minutes: addMins
                    });
                obj.ot1 = overTimeOne;
                obj.ot2 = overTimeTwo;
                obj.travel = travel;
                obj.lafha = lafha;
                obj.hours = moment.duration({
                  hours: addHours,
                  minutes: addMins
                });
                obj.hours_minus = moment
                  .duration({
                    hours: addHours,
                    minutes: addMins
                  })
                  .subtract(overTimeOne, 'hours')
                  .subtract(overTimeTwo, 'hours');
                data.push(obj);
              } else {
                //Called when multiple signins occure on prestart
                if (
                  data[index][
                    moment(prestart.form_values['80e9']).format('D-MMM')
                  ]
                ) {
                  var overTimeOneMultiple = (data, key) => {
                    return this.calcOverTimeOne(
                      '00.00',
                      `${data.hours()}.${data.minutes()}`,
                      key
                    );
                  };
                  var overTimeTwoMultiple = (data, key) => {
                    return this.calcOverTimeTwo(
                      '00.00',
                      `${data.hours()}.${data.minutes()}`,
                      key
                    );
                  };
                  data[index][
                    moment(prestart.form_values['80e9']).format('D-MMM')
                  ]
                    .add(parseInt(addHours, 0), 'hours')
                    .add(parseInt(addMins, 0), 'minutes');
                  data[index].hours = data[index].hours
                    .add(parseInt(addHours, 0), 'hours')
                    .add(parseInt(addMins, 0), 'minutes');
                  data[index].hours_minus = data[index].hours_minus
                    .add(parseInt(addHours, 0), 'hours')
                    .add(parseInt(addMins, 0), 'minutes')
                    .subtract(
                      overTimeOneMultiple(
                        data[index].hours,
                        moment(prestart.form_values['80e9']).format('dddd')
                      ),
                      'hours'
                    )
                    .subtract(
                      overTimeTwoMultiple(
                        data[index].hours,
                        moment(prestart.form_values['80e9']).format('dddd')
                      ),
                      'hours'
                    );
                  data[index].ot1 += overTimeOneMultiple(
                    data[index].hours,
                    moment(prestart.form_values['80e9']).format('dddd')
                  );
                  data[index].ot2 += overTimeTwoMultiple(
                    data[index].hours,
                    moment(prestart.form_values['80e9']).format('dddd')
                  );
                  data[index].travel += travel;
                  data[index].lafha += lafha;
                } else {
                  Object.assign(data[index], {
                    [moment(prestart.form_values['80e9']).format(
                      'D-MMM'
                    )]: moment.duration({
                      hours: addHours,
                      minutes: addMins
                    })
                  });
                  data[index].hours = data[index].hours
                    .add(parseInt(addHours, 0), 'hours')
                    .add(parseInt(addMins, 0), 'minutes');
                  data[index].hours_minus = data[index].hours_minus
                    .add(parseInt(addHours, 0), 'hours')
                    .add(parseInt(addMins, 0), 'minutes')
                    .subtract(overTimeOne, 'hours')
                    .subtract(overTimeTwo, 'hours');
                  data[index].ot1 += overTimeOne;
                  data[index].ot2 += overTimeTwo;
                  data[index].travel += travel;
                  data[index].lafha += lafha;
                }
              }
            }
          });
        }
      }
    });
    this.setState({
      data
    });
  }
  render() {
    return (
      <div>
        <div>
          <Row gutter={10}>
            <Col xs={0} sm={0} md={10} lg={10} xl={10}>
              <h3>From</h3>
            </Col>
            <Col xs={0} sm={0} md={10} lg={10} xl={10}>
              <h3>To</h3>
            </Col>
            <Col xs={0} sm={0} md={4} lg={4} xl={4}>
              <h3>Days</h3>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col
              xs={24}
              sm={24}
              md={10}
              lg={10}
              xl={10}
              style={{marginBottom: '10px'}}>
              {this.selectDate()}
            </Col>
            <Col
              xs={24}
              sm={24}
              md={10}
              lg={10}
              xl={10}
              style={{marginBottom: '10px'}}>
              {this.dateTo()}
            </Col>
            <Col
              xs={24}
              sm={24}
              md={4}
              lg={4}
              xl={4}
              style={{marginBottom: '10px'}}>
              {this.selectDayNumber()}
            </Col>
          </Row>
        </div>
        <Table
          pagination={false}
          bordered
          id='timesheet'
          className='boreTables tableResizer dailyReportTables'
          columns={column.timesheet(
            moment(this.state.start).format('D-MMM-YYYY'),
            this.state.noDays
          )}
          dataSource={this.state.data}
          rowClassName={record => {
            if (record.name === ' ') {
              return 'date';
            }
          }}
          rowKey='id'
          onSelect={(record, selected, selectedRows) => {
            console.log(record, selected, selectedRows);
          }}
          size='middle'
        />
      </div>
    );
  }
}
