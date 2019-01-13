import React, { Component } from 'react'
import { Layout, Input, Row, Col, Button, Divider, Upload, Icon, message, Select } from 'antd'
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
    }],
    name: null,
    company: null,
    type: null,
    make: null,
    rawForm: null
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
    if (prevState.verificationNumber !== this.state.verificationNumber) {
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
          this.setState({
            rawForm: form,
            name: form.form_values['f868'],
            company: form.form_values['926d'],
            type: form.form_values['d8a2'] ? form.form_values['d8a2'].choice_values[0] : null,
            make: form.form_values['7c25']
          })
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
      let importedForm = this.state.rawForm
      importedForm.status = 'Awaiting Confirmation'
console.log(importedForm);

      importedForm.form_values['926d'] = this.state.company //company
      if (this.state.type !== null && this.state.type !== '') {
        importedForm.form_values['d8a2'] = {
          choice_values: [this.state.type]
        }
      }
       //plant type
      importedForm.form_values['7c25'] = this.state.make //make
      importedForm.form_values['f868'] = this.state.name //name

      importedForm.form_values['ac34'] = this.state.questions[0].selection //q1
      importedForm.form_values['ae64'] = this.state.questions[1].selection //q2
      importedForm.form_values['86f5'] = this.state.questions[2].selection //q3
      importedForm.form_values['0aed'] = this.state.questions[3].selection //q4
      importedForm.form_values['a713'] = this.state.questions[4].selection //q5
      
      console.log(importedForm);
      
      
      client.records.update(importedForm.id, importedForm)
        .then(form => {
          message.success(`Form saved and submitted.`)
          setTimeout(() => {
            window.close()
          }, 3000);
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
            <Row gutter={10} style={{ marginBottom: 20 }}>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <h3 style={{ textAlign: 'center', paddingTop: 4 }}>Verification Number</h3>
              </Col>
              <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                <Input
                  style={{ width: '100%', marginBottom: '10px', background: '#fafafa' }}
                  value={this.state.verificationNumber}
                  disabled />
              </Col>
            </Row>
            <Row gutter={10}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} style={{ marginBottom: 20 }}>
                <Col xs={24} sm={24} md={8} lg={8} xl={8}> <h3 style={{textAlign: 'center'}}>Name</h3></Col>
                <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                  <Input style={{ width: '100%' }} placeholder='John Smith' value={this.state.name} onChange={e => this.setState({name: e.target.value})}/>
                </Col>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} style={{ marginBottom: 20 }}>
                <Col xs={24} sm={24} md={8} lg={8} xl={8}> <h3 style={{textAlign: 'center'}}>Company</h3></Col>
                <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                  <Input style={{ width: '100%' }} placeholder='Acme Incorporated' value={this.state.company} onChange={e => this.setState({company: e.target.value})}/>
                </Col>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} style={{ marginBottom: 20 }}>
                <Col xs={24} sm={24} md={8} lg={8} xl={8}> <h3 style={{textAlign: 'center'}}>Plant type</h3></Col>
                <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                  <Select style={{ width: '100%' }} value={this.state.type} onChange={e => this.setState({type: e})}>
                    <Select.Option value="excavator">Excavator</Select.Option>
                    <Select.Option value="rollers">Roller</Select.Option>
                    <Select.Option value="loader">Loader</Select.Option>
                    <Select.Option value="compressor">Compressor</Select.Option>
                  </Select>
                </Col>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} style={{ marginBottom: 20 }}>
                <Col xs={24} sm={24} md={8} lg={8} xl={8}> <h3 style={{textAlign: 'center'}}>Make / Model</h3></Col>
                <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                  <Input style={{ width: '100%' }} placeholder='CAT' value={this.state.make} onChange={e => this.setState({make: e.target.value})}/>
                </Col>
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
