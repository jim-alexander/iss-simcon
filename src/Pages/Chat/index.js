import React, { Component } from 'react'
import { db } from '../../firebase/firebase';
import { Input, Button, Row, Col } from 'antd'
import Chats from './Chats'
import Messages from './Messages'
import CreateConversation from './CreateConversation'
import moment from 'moment'

import './index.css'

export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      chats: [],
      selectedChat: {
        id: null,
        member: 'Select a message'
      },
      messages: [],
      messageField: null,
      createConversationVisible: false,
      messageInputVisibility: true
    };
    this.onAddMessage = this.onAddMessage.bind(this);
    this.changeRoom = this.changeRoom.bind(this);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.chats !== this.props.chats) {
      this.setState({
        chats: Object.entries(this.props.chats)
      }, () => this.getChatMessages(this.state.selectedChat.id))
    }
  }
  componentDidMount(){
    this.getChatMessages(this.state.selectedChat.id)
  }
  onAddMessage(event) {
    event.preventDefault();
    var obj = {
      content: this.input.value,
      date: 'some date value',
      from: this.props.user.id,
      read: false
    }
    db.ref(`/chats/${this.state.selectedChat.id}/messages`).push(obj);
    this.input.value = '';
  }
  changeRoom(value) {
    this.setState({
      selectedChat: {
        id: value.id,
        member: value.members[0].username
      },
      messageField: null,
      messageInputVisibility: false,
      messages: []
    }, () => this.getChatMessages(value.id))
  }
  getChatMessages(roomId) {
      if (this.state.selectedChat.id !== null) {
      if (this.props.chats) {          
        this.setState({
          messages: Object.entries(this.props.chats[roomId].messages)
        })        
      }
    }
  }
  submitMessage() {
    var msgObj = {
      content: this.state.messageField,
      date: moment().format(),
      from: this.props.user.id,
      fromName: this.props.user.username,
      read: false
    }
    if (this.state.selectedChat.id !== null) {
      db.ref(`/chats/${this.state.selectedChat.id}/messages/`)
        .push(msgObj)
        .then(() => this.setState({ messageField: null }))
    }
  }
  showModal = () => {
    this.setState({
      createConversationVisible: true
    });
  }
  createChat = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) { return }
      const myId = this.props.user.id;
      const myName = this.props.user.username;
      var memberObj;
      Object.entries(values.members).forEach(member => {
        memberObj = Object.assign({}, memberObj, {
          [member[1]]: true
        })
      })
      memberObj = Object.assign({}, memberObj, {
        [myId]: true
      })

      var obj = {
        members: memberObj
      }
      var messageObj = {
        content: values.message,
        date: moment().format(),
        from: myId,
        fromName: myName,
        read: false
      }

      db.ref('/chats/').push(obj).child('messages').push(messageObj)

      form.resetFields();
      this.setState({ createConversationVisible: false });
    })
  }
  handleCancel = () => {
    this.setState({
      createConversationVisible: false
    });
  }
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }
  render() {
    return (
      <div>
        <Row gutter={10}>
          <Col span={6}>
            <div style={{ borderRadius: 4, width: ' 100%', minHeight: '600px', marginBottom: 20 }}>
              <p className='chatTitle'>Messages</p>
              <Chats changeRoom={this.changeRoom} chatList={this.state.chats} user={this.props.user} notification={this.props.notification} />
            </div>
          </Col>
          <Col span={18}>
            <p className='chatTitle'>{this.state.selectedChat.member} </p>
            <div style={{ background: '#f4f2f3', borderRadius: 4, width: ' 100%', minHeight: '600px', marginBottom: 20 }}>
              <Messages data={this.state.messages} user={this.props.user} chatId={this.state.selectedChat.id}/>
            </div>
          </Col>
        </Row>

        <Row gutter={10}>
          <Col span={6}>
            <Button type="primary" onClick={() => this.showModal()} ghost style={{ width: '100%' }}>New conversation</Button>
            <CreateConversation
              wrappedComponentRef={this.saveFormRef}
              visible={this.state.createConversationVisible}
              onCancel={() => this.handleCancel()}
              onCreate={this.createChat}
              id={this.props.user.id}
            />
          </Col>
          <Col span={18}>
            <Row gutter={10}>
              <Col span={20}>
                <Input placeholder="Type message here"
                  value={this.state.messageField}
                  autosize='true'
                  disabled={this.state.messageInputVisibility}
                  onPressEnter={() => this.submitMessage()}
                  onChange={(evt) => this.setState({ messageField: evt.target.value })}
                  style={{ width: '100%' }} />
              </Col>
              <Col span={4}>
                <Button
                  type="primary"
                  onClick={() => this.submitMessage()}
                  disabled={this.state.messageInputVisibility}
                  style={{ width: '100%' }}>➤</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    )
  }
}
