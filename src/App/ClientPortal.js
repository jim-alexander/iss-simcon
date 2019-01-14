import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import * as routes from '../constants/routes'
import { Client } from 'fulcrum-app'
import { firebase, db } from '../firebase'
import moment from 'moment';

import withAuthorization from '../Session/withAuthorization'
import { Navigation, NavigationSmaller } from '../Navigation'

import DailyReportSheet from '../Pages/DailyReportSheet'
import Timesheets from "../Pages/Timesheets"
import SitePlantRegister from "../Pages/SitePlantRegister"
import SQEStats from "../Pages/SQEStats"
import HazardRegister from "../Pages/HazardRegister"
import Profile from "../Pages/Profile"
import Job from "../Pages/Job"
import Loader from '../Pages/Loader'
import PageNotes from './PageNotes'

import './index.css'
import { Layout, message, Tooltip, Modal, Button} from 'antd'

const client = new Client(process.env.REACT_APP_SECRET_KEY)
const listFormIds = [
  { form_id: '4e07314d-e9e4-4efb-9b9b-3f3b9492f345' }, // Job file
  { form_id: '2f101ab8-a62b-427c-96af-09fd9b5b26bb' }, // Daily prestart
  { form_id: 'c4307607-a450-4673-8602-fa5bcb36f366' }, // Plant verification
  { form_id: '572fccd2-4500-4e59-8fac-fd3f428a4094' }, // Site inspection
  { form_id: '15f5e75d-a3d3-4856-881c-326e5e02ac54' }, // Toolbox minutes
  { form_id: '48ca5050-04ce-4939-9928-6b4509a330e7' },  // Daily Diary
  { form_id: '3e7888a5-26fa-449d-a183-b5a228c6e59a' }  // Hazard Register
]

const { Content, Footer } = Layout

class ClientPortal extends Component {
  constructor() {
    super();
    this.state = {
      user: {
        id: '',
        username: '',
        role: '',
        email: ''
      },
      jobFiles: [],
      dailyPrestarts: [],
      plantVerifications: [],
      siteInspections: [],
      toolboxMinutes: [],
      dailyDiarys: [],
      hazards: [],
      loadingScreen: false,
      width: '',
      lastLoaded: null,
    };
  }
  componentDidMount() {
    if (firebase.auth.currentUser) {
      db.getCurrentUsername(firebase.auth.currentUser.uid)
        .then(snapshot => {
          var idFound = snapshot.key;
          var usernameFound = snapshot.child("username").val();
          var roleFound = snapshot.child("role").val();
          var emailFound = snapshot.child("email").val();
          var colorFound = snapshot.child("color").val();
          this.setState({
            user: {
              id: idFound,
              username: usernameFound,
              role: roleFound,
              email: emailFound,
              color: colorFound
            }
          })
        }).catch(err => message.error('There has been an error loading user data. Please be patient. Error: ' + err, 10))
    }
    if (localStorage.getItem('jobFiles') !== null &&
      localStorage.getItem('dailyPrestarts') !== null &&
      localStorage.getItem('plantVerifications') !== null &&
      localStorage.getItem('siteInspections') !== null &&
      localStorage.getItem('toolboxMinutes') !== null &&
      localStorage.getItem('dailyDiarys') !== null && 
      localStorage.getItem('hazards') !== null) {
      this.setState({
        jobFiles: JSON.parse(localStorage.getItem('jobFiles')),
        dailyPrestarts: JSON.parse(localStorage.getItem('dailyPrestarts')),
        plantVerifications: JSON.parse(localStorage.getItem('plantVerifications')),
        siteInspections: JSON.parse(localStorage.getItem('siteInspections')),
        toolboxMinutes: JSON.parse(localStorage.getItem('toolboxMinutes')),
        dailyDiarys: JSON.parse(localStorage.getItem('dailyDiarys')),
        hazards: JSON.parse(localStorage.getItem('hazards')),

      })
      this.loadFulcrumData();
      this.interval = setInterval(() => this.loadFulcrumData(), 300000);
    } else {
      this.setState({ loadingScreen: true })
      this.loadFulcrumData();
      this.interval = setInterval(() => this.loadFulcrumData(), 300000);
    }
    window.addEventListener("resize", this.updateDimensions);
    // client.forms.all({ schema: false })
    //   .then((page) => {
    //     console.log(page.objects);
    //   })
    //   .catch((error) => {
    //     console.log('Error getting your forms.', error.message);
    //   });
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  updateDimensions = () => {
    this.setState({ width: window.innerWidth });
  }
  componentWillMount() {
    this.updateDimensions();
  }

  loadFulcrumData(evt) {
    if (evt === 'Button Refresh') { message.loading('Loading Fulcrum data..', 0) }
    var promises = listFormIds.map(form_id => client.records.all(form_id));
    Promise.all(promises)
      .then(dataReceived => {

        this.setState({
          jobFiles: dataReceived[0].objects,
          dailyPrestarts: dataReceived[1].objects,
          plantVerifications: dataReceived[2].objects,
          siteInspections: dataReceived[3].objects,
          toolboxMinutes: dataReceived[4].objects,
          dailyDiarys: dataReceived[5].objects,
          hazards: dataReceived[6].objects
        });
        // console.log("Data loaded");
        

      }).then(() => {
        this.setState({
          lastLoaded: moment().format("LT"),
          loadingScreen: false
        });

        //console.log('%c Data has been loaded successfuly.', 'color: green; font-size: 12px');
        function saveRecentData(data, num) {
          var returned = [];
          data = data.reverse()
          for (let i = 0; i < num; i++) {
            if (data[i]) {
              returned.push(data[i])
            }
          }
          return returned
        }
        localStorage.setItem('jobFiles', JSON.stringify(saveRecentData(this.state.jobFiles, 10)))
        localStorage.setItem('dailyPrestarts', JSON.stringify(saveRecentData(this.state.dailyPrestarts, 200)))
        localStorage.setItem('plantVerifications', JSON.stringify(saveRecentData(this.state.plantVerifications, 40)))
        localStorage.setItem('siteInspections', JSON.stringify(saveRecentData(this.state.siteInspections, 20)))
        localStorage.setItem('toolboxMinutes', JSON.stringify(saveRecentData(this.state.toolboxMinutes, 10)))
        localStorage.setItem('dailyDiarys', JSON.stringify(saveRecentData(this.state.dailyDiarys, 200)))
        localStorage.setItem('hazards', JSON.stringify(saveRecentData(this.state.hazards, 200)))
        // console.log("Recent Data Saved Locally");
        
        db.lastLoadedData(this.state.user.id, moment().format('Do MMMM YYYY, h:mm:ss a'))
        message.destroy()
        if (evt === 'Button Refresh') { message.success('Data is up to date.') }
      }).catch((error) => {
        console.log(error)
      });
  }
  
  PageNotes() {
    Modal.info({
      title: 'Page Notes',
      content: (
        <PageNotes currentPage={window.location.pathname} />
      ),
      onOk() {},
    });
  }
  
  render() {    
    function navigationBased(width, user) {
      if (width >= 992) { return <Navigation user={user} /> }
      else if (width <= 991) { return <NavigationSmaller user={user} /> }
    }
    if (this.state.loadingScreen === true) {
      return (
        <Layout style={{ minHeight: '100vh' }}>
          <Content style={{ margin: '24px 16px 0', minHeight: '89vh', background: '#f3f3f3' }}>
            <div style={{ padding: 24, background: '#fff', height: '100%' }}>
              <Loader />
            </div>
          </Content>
          <Footer style={{ textAlign: 'center', background: '#f3f3f3' }}>
            Info Sync Solutions ©2018 Created by Jim Alexander
          </Footer>
        </Layout>
      )
    }
    return (
      <Layout>
        {navigationBased(this.state.width, this.state.user)}
        <Layout className="layoutContent">
          <Tooltip title="Data loads automatically after 5 minutes." mouseEnterDelay={2} placement='bottom'>
            <div id="lastLoaded" onClick={() => this.loadFulcrumData("Button Refresh")} className='printHide'>
              <span id='lastLoadedDefault'>Data Last Loaded {this.state.lastLoaded}</span>
              <span id='lastLoadedRefreash'>Click to Refresh Data</span>
            </div>
          </Tooltip>
          <Content style={{ margin: "24px 16px 0", minHeight: "89vh" }}>
            <div style={{ padding: 24, background: "#fff", height: "100%" }}>
              <Route exact path={routes.CLIENTPORTAL} render={props => <DailyReportSheet {...props}
                user={this.state.user}
                dailyPrestarts={this.state.dailyPrestarts}
                jobFiles={this.state.jobFiles}
                dailyDiarys={this.state.dailyDiarys} />} />
              <Route path={routes.TIMESHEETS} render={props => <Timesheets {...props}
                jobFiles={this.state.jobFiles}
                dailyPrestarts={this.state.dailyPrestarts}
                user={this.state.user} />} />
              <Route path={routes.SITEPLANTREGISTER} render={props => <SitePlantRegister {...props}
                user={this.state.user}
                jobFiles={this.state.jobFiles}
                plantVerifications={this.state.plantVerifications}
              />} />
              <Route path={routes.SQESTATS} render={props => <SQEStats {...props}
                user={this.state.user}
                dailyPrestarts={this.state.dailyPrestarts}
                jobFiles={this.state.jobFiles}
                dailyDiarys={this.state.dailyDiarys}
                siteInspections={this.state.siteInspections}
                toolboxMinutes={this.state.toolboxMinutes}
                hazards={this.state.hazards} />} />
              <Route path={routes.HAZARDREGISTER} render={props => <HazardRegister {...props}
                user={this.state.user}
                jobFiles={this.state.jobFiles}
                hazards={this.state.hazards} />} />
              <Route path={routes.PROFILE} render={props => <Profile {...props} user={this.state.user} />} />
              <Route path={routes.JOB} render={props => <Job {...props} user={this.state.user} />} />
            </div>
            <Button block onClick={this.PageNotes} style={{maxWidth: 200, margin: '15px auto'}} className='printHide'>Page Notes</Button>
          </Content>
          <Footer style={{ textAlign: "center", background: '#f3f3f3' }} className='printHide'>
            Info Sync Solutions ©2018 Created by Jim Alexander
          </Footer>
        </Layout>
      </Layout>
    )
  }
}
const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(ClientPortal);
