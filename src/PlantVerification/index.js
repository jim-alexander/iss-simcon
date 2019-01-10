import React, { Component } from 'react'
import { Layout, Input, Row, Col, Button, Divider } from 'antd'
import logo from '../constants/nav_logo_white.png'
import './index.css'

const { Content, Header } = Layout;

export default class PlantVerificationPage extends Component {
  state = {
    verificationNumber: null
  }
  componentDidMount = () => {
    this.setState({
      verificationNumber: window.location.pathname.replace('/plant-verification', '').replace('/', '')
    })
  }
  questions() {
    let questions = []
    let que = [
      'Is the risk assessment current and all actions arising from assessment been closed out?',
      'Have modifications have been made to the item of plant since the last hazard risk assessment?',
      'Is maintenance and servicing up to date?',
      'Is manual in cabin of the machine?',
      'Log book / plant pre-start records are with the machine?',
    ]
    for (let i = 0; i < 4; i++) {
      let divider = (i !== 3) ? <Divider /> : null
      questions.push(
        <div>
          <h3>{que[i]}</h3>
          <Row gutter={10}>
            <Col span={8}>
              <Button className='pvButtons' type='primary' ghost={true}>Yes</Button>
            </Col>
            <Col span={8}>
              <Button className='pvButtons' type='danger' ghost={true}>No</Button>
            </Col>
            <Col span={8}>
              <Button className='pvButtons'>N/A</Button>
            </Col>
          </Row>
          {divider}
        </div>
      )
    }
    return questions

  }

  render() {
    console.log(this.state.verificationNumber);

    return (
      <div>
        <Header style={{ backgroundColor: '#1c3538', lineHeight: '58px' }}>
          <div>
            <img src={logo} alt="My logo" style={{ height: '100%', maxHeight: 30, paddingRight: '30px' }} />
          </div>
        </Header>
        <Content style={{ margin: '24px 16px', minHeight: '89vh', background: '#f3f3f3' }}>
          <div style={{
            background: '#fff',
            width: '100%',
            height: '100%',
            maxWidth: 1000,
            margin: 'auto',
            padding: '24px'
          }}>
            <h1 style={{ textAlign: 'center' }}>Plant Verification Form</h1>
            <Divider />
            <Row gutter={10}>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <h3 style={{textAlign: 'right'}}>Verification Number</h3>
              </Col>
              <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                <Input
                  style={{ width: '100%', marginBottom: '10px' }}
                  value={this.state.verificationNumber}
                  disabled
                  onChange={e => {
                    this.setState({
                      verificationNumber: e.target.value
                    })
                  }} />
              </Col>
            </Row>
          </div>
          <div style={{
            background: '#fff',
            width: '100%',
            height: '100%',
            maxWidth: 1000,
            margin: 'auto',
            padding: '24px',
            marginTop: '12px'
          }}>
            {this.questions()}
          </div>
          <div id="builtByContainer">
            <a href="http://www.infosync.solutions" target='_blank' rel="noopener noreferrer">
              <div id="builtBy">
                Built by Info Sync Solutions
            </div>
            </a>
          </div>
        </Content>
      </div>
    )
  }
}
