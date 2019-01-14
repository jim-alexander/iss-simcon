import React, { Component } from 'react'
import { Modal, Form, Input, Select } from 'antd'

const PlantVerification = Form.create({ name: 'Plant Verification' })(
  class extends Component {
    render() {
      const { visible, onOk, onClose, form, jobFiles } = this.props
      const { getFieldDecorator } = form;

      return (
        <Modal
          visible={visible}
          title="Send Plant Verification to Client"
          okText="Send"
          onCancel={onClose}
          onOk={onOk}
        >
          <Form layout="vertical">
            <Form.Item label="Job">
              {getFieldDecorator('job')(
                <Select
                  placeholder="Select Job Number(s)"
                  style={{ width: '100%', paddingBottom: 10 }}
                  onChange={(job) => { this.setState({ selectedJob: job }) }}>
                  {jobFiles.map(job => {
                    let title = (job.form_values["7af6"]) ? ` - ${job.form_values["7af6"]}` : '';
                    return (<Select.Option key={job.project_id}>{job.form_values["5b1c"] + title}</Select.Option>)
                  })}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Email">
              {getFieldDecorator('email', {
                rules: [{ required: true, message: 'Please input the email of recipent' }],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="Message">
              {getFieldDecorator('message')(<Input type="textarea" />)}
            </Form.Item>

          </Form>
        </Modal>
      )
    }
  }
)
export default PlantVerification
