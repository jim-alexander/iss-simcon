import React from 'react';
import * as routes from '../constants/routes';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';


export const Home = (role) => {
  if (role === 'client' || role === 'admin') {
    return (
      <Menu.Item key="/">
        <Link to={routes.CLIENTPORTAL}>
          <Icon type="pie-chart" />
          <span className="nav-text">Home</span>
        </Link>
      </Menu.Item>
    )
  } else {
    return;
  }
}
export const Outline = (role) => {
  if (role === 'client' || role === 'admin') {
    return (
      <Menu.Item key="/outline/">
        <Link to={routes.OUTLINE}>
          <Icon type="bars" />
          <span className="nav-text">Outline</span>
        </Link>
      </Menu.Item>
    )
  } else {
    return;
  }
}

export const Chat = (role) => {
  if (role === 'admin') {
    return (
      <Menu.Item key="/chat/">
        <Link to={routes.CHAT}>
          <Icon type="share-alt" />
          <span className="nav-text">Chat</span>
        </Link>
      </Menu.Item>
    )
  } else {
    return;
  }
}

export const Profile = () => {
    return (
      <Menu.Item key="/profile/">
        <Link to={routes.PROFILE}>
          <Icon type="user" />Profile
        </Link>
      </Menu.Item>
    )
}

// These nav footer components will be shown no matter the role
export const Role = role => {
  return (
    <Menu.Item key="6" id="menuRole" disabled>
      <Icon type="safety" />
      <span className="nav-text">{role}</span>
    </Menu.Item>
  )
}
export const Username = username => {
  return (
    <Menu.Item key="7" id="menuProfile" disabled>
      <Icon type="user" />
      <span className="nav-text">{username}</span>
    </Menu.Item>
  )
}
export const Logout = () => {
  return (
    <Menu.Item key="8" id="menuLogout" onClick={auth.doSignOut}>
      <Icon type="logout" />
      <span className="nav-text">Logout</span>
    </Menu.Item>
  )
}