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

import './index.css'
import { Layout, message, Tooltip } from 'antd'

const client = new Client(process.env.REACT_APP_SECRET_KEY)
const listFormIds = [
  { form_id: '8624ca67-d338-428c-8924-6d4e7ae6c17a' },
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
      SimpconTest: [],
      loadingScreen: false,
      width: '',
      lastLoaded: null,
      notify: {
        status: false,
        chatId: []
      },
      chats: null
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
    if (localStorage.getItem('SimpconTest') !== null) {
      this.setState({
        SimpconTest: JSON.parse(localStorage.getItem('SimpconTest'))
      })
      this.loadFulcrumData();
      this.autoReload()
    } else if (localStorage.getItem('SimpconTest') === null) {
      this.setState({ loadingScreen: true })
      this.loadFulcrumData();
      this.autoReload()
    }
    window.addEventListener("resize", this.updateDimensions);
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
          SimpconTest: dataReceived[0].objects,
        });

      }).then(() => {
        this.setState({
          lastLoaded: moment().format("LT"),
          loadingScreen: false
        });

        //console.log('%c Data has been loaded successfuly.', 'color: green; font-size: 12px');

        localStorage.setItem('SimpconTest', JSON.stringify(this.state.SimpconTest))

        db.lastLoadedData(this.state.user.id, moment().format('Do MMMM YYYY, h:mm:ss a'))

        if (evt === 'Button Refresh') { message.success('Data is up to date.') }
      }).catch((error) => {
        console.log(error)
      });
  }
  
  render() {
    function navigationBased(width, user, notify) {
      if (width >= 992) { return <Navigation user={user} notification={notify} /> }
      else if (width <= 991) { return <NavigationSmaller user={user} notification={notify} /> }
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
        {navigationBased(this.state.width, this.state.user, this.state.notify.status)}
        <Layout className="layoutContent">
          <Tooltip title="Data loads automatically after 10 minutes." mouseEnterDelay={2} placement='bottom'>
            <div id="lastLoaded" onClick={() => this.loadFulcrumData("Button Refresh")} className='printHide'>
              <span id='lastLoadedDefault'>Data Last Loaded {this.state.lastLoaded}</span>
              <span id='lastLoadedRefreash'>Click to Refresh Data</span>
            </div>
          </Tooltip>
          <Content style={{ margin: "24px 16px 0", minHeight: "89vh" }}>
            <div style={{ padding: 24, background: "#fff", height: "100%" }}>
              <Route exact path={routes.CLIENTPORTAL} render={props => <DailyReportSheet {...props} user={this.state.user} posts={this.state.Posts} SimpconTest={this.state.SimpconTest} DailyLogs={this.state.DailyLogs} prestarts={this.state.Prestarts} />} />
              <Route path={routes.TIMESHEETS} render={props => <Timesheets {...props} SimpconTest={this.state.SimpconTest} user={this.state.user} />} />
              <Route path={routes.SITEPLANTREGISTER} render={props => <SitePlantRegister {...props} user={this.state.user} />} />
              <Route path={routes.SQESTATS} render={props => <SQEStats {...props} user={this.state.user} />} />
              <Route path={routes.HAZARDREGISTER} render={props => <HazardRegister {...props} user={this.state.user} />} />
              <Route path={routes.PROFILE} render={props => <Profile {...props} user={this.state.user} />} />
            </div>
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
