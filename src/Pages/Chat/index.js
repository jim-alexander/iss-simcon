import React, { Component } from 'react'
import { db } from '../../firebase/firebase';
import { Input, Button, Row, Col } from 'antd'
import Chats from './Chats'
import Messages from './Messages'
import moment from 'moment'

import './index.css'

export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      chats: [],
      selectedChat: null,
      messages: [],
      messageField: null,
    };
    this.onAddMessage = this.onAddMessage.bind(this);
    this.changeRoom = this.changeRoom.bind(this);
  }
  componentWillMount() {
    var userId = '13nBwfjw44ZOM76bEFrnXsyy1ij1'
    //load chats
    const messagesRef = db.ref("chats").orderByChild(`members/${userId}`).equalTo(true)

    messagesRef.on('child_added', snapshot => {
      var chat = {
        id: snapshot.key,
        members: snapshot.val().members
      }
      this.setState(prevState => ({
        chats: [chat, ...prevState.chats],
      }));
    });
  }
  onAddMessage(event) {
    event.preventDefault();
    var obj = {
      content: this.input.value,
      date: 'some date value',
      from: this.props.user.id,
      read: false
    }
    db.ref(`/chats/${this.state.selectedChat}/messages`).push(obj);
    this.input.value = '';
  }
  changeRoom(value) {
    this.setState({
      selectedChat: value.id,
      messageField: null
    })
    this.getChatMessages(value.id)
  }
  getChatMessages(roomId) {
    this.setState({ messages: [] })
    const msgRef = db.ref(`/chats/${roomId}/messages`).orderByChild('date');
    msgRef.off();
    msgRef.on('child_added', snapshot => {
      this.setState(prevState => ({
        messages: [...prevState.messages, snapshot.val()],
      }));
    });
  }
  submitMessage() {

    var msgObj = {
      content: this.state.messageField,
      date: moment().format('DD-MM-YYYY HH:mm:ss.SSS'),
      from: this.props.user.id,
      read: false
    }
    if (this.state.selectedChat !== null) {
      db.ref(`/chats/${this.state.selectedChat}/messages/`)
        .push({
          from: msgObj.from,
          date: msgObj.date,
          content: msgObj.content,
          read: msgObj.read
        })
        .then(() => this.setState({ messageField: null }))
    }
  }
  render() {
    return (
      <div>
        <Row gutter={10}>
          <Col span={6}>
            <div style={{ borderRadius: 4, width: ' 100%', minHeight: '80vh', marginBottom: 20 }}>
              <p className='chatTitle'>Messages</p>
              <Chats changeRoom={this.changeRoom} chatList={this.state.chats} />
            </div>
          </Col>
          <Col span={18}>
            <p className='chatTitle'></p>
            <div style={{ background: '#f4f2f3', borderRadius: 4, width: ' 100%', minHeight: '80vh', marginBottom: 20 }}>
              <Messages data={this.state.messages} id={this.props.user.id} />
            </div>
          </Col>
        </Row>

        <Row gutter={10}>
          <Col span={6}>
            <Button type="primary" ghost style={{ width: '100%' }}>New conversation</Button>
            {/* <CreateConversation
							wrappedComponentRef={this.saveFormRef}
							visible={this.state.createRoomVisible}
							onCancel={() => this.handleCancel()}
							onCreate={this.handleCreate}
							selectedRange={this.state.selectedRange}
						/> */}
          </Col>
          <Col span={18}>
            <Row gutter={10}>
              <Col span={20}>
                <Input placeholder="Type message here"
                 value={this.state.messageField} 
                 onPressEnter={() => this.submitMessage()} 
                 onChange={(evt) => this.setState({ messageField: evt.target.value })} 
                 style={{ width: '100%' }} />
              </Col>
              <Col span={4}>
                <Button type="primary" onClick={() => this.submitMessage()} style={{ width: '100%' }}>➤</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    )
  }
}
