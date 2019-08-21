export function plantRegister() {
  return [
    {
      title: 'Job No',
      dataIndex: 'job',
      key: 'job',
      sorter: (a, b) => {
        if (a.job > b.job) {
          return -1;
        }
        if (a.job < b.job) {
          return 1;
        }
        return 0;
      },
      defaultSortOrder: 'descending',
      width: 100
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      className: 'hideThis',
      width: 200
    },
    {
      title: 'Man Hours',
      className: 'manHours titleHeader',
      children: [
        {
          title: 'Employees',
          dataIndex: 'manHours',
          key: 'manHours',
          className: 'subHeader employees',
          render: hours => {
            if (hours) {
              return hours.asHours() > 0 ? hours.asHours() : null;
            }
          },
          width: 100
        },
        {
          title: 'Contractors',
          dataIndex: 'manHoursSub',
          key: 'manHoursSub',
          className: 'subHeader contractors',
          render: hours => {
            if (hours) {
              return hours.asHours() > 0 ? hours.asHours() : null;
            }
          },
          width: 100
        }
      ]
    },
    {
      title: 'Documents Completed',
      className: 'documentsCompleted titleHeader',
      children: [
        {
          title: 'Safety Walks',
          dataIndex: 'safetyWalks',
          className: 'subHeader',
          key: 'safetyWalks',
          render: val => (val > 0 ? val : null),
          width: 100
        },
        {
          title: 'Site Inspections',
          dataIndex: 'siteInspections',
          className: 'subHeader',
          key: 'siteInspections',
          render: val => (val > 0 ? val : null),
          width: 100
        },
        {
          title: 'Task Observations',
          dataIndex: 'taskObservations',
          className: 'subHeader',
          key: 'siteInspections',
          render: val => (val > 0 ? val : null),
          width: 100
        },
        {
          title: 'Hazards Closed',
          dataIndex: 'hazardsClosed',
          className: 'subHeader',
          key: 'hazards',
          render: val => (val > 0 ? val : null),
          width: 100
        },
        {
          title: 'Toolbox Meetings',
          dataIndex: 'toolbox',
          className: 'subHeader',
          key: 'toolbox',
          render: val => (val > 0 ? val : null),
          width: 100
        },
        {
          title: 'Incidents',
          dataIndex: 'incidents',
          className: 'subHeader',
          key: 'incidents',
          render: val => (val > 0 ? val : null),
          width: 100
        },
        {
          title: 'Non-Conformance',
          dataIndex: 'nonConformance',
          className: 'subHeader',
          key: 'nonConformance',
          render: val => (val > 0 ? val : null),
          width: 100
        }
      ]
    },
    {
      title: 'Materials (L)',
      className: 'materials titleHeader hideThis',
      children: [
        {
          title: 'Diesel',
          dataIndex: 'diesel',
          className: 'subHeader hideThis',
          key: 'diesel',
          render: val => (val > 0 ? val : null),
          width: 80
        },
        {
          title: 'Unleaded',
          dataIndex: 'unleaded',
          className: 'subHeader hideThis',
          key: 'unleaded',
          render: val => (val > 0 ? val : null),
          width: 80
        },
        {
          title: 'Water',
          dataIndex: 'water',
          className: 'subHeader hideThis',
          key: 'water',
          render: val => (val > 0 ? val : null),
          width: 80
        }
      ]
    }
  ];
}

export function sqeTotals() {
  return [
    {
      title: 'job',
      dataIndex: 'job',
      width: 100
    },
    {
      title: 'title',
      dataIndex: 'title',
      width: 200,
      className: 'hideThis'
    },
    {
      title: 'employees',
      dataIndex: 'employees',
      className: 'employeesTotal',
      render: hours => {
        if (hours) {
          return hours.asHours() > 0 ? hours.asHours() : null;
        }
      },
      width: 100
    },
    {
      title: 'contractors',
      dataIndex: 'contractors',
      className: 'contractorsTotal',
      render: hours => {
        if (hours) {
          return hours.asHours() > 0 ? hours.asHours() : null;
        }
      },
      width: 100
    },
    {
      title: 'Safety Walks',
      dataIndex: 'safetyWalks',
      className: 'siteInspectionsTotal',
      width: 100,
      render: val => (val > 0 ? val : null)
    },
    {
      title: 'Site Inspections',
      dataIndex: 'siteInspections',
      className: 'siteInspectionsTotal',
      width: 100,
      render: val => (val > 0 ? val : null)
    },
    {
      title: 'Task Observations',
      dataIndex: 'taskObservations',
      className: 'siteInspectionsTotal',
      width: 100,
      render: val => (val > 0 ? val : null)
    },
    {
      title: 'hazards',
      dataIndex: 'hazards',
      className: 'hazardsTotal',
      width: 100,
      render: val => (val > 0 ? val : null)
    },
    {
      title: 'toolboxs',
      dataIndex: 'toolboxs',
      className: 'toolboxsTotal',
      width: 100,
      render: val => (val > 0 ? val : null)
    },
    {
      title: 'incidents',
      dataIndex: 'incidents',
      className: 'incidentsTotal',
      width: 100,
      render: val => (val > 0 ? val : null)
    },
    {
      title: 'conformance',
      dataIndex: 'nonConformance',
      className: 'conformanceTotal',
      width: 100,
      render: val => (val > 0 ? val : null)
    },
    {
      title: 'diesel',
      dataIndex: 'diesel',
      className: 'dieselTotal hideThis',
      width: 80,
      render: val => (val > 0 ? val : null)
    },
    {
      title: 'unleaded',
      dataIndex: 'unleaded',
      className: 'unleadedTotal hideThis',
      width: 80,
      render: val => (val > 0 ? val : null)
    },
    {
      title: 'water',
      dataIndex: 'water',
      className: 'waterTotal hideThis',
      width: 80,
      render: val => (val > 0 ? val : null)
    }
  ];
}
