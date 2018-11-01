import React, { Component } from 'react'
import { List, Avatar } from 'antd'
import { db } from '../../firebase/firebase';

export default class Chats extends Component {
  state = {
    roomId: null,
    roomList: [],
    users: {}
  }
  selected(value) {
    this.setState({
      roomId: value.id
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
  render() {
    const { chatList, user, notification } = this.props
    var data = [];

    for (let i = 0; i < chatList.length; i++) {
      var memberList = [];

      for (let k = 0; k < Object.keys(chatList[i].members).length; k++) {
        const member = Object.keys(chatList[i].members)[k];
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
      data.push({
        id: chatList[i].id,
        members: memberList
      })
    }

    return (
      <div>
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => {
            var acronym = item.members[0].username.match(/\b(\w)/g).join('')
            if (item.id === notification) {
              var notify = 'red'
            }
            if (item.id === this.state.roomId) {
              var selected = '#beeaff'
            }
              return (
                <List.Item className='roomStyle' style={{ backgroundColor: selected, border: `1px solid ${notify}` }} onClick={() => this.selected(item)}>
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
