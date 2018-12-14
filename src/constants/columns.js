import React from 'react'
import moment from 'moment'

export const columnsOne = [{
  title: 'Title',
  dataIndex: 'title',
  key: 'title',
  width: 100,
}, {
  title: 'Project Manager',
  dataIndex: 'projectManager',
  key: 'projectManager',
  width: 100,
}, {
  title: 'Site Supervisor',
  dataIndex: 'siteSupervisor',
  key: 'siteSupervisor',
  width: 100,
  className: 'hideThis'
}, {
  title: 'Day',
  dataIndex: 'day',
  key: 'day',
  width: 100,
  className: 'hideThis'
}];

export const dailyReportTimesheet = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
  width: 200,
}, {
  title: 'start',
  dataIndex: 'start',
  key: 'start',
  width: 100,
}, {
  title: 'end',
  dataIndex: 'end',
  key: 'end',
  width: 100,
  className: ''
}, {
  title: 'Hours / Mins',
  dataIndex: 'hours',
  key: 'hours',
  width: 100,
  className: 'hideThis'
}];

export const dailyReportPlant = [{
  title: 'Item',
  dataIndex: 'item',
  key: 'item'
}, {
  title: 'Notes',
  dataIndex: 'notes',
  key: 'notes'
}];
export const dailyReportDockets = [{
  title: 'Item',
  dataIndex: 'item',
  key: 'item'
}, {
  title: 'Link',
  dataIndex: 'link',
  key: 'link',
  render: text => <a target='_blank' href={text}>{text}</a>,
}];

export const userActivity = [{
  title: 'Username',
  dataIndex: 'username',
  key: 'username',
}, {
  title: 'Email',
  dataIndex: 'email',
  key: 'email',
}, {
  title: 'Role',
  dataIndex: 'role',
  key: 'role',
}, {
  title: 'Last Loaded',
  dataIndex: 'data.last_loaded_data',
  key: 'last_loaded',
  render: item => {
    if (item) {
      if (item !== 'never') {
        var b = moment(item, 'Do MMMM YYYY, h:mm:ss a');
        return (
          b.fromNow()
        )
      }
    }
  }
}, {
  title: 'Last Page',
  dataIndex: 'data.last_viewed_page',
  key: 'last_page'
}];
