export const jobDetails1 = [{
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
    // className: 'hideThis'
}, {
    title: 'Day',
    dataIndex: 'day',
    key: 'day',
    className: 'hideThis',
    width: 100,
}];

export const timesheet = [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 200,
}, {
    title: 'Start',
    dataIndex: 'start',
    key: 'start',
    width: 100,
}, {
    title: 'End',
    dataIndex: 'end',
    key: 'end',
    width: 100,
}, {
    title: 'Hours / Mins',
    dataIndex: 'hours',
    key: 'hours',
    width: 100
}];
export const timesheetContractors = [{
    title: 'Company',
    dataIndex: 'company',
    key: 'company',
    width: 200,
}, {
    title: 'No. of employees',
    dataIndex: 'noOfEmployees',
    key: 'noOfEmployees',
    width: 100,
}, {
    title: 'Hours / Mins',
    dataIndex: 'hours',
    key: 'hours',
    render: hours => {
       return hours ? hours.asHours(): 0
    },
    width: 100
}];

export const companyPlant = [{
    title: 'Item',
    dataIndex: 'item',
    key: 'item'
}];

export const hiredPlant = [{
    title: 'Supplier',
    dataIndex: 'supplier',
    key: 'supplier',
    width: 100
}, {
    title: 'Equipment',
    dataIndex: 'equipment',
    key: 'equipment',
    width: 100
}, {
    title: 'Start',
    dataIndex: 'start',
    key: 'start',
    className: 'hideThis',
    width: 40
}, {
    title: 'End',
    dataIndex: 'end',
    key: 'end',
    className: 'hideThis',
    width: 40
}, {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    width: 40
}
//  {
    // title: 'Docket',
    // dataIndex: 'docket',
    // key: 'docket',
    // className: 'hideThis',
    // width: 40
// }
];

export const materialsReceived = [{
    title: 'Supplier',
    dataIndex: 'supplier',
    key: 'supplier'
}, {
    title: 'Item',
    dataIndex: 'item',
    key: 'item'
}, {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity'
}, 
// {
//     title: 'Docket No',
//     dataIndex: 'docket',
//     key: 'docket',
//     className: 'hideThis',
// }, 
{
    title: 'Records',
    dataIndex: 'photo',
    key: 'photo',
    className: 'hideThis',
}];

export const sqeStats = [{
    title: 'Fuel Consumtion',
    dataIndex: 'fuel',
    key: 'fuel',
    width: 50
}, {
    title: 'Water Use',
    dataIndex: 'water',
    key: 'water',
    width: 50
}, {
    title: 'Comments',
    dataIndex: 'comments',
    key: 'comments',
    width: 150
}];




