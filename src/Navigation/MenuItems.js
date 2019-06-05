import React from 'react'
import * as routes from '../constants/routes'
import { Menu, Icon } from 'antd'
import { Link } from 'react-router-dom'
import { auth } from '../firebase'

const { SubMenu } = Menu

export const DailyReport = role => {
  if (role === 'client' || role === 'admin') {
    return (
      <Menu.Item key="/">
        <Link to={routes.CLIENTPORTAL}>
          <Icon type="file-text" />
          <span className="nav-text">Daily Report</span>
        </Link>
      </Menu.Item>
    )
  } else {
    return
  }
}
export const Timesheets = user => {
  let allowed = [
    'loIW6RyixpYTQGmIiUN0Dcm9o8m1', // andy
    'LrLh95vCZYg7w01m5HTl8kdQj1j2', // tom
    'SWxXq519VhhzP2T5Sk4Vd05dGn72', // kevin
    '13nBwfjw44ZOM76bEFrnXsyy1ij1' // ME (JIM)
  ]

  let isAllowed = allowed.findIndex(id => id === user.id)

  if (user.role === 'client' || user.role === 'admin') {
    if (isAllowed !== -1) {
      return (
        <Menu.Item key="/timesheets/">
          <Link to={routes.TIMESHEETS}>
            <Icon type="team" />
            <span className="nav-text">Timesheets</span>
          </Link>
        </Menu.Item>
      )
    }
  } else {
    return
  }
}
export const Registers = role => {
  if (role === 'client' || role === 'admin') {
    return (
      <SubMenu
        title={
          <div>
            <Icon type="unordered-list" />
            <span className="nav-text">Registers</span>
          </div>
        }>
        {SitePlantRegister(role)}
        {IncidentRegister(role)}
        {HazardRegister(role)}
        {NonConformanceRegister(role)}
      </SubMenu>
    )
  }
}
const SitePlantRegister = role => {
  if (role === 'client' || role === 'admin') {
    return (
      <Menu.Item key="/site-plant-register/">
        <Link to={routes.SITEPLANTREGISTER}>
          <Icon type="dashboard" />
          <span className="nav-text">Site Plant</span>
        </Link>
      </Menu.Item>
    )
  } else {
    return
  }
}
const IncidentRegister = role => {
  if (role === 'client' || role === 'admin') {
    return (
      <Menu.Item key="/incident-register/">
        <Link to={routes.INCIDENTREGISTER}>
          <Icon type="fire" />
          <span className="nav-text">Incidents</span>
        </Link>
      </Menu.Item>
    )
  } else {
    return
  }
}
const NonConformanceRegister = role => {
  if (role === 'client' || role === 'admin') {
    return (
      <Menu.Item key="/non-conformance-register/">
        <Link to={routes.NONCONFORMANCE}>
          <Icon type="pushpin" />
          <span className="nav-text">Conformance</span>
        </Link>
      </Menu.Item>
    )
  } else {
    return
  }
}
const HazardRegister = role => {
  if (role === 'client' || role === 'admin') {
    return (
      <Menu.Item key="/hazard-register/">
        <Link to={routes.HAZARDREGISTER}>
          <Icon type="warning" />
          <span className="nav-text">Hazards</span>
        </Link>
      </Menu.Item>
    )
  } else {
    return
  }
}
export const SQEStats = role => {
  if (role === 'client' || role === 'admin') {
    return (
      <Menu.Item key="/sqe-stats/">
        <Link to={routes.SQESTATS}>
          <Icon type="line-chart" />
          <span className="nav-text">SQE Stats</span>
        </Link>
      </Menu.Item>
    )
  } else {
    return
  }
}
export const Fulcrum = role => {
  if (role === 'client' || role === 'admin') {
    return (
      <Menu.Item key="/fulcrum/" id="fulcrum">
        <a href="https://web.fulcrumapp.com/" target="_blank" rel="noopener noreferrer">
          <Icon type="mobile" theme="outlined" />
          <span className="nav-text">Fulcrum</span>
        </a>
      </Menu.Item>
    )
  } else {
    return
  }
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
    <Menu.Item key="/profile/" id="menuProfile">
      <Link to={routes.PROFILE}>
        <Icon type="user" />
        <span className="nav-text">{username}</span>
      </Link>
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
