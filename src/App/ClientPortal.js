import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import * as routes from '../constants/routes'
import {Client} from 'fulcrum-app'
import { firebase, db } from '../firebase'
import moment from 'moment';

import withAuthorization from '../Session/withAuthorization'
import {Navigation, NavigationSmaller} from '../Navigation'
import Home from '../Pages/Home'
import Outline from "../Pages/Outline"
import Profile from "../Pages/Profile"
import Loader from '../Pages/Loader'

import './index.css'
import { Layout, message } from 'antd'
import 'antd/dist/antd.css' //This is the AntDesign css file

const client = new Client(process.env.REACT_APP_SECRET_KEY)
const listFormIds = [
  {form_id: 'e328b1d1-cd10-46d5-87d8-ace3f02a3344'},
  {form_id: '1390d0f3-7363-470d-847f-7a4f393999d7'},
  {form_id: '5468a3d7-47dd-46d3-bae2-0e9591b5cf26'},
  {form_id: 'dfd98e4f-bfb0-46e9-bb82-7bd0784cbe80'},
  {form_id: '3ebdfb67-0b99-40d2-b937-b91084a12457'},
  {form_id: 'b600af12-d5d0-4b5e-ade0-ef4f500e4171'},
  {form_id: '50038e62-4596-4da6-96e9-5650dc9964b7'},
  {form_id: '3182eaff-898b-43dc-88df-d349913a2d99'}
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
      QualityPlans:[],
      loadingScreen: false, 
      width: '',
      lastLoaded: ''
    };
  }
  componentDidMount() {
    if (firebase.auth.currentUser) {
      db.getCurrentUsername(firebase.auth.currentUser.uid)
      .then( snapshot => {
        var usernameFound = snapshot.child("username").val();
        var roleFound = snapshot.child("role").val();
        var emailFound = snapshot.child("email").val();
          this.setState({
            user: {
              username: usernameFound,
              role: roleFound,
              email: emailFound
            }})
        }
      )
    }
    if (localStorage.getItem('QualityPlans') !== null) {
      this.setState({
        QualityPlans: JSON.parse(localStorage.getItem('QualityPlans'))
      })
      this.loadFulcrumData();      

    } else if (localStorage.getItem('QualityPlans') === null) {
      this.setState({loadingScreen: true})
      this.loadFulcrumData();
    }
       window.addEventListener("resize", this.updateDimensions);
      //  client.forms.all({schema: false})
      //  .then((page) => {
      //    console.log(page.objects);
      //  })
      //  .catch((error) => {
      //    console.log('Error getting your forms.', error.message);
      //  });
  }
  updateDimensions = () => {
    this.setState({width: window.innerWidth});
  }
  componentWillMount(){
    this.updateDimensions()
  }
  componentDidUpdate(){
    var reload = moment().subtract(10, 'minutes').format("LT");
    if (this.state.lastLoaded !== '') {
      if ( reload > this.state.lastLoaded) {
        console.log("Attempting to reload data.");
        this.loadFulcrumData()
        
      }
    }
  }
  loadFulcrumData(evt){
    if (evt === 'Button Refresh') {  message.loading('Loading Fulcrum data..', 2.5)}
    var promises = listFormIds.map(form_id => client.records.all(form_id));
    Promise.all(promises)
      .then(dataReceived => {
        
        this.setState({
          QualityPlans: dataReceived[0].objects,
        });

      }).then(() => {
        this.setState({ lastLoaded: moment().format("LT") });
        this.setState({loadingScreen: false})
        console.log("Data has been loaded successfuly.");

        localStorage.setItem('QualityPlans', JSON.stringify(this.state.QualityPlans))
         
        if (evt === 'Button Refresh') {  message.success('Data is up to date.')}
      }).catch((error) => console.log(error));
  }
  render() {
    function navigationBased(width, user) {
      if (width >= 992) {  return <Navigation user={user}/>  }
      else if (width <= 991) {  return <NavigationSmaller user={user} />  }
    }

    if (this.state.loadingScreen === true) {
      return (
        <Layout style={{minHeight:'100vh'}}>
          <Content style={{ margin: '24px 16px 0', minHeight:'89vh', background: '#f3f3f3' }}>
            <div style={{ padding: 24, background: '#fff', height: '100%'}}>
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
          <div id="lastLoaded" onClick={() => this.loadFulcrumData("Button Refresh")} className='printHide'>
            <span id='lastLoadedDefault'>Data Last Loaded {this.state.lastLoaded}</span>
            <span id='lastLoadedRefreash'>Click to Refresh Data</span>
          </div>
          <Content style={{ margin: "24px 16px 0", minHeight: "89vh" }}>
            <div style={{ padding: 24, background: "#fff", height: "100%" }}>
              <Route exact path={routes.CLIENTPORTAL} render={props => <Home {...props} user={this.state.user} posts={this.state.Posts} QualityPlans={this.state.QualityPlans} DailyLogs={this.state.DailyLogs} prestarts={this.state.Prestarts} />} />
              <Route path={routes.OUTLINE} render={props => <Outline {...props} QualityPlans={this.state.QualityPlans} user={this.state.user} />} />
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
