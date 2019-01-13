import React, { Component } from 'react'
import { Layout, Input, Row, Col, Button, Divider, Upload, Icon, message } from 'antd'
import logo from '../constants/nav_logo_white.png'
import { Client } from 'fulcrum-app'
import './index.css'

const { Content, Header } = Layout;
const client = new Client(process.env.REACT_APP_SECRET_KEY)

export default class PlantVerificationPage extends Component {
  state = {
    verificationNumber: null,
    questions: [{
      id: 0,
      text: 'Is the risk assessment current and all actions arising from assessment been closed out?',
      selection: null
    }, {
      id: 1,
      text: 'Have modifications have been made to the item of plant since the last hazard risk assessment?',
      selection: null
    }, {
      id: 2,
      text: 'Is maintenance and servicing up to date?',
      selection: null
    }, {
      id: 3,
      text: 'Is manual in cabin of the machine?',
      selection: null
    }, {
      id: 4,
      text: 'Log book / plant pre-start records are with the machine?',
      selection: null
    }]
  }
  componentDidMount = () => {
    let verificationNumber = window.location.pathname.replace('/plant-verification', '').replace('/', '')     
    if (this.state.verificationNumber === null) {
      if (verificationNumber.length > 2) {
        this.setState({
          verificationNumber
        })
      }
    }   
  }
  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.verificationNumber !== this.state.verificationNumber ) {
      this.loadForm()      
    }
  }

  selection(id, option) {
    let before = this.state.questions
    before[id].selection = option
    this.setState({
      before
    })
  }
  questions() {
    let questions = []
    this.state.questions.forEach(question => {
      questions.push(
        <div key={question.id}>
          <h3>{question.text}</h3>
          <Row gutter={10}>
            <Col span={8}>
              <Button
                onClick={() => this.selection(question.id, 'yes')}
                className='pvButtons'
                type={this.state.questions[question.id].selection === 'yes' ? 'primary' : 'ghost'}>
                Yes
              </Button>
            </Col>
            <Col span={8}>
              <Button
                onClick={() => this.selection(question.id, 'no')}
                className='pvButtons'
                type={this.state.questions[question.id].selection === 'no' ? 'primary' : 'ghost'}>
                No
              </Button>
            </Col>
            <Col span={8}>
              <Button
                onClick={() => this.selection(question.id, 'N/A')}
                className='pvButtons'
                type={this.state.questions[question.id].selection === 'N/A' ? 'primary' : 'ghost'}>
                N/A
              </Button>
            </Col>
          </Row>
          <Divider />
        </div>
      )
    })
    return questions
  }
  loadForm() {
    if (this.state.verificationNumber !== null) {
      client.records.find(this.state.verificationNumber)
        .then(form => {
          this.selection(0, form.form_values['ac34'])
          this.selection(1, form.form_values['ae64'])
          this.selection(2, form.form_values['86f5'])
          this.selection(3, form.form_values['0aed'])
          this.selection(4, form.form_values['a713'])

          console.log(form)
        })
        .catch(err => message.error(`Could not find record. ${err}`))
    }
  }
  saveForm() {
    if (this.state.verificationNumber !== null || this.state.verificationNumber !== '') {
      let obj = {
        id: this.state.verificationNumber,
        status: 'Awaiting Confirmation',
        form_values: {
          'ac34': this.state.questions[0].selection,
          'ae64': this.state.questions[1].selection,
          '86f5': this.state.questions[2].selection,
          '0aed': this.state.questions[3].selection,
          'a713': this.state.questions[4].selection,
        }
      }
      console.log(obj);

      client.records.update(obj.id, obj)
        .then(form => {
          message.success(`Form saved and submitted.`)
        })
        .catch(err => message.error(`Could not find record. Error: ${err}`))
    }
  }
  render() {    
    return (
      <div>
        <Header style={{ backgroundColor: '#1c3538', lineHeight: '58px' }}>
          <div>
            <img src={logo} alt="My logo" style={{ height: '100%', maxHeight: 30, paddingRight: '30px' }} />
          </div>
        </Header>
        <Content style={{ margin: '24px 16px', minHeight: '89vh', background: '#f3f3f3', marginTop: 12 }}>
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
                <h3 style={{ textAlign: 'right', paddingTop: 4 }}>Verification Number</h3>
              </Col>
              <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                <Input
                  style={{ width: '100%', marginBottom: '10px', background: '#fafafa' }}
                  value={this.state.verificationNumber}
                  disabled />
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
            <h3>Please upload any additional records or information relevant to this verification form here.</h3>
            <Upload
              name='file'
              action='//jsonplaceholder.typicode.com/posts/'
              headers={{
                authorization: 'authorization-text',
              }}
              style={{ display: 'block' }}
              onChange={(info) => {
                if (info.file.status !== 'uploading') {
                  console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                  message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                  message.error(`${info.file.name} file upload failed.`);
                }
              }}>
              <Button style={{
                width: '100% !important',
              }}>
                <Icon type="upload" /> Click to Upload Documents
                </Button>
            </Upload>
          </div>
          <div style={{ maxWidth: 500, margin: 'auto', marginTop: 15, marginBottom: 15 }}>
            <Button
              onClick={() => { this.saveForm() }}
              size='large'
              style={{ width: '100%', borderBottom: '2px solid #2ecc71', backgroundColor: '#f6ffed' }}>
              Save and Submit Form
              </Button>
          </div>

          <div id="builtByContainer" style={{ width: '100%', maxWidth: 1000 }}>
            <a href="http://www.infosync.solutions" target='_blank' rel="noopener noreferrer">
              <div id="builtBy">
                Built by Info Sync Solutions
            </div>
            </a>
          </div>
        </Content>
      </div >
    )
  }
}
