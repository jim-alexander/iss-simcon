import React from "react";
export const jobDetails1 = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    width: 100
  },
  {
    title: "Project Manager",
    dataIndex: "projectManager",
    key: "projectManager",
    width: 100
  },
  {
    title: "Site Supervisor",
    dataIndex: "siteSupervisor",
    key: "siteSupervisor",
    width: 100
    // className: 'hideThis'
  },
  {
    title: "Day",
    dataIndex: "day",
    key: "day",
    className: "hideThis",
    width: 100
  },
  {
    title: "Weather",
    dataIndex: "weather",
    key: "weather",
    className: "hideThis",
    width: 100
  }
];

export const timesheet = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 200
  },
  {
    title: "Start",
    dataIndex: "start",
    key: "start",
    width: 100
  },
  {
    title: "End",
    dataIndex: "end",
    key: "end",
    width: 100
  },
  {
    title: "Hours / Mins",
    dataIndex: "hours",
    key: "hours",
    width: 100
  },
  {
    title: "Absence",
    dataIndex: "absent",
    key: "absent",
    width: 20
  },
  {
    title: "LAFHA",
    dataIndex: "lafha",
    key: "lafha",
    width: 20,
    className: "lafha"
  }
];
export const timesheetContractors = invoice => {
  return [
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      width: 200
    },
    {
      title: "No. of employees",
      dataIndex: "noOfEmployees",
      key: "noOfEmployees",
      width: 100
    },
    {
      title: "Hours / Mins",
      dataIndex: "hours",
      key: "hours",
      render: hours => {
        return hours ? hours.asHours() : 0;
      },
      width: 100
    },
    {
      title: "Invoiced?",
      dataIndex: "invoiced",
      key: "invoiced",
      width: 10,
      className: "invoiced",
      render: (text, record) => {
        if (!record.invoiced) {
          return (
            <span
              onClick={() => {
                invoice(record, !record.invoiced, "sub");
              }}>
              Invoice
            </span>
          );
        } else {
          return (
            <span
              onClick={() => {
                invoice(record, !record.invoiced, "sub");
              }}>
              ✔
            </span>
          );
        }
      }
    }
  ];
};

export const companyPlant = [
  {
    title: "Item",
    dataIndex: "item",
    key: "item"
  }
];

export const hiredPlant = invoice => {
  return [
    {
      title: "Supplier",
      dataIndex: "supplier",
      key: "supplier",
      width: 100
    },
    {
      title: "Equipment",
      dataIndex: "equipment",
      key: "equipment",
      width: 100
    },
    {
      title: "Start",
      dataIndex: "start",
      key: "start",
      className: "hideThis",
      width: 40
    },
    {
      title: "End",
      dataIndex: "end",
      key: "end",
      className: "hideThis",
      width: 40
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: 40
    },
    {
      title: "Docket",
      dataIndex: "docket",
      key: "docket",
      className: "hideThis",
      width: 40
    },
    {
      title: "Invoiced?",
      dataIndex: "invoiced",
      key: "invoiced",
      width: 10,
      className: "invoiced",
      render: (text, record) => {
        if (!record.invoiced) {
          return (
            <span
              onClick={() => {
                invoice(record, !record.invoiced, record.from);
              }}>
              Invoice
            </span>
          );
        } else {
          return (
            <span
              onClick={() => {
                invoice(record, !record.invoiced, record.from);
              }}>
              ✔
            </span>
          );
        }
      }
    }
  ];
};

export const materialsReceived = invoice => {
  return [
    {
      title: "Supplier",
      dataIndex: "supplier",
      key: "supplier"
    },
    {
      title: "Item",
      dataIndex: "item",
      key: "item"
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit"
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity"
    },
    // {
    //     title: 'Docket No',
    //     dataIndex: 'docket',
    //     key: 'docket',
    //     className: 'hideThis',
    // },
    {
      title: "Records",
      dataIndex: "photo",
      key: "photo",
      className: "hideThis"
    },
    {
      title: "Invoiced?",
      dataIndex: "invoiced",
      key: "invoiced",
      className: "invoiced",
      render: (text, record) => {
        if (!record.invoiced) {
          return (
            <span
              onClick={() => {
                invoice(record, !record.invoiced, record.from);
              }}>
              Invoice
            </span>
          );
        } else {
          return (
            <span
              onClick={() => {
                invoice(record, !record.invoiced, record.from);
              }}>
              ✔
            </span>
          );
        }
      }
    }
  ];
};

export const sqeStats = [
  {
    title: "Fuel Consumtion",
    dataIndex: "fuel",
    key: "fuel",
    width: 50
  },
  {
    title: "Water Use",
    dataIndex: "water",
    key: "water",
    width: 50
  },
  {
    title: "Comments",
    dataIndex: "comments",
    key: "comments",
    width: 150
  }
];
