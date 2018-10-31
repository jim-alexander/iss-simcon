import React, { Component } from 'react'
import { List, Avatar } from 'antd'

export default class Messages extends Component {
  scrollToBottom() {
    this.el.scrollIntoView({ block: 'end', behavior: 'instant' });
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    const { data } = this.props

    return (
      <div style={{maxHeight: '80vh', overflow: 'auto' }} >
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => {
            if (item.from === this.props.id) {
              return (
                <List.Item style={{ border: 'none', textAlign: 'right', paddingRight: '70px' }}>
                  <List.Item.Meta
                    avatar={<Avatar id='avatar' style={{
                      margin: 'auto 15px', position: 'absolute',
                      right: 0
                    }} />}
                    title={item.date}
                    description={item.content}
                  />
                </List.Item>
              )
            } else {
              return (
                <List.Item style={{ border: 'none' }}>
                  <List.Item.Meta
                    avatar={<Avatar id='avatar' style={{ margin: 'auto 15px' }} />}
                    title={item.date}
                    description={item.content}
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
