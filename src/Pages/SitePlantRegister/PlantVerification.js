import React, { Component } from 'react'
import {Modal, Form, Input} from 'antd'

const PlantVerification = Form.create({name: 'Plant Verification'})(
  class extends Component {
    render() {
      const {visible, onOk, onClose, form} = this.props
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
