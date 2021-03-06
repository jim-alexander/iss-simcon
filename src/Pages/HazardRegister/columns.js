import moment from 'moment'
import React from 'react'

export function hazardRegister(closeHazard){
  return [ {
    title: 'Job',
    dataIndex: 'jobNumber',
    key: 'jobNumber',
    width: 50
  }, {
    title: 'Date Identified',
    dataIndex: 'dateIdentified',
    key: 'dateIdentified',
    render: (date) => {
      if (date) {
        return moment(date, 'YYYY-MM-DD').format('DD-MM-YYYY')
      }
    },
    sorter: (a, b) => {
      var aDate = moment(a.dateIdentified, 'YYYY-MM-DD').toDate()
      var bDate = moment(b.dateIdentified, 'YYYY-MM-DD').toDate()
      if (aDate > bDate) { return -1; }
      if (aDate < bDate) { return 1; }
      return 0;
    },
    defaultSortOrder: 'descending',
    className: 'hideThis',
    width: 100
  }, {
    title: 'Recorded By',
    dataIndex: 'recordedBy',
    key: 'recordedBy',
    className: 'hideThis',
    width: 100
  }, {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    width: 250
  }, {
    title: 'Assigned To',
    dataIndex: 'assignedTo',
    key: 'assignedTo',
    width: 100
  }, {
    title: 'Close Out Date',
    dataIndex: 'closeOutDate',
    key: 'closeOutDate',
    render: (date) => {
      if (date) {
        return moment(date, 'YYYY-MM-DD').format('DD-MM-YYYY')
      }
    },
    width: 100
  }, {
    title: 'Action',
    width: 50,
    dataIndex: '_',
    render: (text, record) => {
      if (!record.closeOutDate) {
        return <span onClick={() => {
          closeHazard(record)
        }}>Close</span>
        
      }
    },
    className: 'hideThis hazardAction'
  }]
};