import React from 'react';
import { Layout, Menu, Icon, Drawer } from 'antd';
import * as item from './MenuItems'
import logo from '../constants/nav_logo_white.png'

import 'antd/dist/antd.css'; //This is the AntDesign css file
import './index.css'

// const SubMenu = Menu.SubMenu;
const { Sider } = Layout;

const navMenu = (user, notify) => {
  return (
    <div>
      <div className="logo"><img src={logo} alt="My logo" style={{height: '100%', paddingLeft: '30px', marginTop: '3px'}}/></div>
      <Menu theme='dark' mode="inline" defaultSelectedKeys={[window.location.pathname]} style={{borderTop: '#b3b3b333 solid 1px'}}>
        {item.DailyReport(user.role)}
        {item.Timesheets(user.role)}
        {item.SitePlantRegister(user.role)}
        {item.HazardRegister(user.role)}
        {item.SQEStats(user.role)}
        {item.Role(user.role)}
        {item.Username(user.username)}
        {item.Logout(user.role)}
      </Menu>
    </div>
  )
}

export class Navigation extends React.Component {
  render () {
    return(
      <Sider
        collapsedWidth="0"
        style={{ minHeight: "100vh"}}
        id="layoutSider"
        theme='dark'
        className='printHide'
      >
        {navMenu(this.props.user, this.props.notification)}
      </Sider>
    )
  }
}

export class NavigationSmaller extends React.Component {
  state = { 
    visible: false,
     left: '0'
  };
  showDrawer = () => {
    this.setState({
      visible: true,
      left: '200px'
    });
  };
  onClose = () => {
    this.setState({
      visible: false,
      left: '0'
    });
  };
  render () {
    return(
      <div className='printHide'>
      <Drawer
        placement="left"
        closable={false}
        onClose={this.onClose}
        visible={this.state.visible}
        style={{maxWidth: '200px',  animationDuration: '0s !important'}}
      >
        {navMenu(this.props.user, this.props.notification)}
      </Drawer>
      <div style={{background: '#1d3033',width: '36px', padding: '10px', position: 'fixed', margin: '10px 0', borderRadius: '0 5px 5px 0', left: this.state.left, top: '5px', zIndex: 1}} onClick={this.showDrawer}>
        <Icon type="bars" style={{color: 'white'}} />
      </div>
      </div>
    )
  }
}
