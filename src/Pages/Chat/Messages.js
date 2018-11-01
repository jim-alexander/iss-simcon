import React, { Component } from 'react'
import { List, Avatar } from 'antd'
import moment from 'moment'
import { db } from '../../firebase/firebase';

export default class Messages extends Component {
  state = {
    users: {}
  }
  scrollToBottom() {
    this.el.scrollIntoView({ block: 'end', behavior: 'instant' });
  }
  componentDidMount() {
    this.scrollToBottom();
    db.ref('/users')
      .once('value', (snap) => {
        this.setState({
          users: snap.val()
        })
      })
  }
  componentDidUpdate() {
    this.scrollToBottom();
  }
  render() {
    const { data } = this.props;
    var dataNew = [];

    for (let i = 0; i < data.length; i++) {
      const message = data[i];
      for (let k = 0; k < Object.keys(this.state.users).length; k++) {
        const user = Object.keys(this.state.users)[k];
        if (message.from === user) {
          var userColor = Object.entries(this.state.users)[k][1].color
        }
      }
      dataNew.push({message, userColor})
    }

    return (
      <div id='msgScroller' style={{maxHeight: '80vh', overflow: 'auto' }} >
        <List
          itemLayout="horizontal"
          dataSource={dataNew}
          renderItem={item => {
            if (moment().diff(moment(item.message.date), 'days') < 1) {
              var date = moment(item.message.date).format("hh:mm")
            } else {
              date = moment(item.message.date).format("DD-MM-YYYY hh:mm")
            }
            var acronym = item.message.fromName.match(/\b(\w)/g).join('')
                       
            if (item.message.from === this.props.user.id) {
              return (
                <List.Item style={{ border: 'none', textAlign: 'right', paddingRight: '70px' }}>
                  <List.Item.Meta
                    avatar={
                    <Avatar id='avatar' style={{ backgroundColor: item.userColor, verticalAlign: 'middle', margin: '8px 15px', position: 'absolute', right: 0 }}>
                      {acronym}
                    </Avatar>
                    }
                    title={date}
                    description={item.message.content}
                  />
                </List.Item>
              )
            } else {
              return (
                <List.Item style={{ border: 'none' }}>
                  <List.Item.Meta
                    avatar={
                      <Avatar id='avatar' style={{ backgroundColor: item.userColor, verticalAlign: 'middle', margin: '8px 15px' }}>
                      {acronym}
                      </Avatar>
                    }
                    title={date}
                    description={item.message.content}
                  />
                </List.Item>
              )
            }
          }}
        >
          <List.Item style={{ border: 'none', height: '0px', padding: 0 }}>
            <div style={{ float: "left", clear: "both" }}
              ref={(el) => { this.el = el; }}>
            </div>
          </List.Item>
        </List>

      </div>
    )
  }
}
