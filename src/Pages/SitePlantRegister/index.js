import React, { Component } from 'react'
import { Select, Table, Button, Row, Col, message } from 'antd'
import * as column from './columns'
import PlantVerification from './PlantVerification'
import { Client } from 'fulcrum-app'

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
        mode="multiple"
        placeholder="Select Job Number(s)"
        style={{ width: '100%', paddingBottom: 10 }}
        onChange={(job) => { this.setState({ selectedJob: job }) }}>
        {this.props.jobFiles.map(job => {
          let title = (job.form_values["7af6"]) ? ` - ${job.form_values["7af6"]}` : '';
          return (<Option key={job.project_id}>{job.form_values["5b1c"] + title}</Option>)
        })}
      </Select>
    )
  }
  componentDidMount() {
    this.plantData()
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.plantVerifications !== this.props.plantVerifications
      || prevState.selectedJob !== this.state.selectedJob) {
      this.plantData()
    }
  }
  plantData() {
    var data = []
    function verifications(verification) {
      let type = (verification.form_values['d8a2']) ? verification.form_values['d8a2'].choice_values[0] : ''
      let obj = {
        id: verification.id,
        date: verification.form_values['c553'],
        type,
        make: verification.form_values['7c25'],
        owner: verification.form_values['926d'],
        serial: verification.form_values['0abe'],
        records: 'todo',
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
        form_id: '99a2f95d-ba0e-4cc8-8d7d-6e08c2c9ca5a',
        status: 'Emailed',
        form_values: {
          // 'ce91': moment(values.date).format('YYYY-MM-DD'),
          '6a97': values.message,
          '90f8': values.email,
        }
      }
      client.records.create(obj)
        .catch(err => console.log(err))

      console.log('Received values of form: ', values);
      form.resetFields();
      message.success(`Email sent to: ${values.email}`);
      this.setState({ visible: false });
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
            {this.selectJob()}
          </Col>
          <Col xs={24} sm={24} md={24} lg={6} xl={6} style={{ marginBottom: 10 }}>
            <Button style={{ width: '100%' }} onClick={() => this.setState({ visible: true })}>Send Plant Verification</Button>
            <PlantVerification
              visible={this.state.visible}
              onClose={this.onClose}
              onOk={this.onOk}
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
          rowKey='id'
          size="middle" />
      </div>
    )
  }
}
