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
import Loader from '../Pages/Loader'
import PageNotes from './PageNotes'

import './index.css'
import { Layout, message, Tooltip, Modal, Button} from 'antd'

const client = new Client(process.env.REACT_APP_SECRET_KEY)
const listFormIds = [
  { form_id: '0a877c38-ecdb-434a-a0ec-0b283ee8d1b6' }, // Job file
  { form_id: '8624ca67-d338-428c-8924-6d4e7ae6c17a' }, // Daily prestart
  { form_id: '99a2f95d-ba0e-4cc8-8d7d-6e08c2c9ca5a' }, // Plant verification
  { form_id: '1b0fe741-65e4-44eb-b7bb-8aeeb1b2c8d5' }, // Site inspection
  { form_id: '1b9a6e3c-2c36-4431-8fcb-bcdb2bc3c760' }, // Toolbox minutes
  { form_id: '08e7cbcf-4ae7-4ec1-8b84-53a3600d9014' },  // Daily Diary
  { form_id: '24b9e89a-4efd-463f-a200-fa1c33b59c13' }  // Hazard Register
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
      this.autoReload()
    } else {
      this.setState({ loadingScreen: true })
      this.loadFulcrumData();
      this.autoReload()
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
  updateDimensions = () => {
    this.setState({ width: window.innerWidth });
  }
  componentWillMount() {
    this.updateDimensions();
  }
  autoReload() {
    setTimeout(this.autoReload.bind(this), 605000);

    var reload = moment().subtract(10, 'minutes').format("LTS");
    if (this.state.lastLoaded !== null) {
      if (moment(reload, 'h:mm:ss') > moment(this.state.lastLoaded, 'h:mm:ss')) {
        //console.log('%c 10 minutes has passed, Reloading data.', 'color: green; font-size: 12px');
        this.loadFulcrumData();
      }
    }
  }

  loadFulcrumData(evt) {
    if (evt === 'Button Refresh') { message.loading('Loading Fulcrum data..', 2.5) }
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

        db.lastLoadedData(this.state.user.id, moment().format('Do MMMM YYYY, h:mm:ss a'))

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
          <Tooltip title="Data loads automatically after 10 minutes." mouseEnterDelay={2} placement='bottom'>
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
            </div>
          </Content>
          <Button block onClick={this.PageNotes} style={{maxWidth: 200, margin: 'auto', marginTop: 15}} className='printHide'>Page Notes</Button>
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
