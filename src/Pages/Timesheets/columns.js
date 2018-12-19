import moment from 'moment'
export function timesheet(today) {
  return [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  }, {
    title: moment(today, 'D-MMM-YYYY').format('ddd'),
    className: 'timesheetDay',
    children: [{
      title: moment(today, 'D-MMM-YYYY').format('D-MMM'),
      dataIndex: moment(today, 'D-MMM-YYYY').format('D-MMM'),
      className: 'dateSub',
      key: 'thur',
      width: 100
    }]
  }, {
    title: moment(today, 'D-MMM-YYYY').add(1, 'days').format('ddd'),
    className: 'timesheetDay',
    children: [{
      title: moment(today, 'D-MMM-YYYY').add(1, 'days').format('D-MMM'),
      dataIndex: moment(today, 'D-MMM-YYYY').add(1, 'days').format('D-MMM'),
      className: 'dateSub',
      key: 'fri',
      width: 100
    }],
  }, {
    title: moment(today, 'D-MMM-YYYY').add(2, 'days').format('ddd'),
    className: 'timesheetDay',
    children: [{
      title: moment(today, 'D-MMM-YYYY').add(2, 'days').format('D-MMM'),
      dataIndex: moment(today, 'D-MMM-YYYY').add(2, 'days').format('D-MMM'),
      className: 'dateSub',
      key: 'sat',
      width: 100
    }],
  }, {
    title: moment(today, 'D-MMM-YYYY').add(3, 'days').format('ddd'),
    className: 'timesheetDay',
    children: [{
      title: moment(today, 'D-MMM-YYYY').add(3, 'days').format('D-MMM'),
      dataIndex: moment(today, 'D-MMM-YYYY').add(3, 'days').format('D-MMM'),
      className: 'dateSub',
      key: 'sun',
      width: 100
    }],
  }, {
    title: moment(today, 'D-MMM-YYYY').add(4, 'days').format('ddd'),
    className: 'timesheetDay',
    children: [{
      title: moment(today, 'D-MMM-YYYY').add(4, 'days').format('D-MMM'),
      dataIndex: moment(today, 'D-MMM-YYYY').add(4, 'days').format('D-MMM'),
      className: 'dateSub',
      key: 'mon',
      width: 100
    }],
  }, {
    title: moment(today, 'D-MMM-YYYY').add(5, 'days').format('ddd'),
    className: 'timesheetDay',
    children: [{
      title: moment(today, 'D-MMM-YYYY').add(5, 'days').format('D-MMM'),
      dataIndex: moment(today, 'D-MMM-YYYY').add(5, 'days').format('D-MMM'),
      className: 'dateSub',
      key: 'tue',
      width: 100
    }],
  }, {
    title: moment(today, 'D-MMM-YYYY').add(6, 'days').format('ddd'),
    className: 'timesheetDay',
    children: [{
      title: moment(today, 'D-MMM-YYYY').add(6, 'days').format('D-MMM'),
      dataIndex: moment(today, 'D-MMM-YYYY').add(6, 'days').format('D-MMM'),
      className: 'dateSub',
      key: 'wed',
      width: 100
    }],
  }, {
    title: moment(today, 'D-MMM-YYYY').add(7, 'days').format('ddd'),
    className: 'timesheetDay',
    children: [{
      title: moment(today, 'D-MMM-YYYY').add(7, 'days').format('D-MMM'),
      dataIndex: moment(today, 'D-MMM-YYYY').add(7, 'days').format('D-MMM'),
      className: 'dateSub',
      key: 'thur2',
      width: 100
    }],
  }, {
    title: moment(today, 'D-MMM-YYYY').add(8, 'days').format('ddd'),
    className: 'timesheetDay',
    children: [{
      title: moment(today, 'D-MMM-YYYY').add(8, 'days').format('D-MMM'),
      dataIndex: moment(today, 'D-MMM-YYYY').add(8, 'days').format('D-MMM'),
      className: 'dateSub',
      key: 'fri2',
      width: 100
    }],
  }, {
    title: moment(today, 'D-MMM-YYYY').add(9, 'days').format('ddd'),
    className: 'timesheetDay',
    children: [{
      title: moment(today, 'D-MMM-YYYY').add(9, 'days').format('D-MMM'),
      dataIndex: moment(today, 'D-MMM-YYYY').add(9, 'days').format('D-MMM'),
      className: 'dateSub',
      key: 'sat2',
      width: 100
    }],
  }, {
    title: moment(today, 'D-MMM-YYYY').add(10, 'days').format('ddd'),
    className: 'timesheetDay',
    children: [{
      title: moment(today, 'D-MMM-YYYY').add(10, 'days').format('D-MMM'),
      dataIndex: moment(today, 'D-MMM-YYYY').add(10, 'days').format('D-MMM'),
      className: 'dateSub',
      key: 'sun2',
      width: 100
    }],
  }, {
    title: moment(today, 'D-MMM-YYYY').add(11, 'days').format('ddd'),
    className: 'timesheetDay',
    children: [{
      title: moment(today, 'D-MMM-YYYY').add(11, 'days').format('D-MMM'),
      dataIndex: moment(today, 'D-MMM-YYYY').add(11, 'days').format('D-MMM'),
      className: 'dateSub',
      key: 'mon2',
      width: 100
    }],
  }, {
    title: moment(today, 'D-MMM-YYYY').add(12, 'days').format('ddd'),
    className: 'timesheetDay',
    children: [{
      title: moment(today, 'D-MMM-YYYY').add(12, 'days').format('D-MMM'),
      dataIndex: moment(today, 'D-MMM-YYYY').add(12, 'days').format('D-MMM'),
      className: 'dateSub',
      key: 'tue2',
      width: 100
    }],
  }, {
    title: moment(today, 'D-MMM-YYYY').add(13, 'days').format('ddd'),
    className: 'timesheetDay',
    children: [{
      title: moment(today, 'D-MMM-YYYY').add(13, 'days').format('D-MMM'),
      dataIndex: moment(today, 'D-MMM-YYYY').add(13, 'days').format('D-MMM'),
      className: 'dateSub',
      key: 'wed2',
      width: 100
    }],
  },{
    title: 'Hours',
    dataIndex: 'hours',
    key: 'hours',
    width: 100,
    className: 'timesheetTotals'
  }, {
    title: 'OT1',
    dataIndex: 'ot1',
    key: 'ot1',
    width: 100,
    className: 'timesheetTotals'
  }, {
    title: 'OT2',
    dataIndex: 'ot2',
    key: 'ot2',
    width: 100,
    className: 'timesheetTotals'
  }]

}