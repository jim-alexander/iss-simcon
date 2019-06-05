import moment from 'moment'
export const columns = [
  {
    title: 'Date',
    dataIndex: 'form_values[a15a]',
    key: 'date',
    render: date => {
      if (date) {
        return moment(date, 'YYYY-MM-DD').format('DD-MM-YYYY')
      } else {
        return null
      }
    },
    sorter: (a, b) => {
      if (a || b) {
        let aDate = moment(a.date, 'YYYY-MM-DD')
        let bDate = moment(b.date, 'YYYY-MM-DD')
        if (aDate.isBefore(bDate)) {
          return 1
        }
        if (aDate.isAfter(bDate)) {
          return -1
        }
        return 0
      }
    },
    defaultSortOrder: 'ascending',
    width: 110
  },
  {
    title: 'Project no.',
    dataIndex: 'project',
    key: 'project'
  },
  {
    title: 'Reported By',
    dataIndex: 'form_values[91cc].choice_values[0]',
    key: 'reported_by'
  },
  {
    title: 'Description',
    dataIndex: 'form_values[3c19]',
    key: 'description'
  },
  {
    title: 'Incident Type',
    dataIndex: 'form_values[800c].choice_values[0]',
    key: 'type'
  },
  {
    title: 'Worksafe Notified?',
    dataIndex: 'form_values[5e8b]',
    render: val => (val === 'yes' ? 'Yes' : 'no'),
    key: 'worksafe'
    // className: 'hideThis'
  },
  {
    title: 'Injury Data',
    className: 'injuryData',
    children: [
      {
        title: 'Location',
        dataIndex: 'form_values[9d98].choice_values[0]',
        key: 'location',
        className: 'subHeader',
        width: 100
      },
      {
        title: 'FAI',
        dataIndex: 'form_values[ce3e].choice_values[0]',
        key: 'fai',
        render: val => (val === 'First Aid Injury' ? '✔' : null),
        className: 'subHeader',
        width: 100
      },
      {
        title: 'MTI',
        dataIndex: 'form_values[ce3e].choice_values[0]',
        key: 'mti',
        render: val => (val === 'Medical Treatment Injury' ? '✔' : null),
        className: 'subHeader',
        width: 100
      },
      {
        title: 'LTI',
        dataIndex: 'form_values[ce3e].choice_values[0]',
        key: 'lti',
        render: val => (val === 'Lost Time Injury' ? '✔' : null),
        className: 'subHeader',
        width: 100
      },
      {
        title: 'Underground service strike',
        dataIndex: 'form_values[5c60]',
        key: 'uss',
        render: val => (val === 'yes' ? '✔' : null),
        className: 'subHeader',
        width: 100
      }
    ]
  },
  {
    title: 'Status',
    className: 'status',
    children: [
      {
        title: 'PM Action',
        dataIndex: 'status',
        key: 'pm_action',
        render: val => (val === 'PM Action Required' ? 'Action' : null),
        className: 'subHeader action',
        width: 100
      },
      {
        title: 'SQE Manager Action',
        dataIndex: 'status',
        key: 'sqe_action',
        render: val => (val === 'SQE Action Required' ? 'Action' : null),
        className: 'subHeader action',
        width: 100
      }
    ]
  }
]
