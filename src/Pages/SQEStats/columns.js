export const plantRegister = [{
  title: 'Month',
  dataIndex: 'month',
  key: 'month',
  width: 100
}, {
  title: 'Job No',
  dataIndex: 'job',
  key: 'job',
  width: 100
}, {
  title: 'Title',
  dataIndex: 'title',
  key: 'title',
  width: 250
}, {
  title: 'Man Hours',
  dataIndex: 'manHours',
  key: 'manHours',
  width: 100
}, {
  title: 'Site Inspections',
  dataIndex: 'siteInspections',
  key: 'siteInspections',
  width: 100
}, {
  title: 'Hazards Reported & Closed',
  dataIndex: 'hazards',
  key: 'hazards',
  width: 100
}, {
  title: 'Toolbox Meetings',
  dataIndex: 'toolbox',
  key: 'toolbox',
  width: 100
}, {
  title: 'Fuel (L)',
  children: [{
    title: 'Diesel',
    dataIndex: 'diesel',
    key: 'diesel',
    width: 100
  }, {
    title: 'Unleaded',
    dataIndex: 'unleaded',
    key: 'unleaded',
    width: 100
  }]
}, {
  title: 'Water Use',
  dataIndex: 'water',
  key: 'water',
  width: 100
}];