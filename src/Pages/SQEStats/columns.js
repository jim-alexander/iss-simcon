export function plantRegister(){
  return [{
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
    className: 'manHours',
    width: 200,
    children: [{
      title: 'Employees',
      dataIndex: 'manHours',
      key: 'manHours',
      className: 'subHeader employees',
      render: hours => {
        if (hours.asHours() > 0) {
          return hours.asHours()
        } else {
          return null
        }
      },
      width: 100
    }, {
      title: 'Contractors',
      dataIndex: 'manHoursSub',
      key: 'manHoursSub',
      className: 'subHeader contractors',
      render: hours => {
        if (hours.asHours() > 0) {
          return hours.asHours()
        } else {
          return null
        }
      },
      width: 100
    }]
  }, {
    title: 'Documents Completed',
    className: 'documentsCompleted',
    children: [{
      title: 'Site Inspections',
      dataIndex: 'siteInspections',
      className: 'subHeader',
      key: 'siteInspections',
      render: (val) => {
        if (val > 0) {
          return val
        } else {
          return null
        }
      },
      width: 100
    }, {
      title: 'Hazards Reported & Closed',
      dataIndex: 'hazards',
      className: 'subHeader',
      key: 'hazards',
      render: (val) => {
        if (val > 0) {
          return val
        } else {
          return null
        }
      },
      width: 100
    }, {
      title: 'Toolbox Meetings',
      dataIndex: 'toolbox',
      className: 'subHeader',
      key: 'toolbox',
      render: (val) => {
        if (val > 0) {
          return val
        } else {
          return null
        }
      },
      width: 100
    }]
  }, {
    title: 'Materials (L)',
    className: 'materials',
    children: [{
      title: 'Diesel',
      dataIndex: 'diesel',
      className: 'subHeader',
      key: 'diesel',
      render: (val) => {
        if (val > 0) {
          return val
        } else {
          return null
        }
      },
      width: 80
    }, {
      title: 'Unleaded',
      dataIndex: 'unleaded',
      className: 'subHeader',
      key: 'unleaded',
      render: (val) => {
        if (val > 0) {
          return val
        } else {
          return null
        }
      },
      width: 80
    }, {
      title: 'Water',
      dataIndex: 'water',
      className: 'subHeader',
      key: 'water',
      render: (val) => {
        if (val > 0) {
          return val
        } else {
          return null
        }
      },
      width: 80
    }]
  }]
}