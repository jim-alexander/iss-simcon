import React, { Component } from 'react'
import { Client } from 'fulcrum-app'
import { Button } from 'antd'

const client = new Client(process.env.REACT_APP_SECRET_KEY)

export default class Job extends Component {
  state = {
    visible: false
  }
  findJob(){
    client.projects.all()
    .then(resp => {
      console.log(resp.objects);
      
    })
  }
  render() {
    return (this.props.user.id === '13nBwfjw44ZOM76bEFrnXsyy1ij1') ? (
      <div>
        <h1>Jobs</h1>
        <Button onClick={() => this.findJob()}>Find Job</Button>
        
      </div>
    ) : null
  }
}
