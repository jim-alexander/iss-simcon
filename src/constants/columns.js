import React from 'react'

export const columnsOne = [{
  title: 'Title',
  dataIndex: 'title',
  key: 'title',
  width: 100,
},{
  title: 'Project Manager',
  dataIndex: 'projectManager',
  key: 'projectManager',
  width: 100,
},{
  title: 'Site Supervisor',
  dataIndex: 'siteSupervisor',
  key: 'siteSupervisor',
  width: 100,
  className: 'hideThis'
},{
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
},{
  title: 'start',
  dataIndex: 'start',
  key: 'start',
  width: 100,
},{
  title: 'end',
  dataIndex: 'end',
  key: 'end',
  width: 100,
  className: ''
},{
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
},{
title: 'Notes',
dataIndex: 'notes',
key: 'notes'
}];
export const dailyReportDockets = [{
title: 'Item',
dataIndex: 'item',
key: 'item'
},{
title: 'Link',
dataIndex: 'link',
key: 'link',
render: text => <a target='_blank' href={text}>{text}</a>,
}];

export const dailyLog = [{
  title: 'Date',
  dataIndex: 'date',
  key: 'date',
  width: 60,
}, {
  title: 'Activity',
  dataIndex: 'log.form_values["0ad7"].choice_values["0"]',
  key: 'activity',
  width: 60,
}, {
  title: 'Start',
  dataIndex: 'log.form_values["e418"]',
  key: 'start',
  width: 50,
}, {
  title: 'Finish',
  dataIndex: 'log.form_values[8881]',
  key: 'finish',
  width: 50,
}, {
title: 'Description',
dataIndex: 'log.form_values["99a3"]',
key: 'description',
width: 200,
className: 'hideThis'
}];

export const materials = [{
title: 'Materials',
dataIndex: 'mat',
key: 'date',
width: 60,
}];

export const strata = [{
title: 'From',
dataIndex: 'from',
key: 'from',
width: 60,
}, {
title: 'To',
dataIndex: 'to',
key: 'to',
width: 60,
}, {
title: 'Strata',
dataIndex: 'strata',
key: 'strata',
width: 50,
}];

export const workshopList = [{
  title: 'Date',
  dataIndex: 'date',
  key: 'date',
  width: 100,
},{
  title: 'Vehicle',
  dataIndex: 'on',
  key: 'vehicle',
  width: 100,
},{
  title: 'Completed by',
  dataIndex: 'completedBy',
  key: 'completedby',
  width: 100,
}];

export const prestartList = [{
  title: 'Date',
  dataIndex: 'psDate',
  key: 'date',
  width: 100,
},{
  title: 'Status',
  dataIndex: 'psStatus',
  key: 'status',
  width: 100,
},{
  title: 'Pre-start on',
  dataIndex: 'psOn',
  key: 'prestarton',
  width: 100,
}, {
  title: 'Comments',
  dataIndex: 'psComments',
  key: 'comments',
  width: 100,
  className: 'hideThis'
}, {
  title: 'Fix List',
  dataIndex: 'psFix',
  key: 'fixlist',
  width: 100,
  className: 'hideThis'
}, {
  title: 'From',
  dataIndex: 'psFrom',
  key: 'from',
  width: 100,
}, {
  title: 'Priority',
  dataIndex: 'psPriority',
  key: 'priority',
  width: 100,
  className: 'hideThis'
}];
