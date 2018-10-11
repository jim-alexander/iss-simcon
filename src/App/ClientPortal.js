import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import * as routes from '../constants/routes'
import { Client } from 'fulcrum-app'
import { firebase, db } from '../firebase'
import moment from 'moment';

import withAuthorization from '../Session/withAuthorization'
import { Navigation, NavigationSmaller } from '../Navigation'
import Home from '../Pages/Home'
import Outline from "../Pages/Outline"
import Profile from "../Pages/Profile"
import Loader from '../Pages/Loader'

import './index.css'
import { Layout, message, Tooltip } from 'antd'
import 'antd/dist/antd.css' //This is the AntDesign css file

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
        username: '',
        role: '',
        email: ''
      },
      SimpconTest: [],
      loadingScreen: false,
      width: '',
      lastLoaded: null
    };
  }
  componentDidMount() {
    if (firebase.auth.currentUser) {
      db.getCurrentUsername(firebase.auth.currentUser.uid)
        .then(snapshot => {
          var usernameFound = snapshot.child("username").val();
          var roleFound = snapshot.child("role").val();
          var emailFound = snapshot.child("email").val();
          this.setState({
            user: {
              username: usernameFound,
              role: roleFound,
              email: emailFound
            }
          })
        }
        )
    }
    if (localStorage.getItem('SimpconTest') !== null) {
      this.setState({
        SimpconTest: JSON.parse(localStorage.getItem('SimpconTest'))
      })
      this.loadFulcrumData();
    } else if (localStorage.getItem('SimpconTest') === null) {
      this.setState({ loadingScreen: true })
      this.loadFulcrumData();
    }
    window.addEventListener("resize", this.updateDimensions);
  }
  updateDimensions = () => {
    this.setState({ width: window.innerWidth });
  }
  componentWillMount() {
    this.updateDimensions()
  }

  loadFulcrumData(evt) {
    var autoLoad;
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

        console.log('%c Data has been loaded successfuly.', 'color: green; font-size: 12px');
        clearTimeout(autoLoad);
        autoLoad = setTimeout(this.loadFulcrumData.bind(this), 600000);

        localStorage.setItem('SimpconTest', JSON.stringify(this.state.SimpconTest))

        if (evt === 'Button Refresh') { message.success('Data is up to date.') }
      }).catch((error) => console.log(error));
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
              <Route exact path={routes.CLIENTPORTAL} render={props => <Home {...props} user={this.state.user} posts={this.state.Posts} SimpconTest={this.state.SimpconTest} DailyLogs={this.state.DailyLogs} prestarts={this.state.Prestarts} />} />
              <Route path={routes.OUTLINE} render={props => <Outline {...props} SimpconTest={this.state.SimpconTest} user={this.state.user} />} />
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
