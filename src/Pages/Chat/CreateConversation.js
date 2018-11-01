import React from 'react'
import { Modal, Form, Input, Select } from 'antd'

import { db } from '../../firebase/firebase';

const FormItem = Form.Item;
const Option = Select.Option;

const CreateConversation = Form.create()(
  class extends React.Component {
    state = {
      users: {}
    }
    componentDidMount() {
      db.ref('/users')
        .once('value', (snap) => {
          this.setState({
            users: snap.val()
          })
        })
    }
    render() {

      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Modal
          visible={visible}
          title="Create a new room"
          okText="Send"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <FormItem label="To" style={{ marginBottom: 0 }}>
              {getFieldDecorator('members')(
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="Please select member(s) of this conversation"
                >
                  {Object.entries(this.state.users).map(user => {
                    if (user[0] === this.props.id) {
                      return null
                    } else {
                      return <Option key={user[0]}>{user[1].username}</Option>
                    }
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem label="Message" style={{ marginBottom: 0 }}>
              {getFieldDecorator('message')(
                <Input />
              )}
            </FormItem>

          </Form>
        </Modal>
      );
    }
  }
);

export default CreateConversation