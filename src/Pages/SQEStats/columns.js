export function plantRegister(){
  return [{
    title: 'Job No',
    dataIndex: 'job',
    key: 'job',
    sorter: (a, b) => {  
      if (a.job > b.job) { return -1; }
      if (a.job < b.job) { return 1; }    
      return 0;
    },
    defaultSortOrder: 'descending',
    width: 100
  }, {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    className: 'hideThis',
    width: 200
  }, {
    title: 'Man Hours',
    className: 'manHours titleHeader',
    children: [{
      title: 'Employees',
      dataIndex: 'manHours',
      key: 'manHours',
      className: 'subHeader employees',
      render: hours => {
        if (hours) {
          if (hours.asHours() > 0) {
            return hours.asHours()
          } else {
            return null
          }
        }
      },
      width: 100
    }, {
      title: 'Contractors',
      dataIndex: 'manHoursSub',
      key: 'manHoursSub',
      className: 'subHeader contractors',
      render: hours => {
        if (hours) {
          if (hours.asHours() > 0) {
            return hours.asHours()
          } else {
            return null
          }
        }
      },
      width: 100
    }]
  }, {
    title: 'Documents Completed',
    className: 'documentsCompleted titleHeader hideThis',
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
      title: 'Hazards Closed',
      dataIndex: 'hazardsClosed',
      className: 'subHeader hideThis',
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
      className: 'subHeader hideThis',
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
    className: 'materials titleHeader',
    children: [{
      title: 'Diesel',
      dataIndex: 'diesel',
      className: 'subHeader hideThis',
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

export function sqeTotals(){
  return [{
    title: 'job',
    dataIndex: 'job',
    width: 100
  },{
    title: 'title',
    dataIndex: 'title',
    width: 200,
    className: 'hideThis',
  },{
    title: 'employees',
    dataIndex: 'employees',
    render: hours => {
        if (hours) {
          if (hours.asHours() > 0) {
            return hours.asHours()
          } else {
            return null
          }
        }
      },
    width: 100
  },{
    title: 'contractors',
    dataIndex: 'contractors',
    render: hours => {
        if (hours) {
          if (hours.asHours() > 0) {
            return hours.asHours()
          } else {
            return null
          }
        }
      },
    width: 100
  },{
    title: 'siteInspections',
    dataIndex: 'siteInspections',
    className: 'hideThis',
    width: 100,
    render: val => {
      if (val > 0) {
        return val
      } else {
        return null
      }
    }
  },{
    title: 'hazards',
    dataIndex: 'hazards',
    className: 'hideThis',
    width: 100,
    render: val => {
      if (val > 0) {
        return val
      } else {
        return null
      }
    }
  },{
    title: 'toolboxs',
    dataIndex: 'toolboxs',
    className: 'hideThis',
    width: 100,
    render: val => {
      if (val > 0) {
        return val
      } else {
        return null
      }
    }
  },{
    title: 'diesel',
    dataIndex: 'diesel',
    width: 80,
    render: val => {
      if (val > 0) {
        return val
      } else {
        return null
      }
    }
  },{
    title: 'unleaded',
    dataIndex: 'unleaded',
    width: 80,
    render: val => {
      if (val > 0) {
        return val
      } else {
        return null
      }
    }
  },{
    title: 'water',
    dataIndex: 'water',
    width: 80,
    render: val => {
      if (val > 0) {
        return val
      } else {
        return null
      }
    }
  },]
}
