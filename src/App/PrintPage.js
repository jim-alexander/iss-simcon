import React, { Component } from 'react'
import moment from 'moment'
import logo from '../constants/simcon_logo.jpg'

export default class PrintPage extends Component {
    render() {
        function pageTitle() {
            const currentPage = window.location.pathname
            if (currentPage === '/') {
                return 'Daily Report'
            } 
            if (currentPage === '/timesheets/') {
                return 'Timesheets'
            }
            if (currentPage === '/site-plant-register/') {
                return 'Site Plant Register'
            }
            if (currentPage === '/hazard-register/') {
                return 'Hazard Register'
            }
            if (currentPage === '/sqe-stats/') {
                return 'SQE Stats'
            } else{
                return null
            }
        }

        return (
            <div className='printShow printHeader'>
                <img src={logo} alt="My logo" style={{ height: '100%', maxHeight: 30 }} />
                <div style={{ textAlign: "right", position: 'absolute', right: 40, top: 35 }}>
                    <span className='printSubHeader'>{pageTitle()}</span><br />
                    <span className='printDateHeader'>{moment().format('LLLL')}</span>
                </div>
                <br />
            </div>
        )
    }
}
