import React, { Component } from 'react'
import { List, Avatar } from 'antd'

export default class Chats extends Component {
  state = {
    roomId: null,
    roomList: []
  }
  selected(value) {
    this.setState({
      roomId: value.id
    })
    this.props.changeRoom(value)
  }
  render() {
    const { chatList } = this.props 
        
    return (
      <div>
        <List
          itemLayout="horizontal"
          dataSource={chatList}
          renderItem={item => {                        
            if (item.id === this.state.roomId) {
              return (
                <List.Item className='roomStyle' style={{ backgroundColor: '#e6f7ff' }} onClick={() => this.selected(item)}>
                  <List.Item.Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" style={{ margin: 'auto 10px' }} />}
                    title={item.id}
                  />
                </List.Item>
              )
            } else {
              return (
                <List.Item className='roomStyle' onClick={() => this.selected(item)}>
                  <List.Item.Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" style={{ margin: 'auto 10px' }} />}
                    title={item.id}
                  />
                </List.Item>
              )
            }
          }}
        />
      </div>
    )
  }
}
