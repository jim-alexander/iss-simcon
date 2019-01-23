import React, { Component } from 'react'
import { Select, Table, Button, Row, Col, message } from 'antd'
import * as column from './columns'
import PlantVerification from './PlantVerification'
import moment from 'moment'
import { Client } from 'fulcrum-app'
import { db } from '../../firebase'

import './index.css'

const client = new Client(process.env.REACT_APP_SECRET_KEY)
const Option = Select.Option;

export default class SitePlantRegister extends Component {
  constructor() {
    super();
    this.state = {
      selectedJob: [],
      data: null,
      visible: false
    };
    this.onClose = this.onClose.bind(this);
    this.onOk = this.onOk.bind(this);
  }

  selectJob() {
    return (
      <Select
        mode='multiple'
        placeholder="Select Job Number(s)"
        style={{ width: '100%', paddingBottom: 10 }}
        onChange={(job) => { this.setState({ selectedJob: job }) }}>
        {this.props.jobFiles.map(job => {
          return (<Option key={job.project_id}>{job.form_values["5b1c"]}</Option>)
        })}
      </Select>
    )
  }
  componentDidMount() {
    db.lastViewedPage(this.props.user.id, 'Plant Register');   
    this.plantData()
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.plantVerifications !== this.props.plantVerifications
      || prevState.selectedJob !== this.state.selectedJob) {
      db.lastViewedPage(this.props.user.id, 'Plant Register');

      this.plantData()
    }
  }
  plantData() {
    var data = []
    function verifications(verification) {
      console.log(verification.id);
      
      let type = (verification.form_values['d8a2']) ? verification.form_values['d8a2'].choice_values[0] : ''
      let date = (verification.form_values['c553']) ? verification.form_values['c553'] : moment(verification.created_at).format('YYYY-MM-DD')
      let obj = {
        id: verification.id,
        status: verification.status,
        date,
        email: verification.form_values['90f8'],
        type,
        make: verification.form_values['7c25'],
        owner: verification.form_values['926d'],
        serial: verification.form_values['0abe'],
        records: '', //TODO
      }
      return obj
    }

    if (this.state.selectedJob.length !== 0) {
      this.state.selectedJob.forEach(selection => {
        this.props.plantVerifications.forEach(verification => {
          if (selection === verification.project_id) {
            data.push(verifications(verification))
          }
        })
      })
    } else {
      this.props.plantVerifications.forEach(verification => {
        data.push(verifications(verification))
      })
    }
    this.setState({
      data
    })
  }
  onClose() {
    this.setState({ visible: false });

  }
  onOk() {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      var obj = {
        form_id: 'c4307607-a450-4673-8602-fa5bcb36f366',
        status: 'Emailed',
        project_id: values.job,
        form_values: {
          'c553': moment().format('YYYY-MM-DD'),
          '6a97': values.message,
          '90f8': values.email,
        }
      }

      client.records.create(obj)
      .then(resp => {
        console.log(resp);
        message.success(`Email sent to: ${values.email}`);
        this.setState({
          visible: false,
          data: [...this.state.data, {
            id: Math.random(),
            status: 'Emailed',
            date: moment().format('YYYY-MM-DD'),
            email: values.email,
            type: '',
            make: '',
            owner: '',
            serial: '',
            records: 'todo',
          }]
        });
      })
      .catch(err => {
        message.error(`Email failed to send: ${err}`);
        this.setState({
          visible: false,
        })
        console.log(err)
      })
      console.log('Received values of form: ', values);
      form.resetFields();
    });
  }
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }
  render() {
    return (
      <div>
        <Row gutter={10}>
          <Col xs={24} sm={24} md={24} lg={18} xl={18}>
            {this.selectJob('multiple')}
          </Col>
          <Col xs={24} sm={24} md={24} lg={6} xl={6} style={{ marginBottom: 10 }}>
            <Button style={{ width: '100%' }} onClick={() => this.setState({ visible: true })} ghost type='primary'>Send Plant Verification</Button>
            <PlantVerification
              visible={this.state.visible}
              onClose={this.onClose}
              onOk={this.onOk}
              jobFiles={this.props.jobFiles}
              wrappedComponentRef={this.saveFormRef} />
          </Col>
        </Row>
        <Table
          pagination={false}
          bordered
          id='boresTableOne'
          className='boreTables tableResizer'
          columns={column.plantRegister}
          dataSource={this.state.data}
          rowClassName={record => record.status}
          rowKey='id'
          size="middle" />
      </div>
    )
  }
}
