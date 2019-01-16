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
    concretePumpQuestion: null,
    name: null,
    company: null,
    type: null,
    make: null,
    rawForm: null,
    imagesUploaded: [],
    saved: false,
    error: false
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
        })
        .catch(err => {
          console.log(err);
          this.setState({ error: true })
        })
    }
  }
  saveForm() {
    if (this.state.verificationNumber !== null || this.state.verificationNumber !== '') {
      let importedForm = this.state.rawForm

      importedForm.status = 'Awaiting Confirmation'
      importedForm.form_values['926d'] = this.state.company //company
      if (this.state.type !== null && this.state.type !== '') {
        importedForm.form_values['d8a2'] = {
          choice_values: [this.state.type]
        }
      }
      let imgKeys = [];
      this.state.imagesUploaded.forEach(img => {
        client.photos.create(img.imgFile.originFileObj)
          .then(created => {
            imgKeys.push({ key: created.access_key, section: img.imgFile.section })
          })
          .catch(err => console.log(err))
      })
      imgKeys.forEach(key => {
        console.log(key);

        if (key.section === 'allplant') {
          importedForm.form_values['12fa'] = [{ photo_id: key.key }]
        } else if (key.section === 'crane1') {
          importedForm.form_values['7213'] = [{ photo_id: key.key }]
        } else if (key.section === 'crane2') {
          importedForm.form_values['7213'] = [{ photo_id: key.key }]
        } else if (key.section === 'lifting') {
          importedForm.form_values['472a'] = [{ photo_id: key.key }]
        } else if (key.section === 'concrete') {
          importedForm.form_values['fe3d'] = [{ photo_id: key.key }]
        }
      })

      //plant type
      importedForm.form_values['7c25'] = this.state.make //make
      importedForm.form_values['f868'] = this.state.name //name

      importedForm.form_values['ac34'] = this.state.questions[0].selection //q1
      importedForm.form_values['ae64'] = this.state.questions[1].selection //q2
      importedForm.form_values['86f5'] = this.state.questions[2].selection //q3
      importedForm.form_values['0aed'] = this.state.questions[3].selection //q4
      importedForm.form_values['a713'] = this.state.questions[4].selection //q5

      // client.records.update(importedForm.id, importedForm)
      //   .then(form => {
      //     // message.success(`Form saved and submitted.`)
      //     this.setState({
      //       verificationNumber: null,
      //       saved: true
      //     })
      //   })
      //   .catch(err => {
      //     console.log(err);
      //     this.setState({
      //       error: true
      //     })
      //   })
    }
  }
  imageUpload(section) {
    return (
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
            this.setState({
              imagesUploaded: [...this.state.imagesUploaded, { imgFile: info.file, section: section }]
            })
            console.log(info.file);

            message.success(`${info.file.name} file uploaded successfully`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        }}>
        <Button style={{
          width: '100% !important',
        }}>
          <Icon type="upload" /> Click to Upload
                </Button>
      </Upload>
    )
  }
  formAllPlant() {
    if (this.state.verificationNumber && this.state.error !== true) {
      if (this.state.verificationNumber.length > 2) {
        return (
          <div>
            <div className='container'>
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
                  <Col xs={24} sm={24} md={8} lg={8} xl={8}> <h3 style={{ textAlign: 'center' }}>Name</h3></Col>
                  <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                    <Input style={{ width: '100%' }} placeholder='John Smith' value={this.state.name} onChange={e => this.setState({ name: e.target.value })} />
                  </Col>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} style={{ marginBottom: 20 }}>
                  <Col xs={24} sm={24} md={8} lg={8} xl={8}> <h3 style={{ textAlign: 'center' }}>Company</h3></Col>
                  <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                    <Input style={{ width: '100%' }} placeholder='Acme Incorporated' value={this.state.company} onChange={e => this.setState({ company: e.target.value })} />
                  </Col>
                </Col>
              </Row>
              <Row gutter={10}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} style={{ marginBottom: 20 }}>
                  <Col xs={24} sm={24} md={8} lg={8} xl={8}> <h3 style={{ textAlign: 'center' }}>Plant type</h3></Col>
                  <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                    <Select style={{ width: '100%' }} value={this.state.type} onChange={e => this.setState({ type: e })}>
                      <Select.Option value="excavator">Excavator</Select.Option>
                      <Select.Option value="rollers">Roller</Select.Option>
                      <Select.Option value="loader">Loader</Select.Option>
                      <Select.Option value="compressor">Compressor</Select.Option>
                      <Select.Option value="crane">Crane</Select.Option>
                      <Select.Option value="concrete_pump">Concrete Pump</Select.Option>
                      <Select.Option value="lifting_equipment">Lifting Equipment</Select.Option>
                    </Select>
                  </Col>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} style={{ marginBottom: 20 }}>
                  <Col xs={24} sm={24} md={8} lg={8} xl={8}> <h3 style={{ textAlign: 'center' }}>Make / Model</h3></Col>
                  <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                    <Input style={{ width: '100%' }} placeholder='CAT' value={this.state.make} onChange={e => this.setState({ make: e.target.value })} />
                  </Col>
                </Col>
              </Row>
            </div>
            <div className='container'>
              {this.questions()}
              <h3>
                Please attach image of the front page of the risk assessment Here.
              </h3>
              {this.imageUpload('allplant')}
            </div>

          </div>
        )
      }
    }
  }
  plantType(type) {
    if (type === 'crane') {
      return (
        <div className='container'>
          <h1>Crane</h1>
          <h3>Attach image of Annual Registration / Certification</h3>
          {this.imageUpload('crane1')}
          <Divider />
          <h3>Attach image of Annual Crack Test on Boom</h3>
          {this.imageUpload('crane2')}
        </div>
      )
    } else if (type === 'concrete_pump') {
      return (
        <div className='container'>
          <h1>Concrete Pump</h1>
          <h3>Monthly pipe thickness testing has been conducted and records available</h3>
          <Row gutter={10}>
            <Col span={8}>
              <Button
                onClick={() => this.setState({ concretePumpQuestion: 'yes' })}
                className='pvButtons'
                type={this.state.concretePumpQuestion === 'yes' ? 'primary' : 'ghost'}>
                Yes
              </Button>
            </Col>
            <Col span={8}>
              <Button
                onClick={() => this.setState({ concretePumpQuestion: 'no' })}
                className='pvButtons'
                type={this.state.concretePumpQuestion === 'no' ? 'primary' : 'ghost'}>
                No
              </Button>
            </Col>
            <Col span={8}>
              <Button
                onClick={() => this.setState({ concretePumpQuestion: 'N/A' })}
                className='pvButtons'
                type={this.state.concretePumpQuestion === 'N/A' ? 'primary' : 'ghost'}>
                N/A
              </Button>
            </Col>
          </Row>
          <Divider />
          <h3>Attach image of Annual Crack Test on Boom</h3>
          {this.imageUpload('concrete')}
        </div>
      )
    } else if (type === 'lifting_equipment') {
      return (
        <div className='container'>
          <h1>Lifting Equipment</h1>
          <p>Lifting gear being brought onto the site must be tested and tagged within past 12 months and input into a register showing
             serial number and test date - register template can be supplied by Simpsons if required.</p>
          <h3>Attach copy or image of Lifting Gear Register</h3>
          {this.imageUpload('lifting')}
        </div>
      )
    }
  }
  submitButton() {
    if (this.state.verificationNumber && this.state.error !== true) {
      if (this.state.verificationNumber.length > 2) {
        return (
          <div style={{ maxWidth: 500, margin: 'auto', marginTop: 15, marginBottom: 15 }}>
            <Button
              onClick={() => { this.saveForm() }}
              size='large'
              style={{ width: '100%', borderBottom: '2px solid #2ecc71', backgroundColor: '#f6ffed' }}>
              Save and Submit Form
            </Button>
          </div>
        )
      }
    }
  }
  formStatusMessage() {
    if (this.state.saved) {
      return (
        <div style={{
          background: '#fff',
          width: '100%',
          height: '100%',
          maxWidth: 1000,
          margin: 'auto',
          padding: '24px',
          marginTop: '12px',
          textAlign: 'center'
        }}>
          <Icon type="check-circle" style={{ fontSize: 20, color: '#2ecc71' }} />
          <h3>Form Saved and submited</h3>
          <p>If you wish to make changes; either refresh the page or click the link you have been emailed to continue where to left off.</p>
        </div>
      )
    } else if (this.state.error) {
      return (
        <div style={{
          background: '#fff',
          width: '100%',
          height: '100%',
          maxWidth: 1000,
          margin: 'auto',
          padding: '24px',
          marginTop: '12px',
          textAlign: 'center'
        }}>
          <Icon type="close-circle" style={{ fontSize: 20, color: '#e74c3c' }} />
          <h3>Did not find any verification records.</h3>
          <p>The record may have been deleted or the wrong link was supplied.</p>
        </div>
      )
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

          {this.formStatusMessage()}
          {this.formAllPlant()}
          {this.plantType(this.state.type)}
          {this.submitButton()}

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
