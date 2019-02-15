import React, { Component } from 'react'
import { Badge } from 'antd'

export default class PageNotes extends Component {
  render() {

    const { currentPage } = this.props;

    if (currentPage === '/') {
      return (
        <div>
          <h1>Daily Report</h1>
          <p>The date field only provides options that are available. If the date you are looking for isn't within the list, there isnt a record under the selected job for that date.</p>
        </div>
      )
    }
    if (currentPage === '/timesheets/') {
      return (
        <div>
          <h1>Timesheets</h1>
          <p>By default, the start date will be 14 days in the past. Selecting a date will automatically genorate a timesheet report for the days following.</p>
          <p>The data can be viewed in fortnightly or weekly formats by changing the 'days' parameter in the top right corner.</p>
          <p>The report can be genorated for any date selected; not limited to weekdays or workdays.</p>
          <p>30 minutes is deducted automatically after 8 hours worked for each particular day.</p>
        </div>
      )
    }
    if (currentPage === '/site-plant-register/') {
      return (
        <div>
          <h1>Site Plant Register</h1>
          <p>By default, the information from every job will be listed. </p>
          <p>To filter the data per job number, simply select the job(s) desired from the search bar at the top of the page.</p>
          <h3>Status</h3>
          <Badge status="success" text="Complete" /><br/>
          <Badge status="warning" text="Awaiting Confirmation" /><br/>
          <Badge status="processing" text="Emailed" /><br/>
        </div>
      )
    }
    if (currentPage === '/hazard-register/') {
      return (
        <div>
          <h1>Hazard Register</h1>
          <p>By default, the information from every job will be listed. </p>
          <p>To filter the data per job number, simply select the job(s) desired from the search bar at the top of the page.</p>
          <h3>Status</h3>
          <Badge status="success" text="Closed Out" /><br/>
          <Badge status="error" text="Action Required" /><br/>
        </div>
      )
    }
    if (currentPage === '/sqe-stats/') {
      return (
        <div>
          <h1>SQE Stats</h1>
          <p>By default, all the information for all jobs will be listed.</p>
          <p>To filter the data per job number, simply select the job(s) desired from the search bar at the top of the page.</p>
          <p>Job information can also be filtered by date range. Selecting the date field top right of the page will display a calendar;
             There are some preset ranges to simplify selection but custom ranges can be choosen by selecting a start and end date on the calendar itself. </p>
        </div>
      )
    }
    if (currentPage === '/profile/') {
      return (
        <div>
          <h1>Profile</h1>
          <p>This page is where accounts for the portal are managed. (Not Fulcrum)</p>
          </div>
      )
    } else {return null}

  }
}
