import React, { Component } from 'react'
import { List, Avatar } from 'antd'
import { db } from '../../firebase/firebase';

export default class Chats extends Component {
  state = {
    roomId: null,
    roomList: [],
    users: {},
    newData: []
  }
  selected(value) {
    this.setState({
      roomId: value.id,
    })    
    this.props.changeRoom(value)
  }
  componentDidMount() {
    db.ref('/users')
      .once('value', (snap) => {
        this.setState({
          users: snap.val()
        })
      })
  }
  componentDidUpdate(prevProps){
    if (this.props.chatList !== prevProps.chatList) {
      this.genorateChats()
    }
  }
  genorateChats(){
    const { chatList, user } = this.props    
    var newData = [];
    for (let i = 0; i < chatList.length; i++) {
      var memberList = [];
      var notify;

      for (let k = 0; k < Object.keys(chatList[i][1].members).length; k++) {
        const member = Object.keys(chatList[i][1].members)[k];
        if (member !== user.id) {
          for (let m = 0; m < Object.keys(this.state.users).length; m++) {
            const userId = Object.keys(this.state.users)[m];
            if (member === userId) {
              memberList.push({
                username: Object.entries(this.state.users)[m][1].username,
                color: Object.entries(this.state.users)[m][1].color,
              });
            }
          }
        }
      }
      for (let a = 0; a < Object.entries(chatList[i][1].messages).length; a++) {
        const message = Object.entries(chatList[i][1].messages)[a];
        if (message[1].from !== user.id) {
          if (message[1].read === false) {
            notify = true
          } else {
            notify = false
          }
        } else {
          notify = false
        }
      }

      newData.push({
        id: chatList[i][0],
        members: memberList,
        notify
      })
    }
    this.setState({newData})
  }
  render() {
    return (
      <div>
        <List
          itemLayout="horizontal"
          dataSource={this.state.newData}
          renderItem={item => {
            
            var acronym = item.members[0].username.match(/\b(\w)/g).join('')
            if (item.notify === true) {
              var notifyCol = 'red'
            }
            if (item.id === this.state.roomId) {
              var selected = '#beeaff'
            }
              return (
                <List.Item className='roomStyle' style={{ backgroundColor: selected, border: `1px solid ${notifyCol}` }} onClick={() => this.selected(item)}>
                  <List.Item.Meta
                    avatar={
                      <Avatar style={{ margin: 'auto 15px', backgroundColor: item.members[0].color, verticalAlign: 'middle' }} >
                        {acronym}
                      </Avatar>
                    }
                    title={item.members[0].username}
                  />
                </List.Item>
              )
            } 
          }
        />
      </div>
    )
  }
}
