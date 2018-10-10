import React from 'react'
import { Input, Select } from 'antd'
import { Client } from 'fulcrum-app'

const Search = Input.Search;

const client = new Client(process.env.REACT_APP_SECRET_KEY)

class Outline extends React.Component {
  constructor() {
    super();
    this.state = {
      currentRecord: null,
      loadedComments: null,
    };
    this.setRecord = this.setRecord.bind(this);

  }
  setRecord(value) {
    for (let i = 0; i < this.props.SimpconTest.length; i++) {
      if (this.props.SimpconTest[i].id === value) {
        this.setState({
          currentRecord: this.props.SimpconTest[i],
          loadedComments: this.props.SimpconTest[i].form_values['0bd7']
        });
      }
    }
  }
  updateRecordComments(value, original) {
    if (value === '') {
      console.log("there is no comments to save.");

    } else {
      var record = original;
      record.form_values['0bd7'] = value;

      fulcrumRecordUpdate(record.id, record);

      function fulcrumRecordUpdate(id, obj) {

        console.log(id, obj);
        client.records.update(id, obj)
          .then((webhook) => {
            console.log('success', webhook);
          })
          .catch((error) => {
            console.log(error.message);
          });

      }
    }
  }
 
  recordList() {
    return  (
      <Select showSearch placeholder="Select job title" size="large" style={{ width: '100%', paddingBottom: 10 }} onChange={this.setRecord}>
        {this.props.SimpconTest.map((x) => <Select.Option key={x.id} >{x.form_values['9cd4']}</Select.Option>)}
      </Select>
    )    
  }

  render() {
    return (
      <div>
        <h1>Comments</h1>
          {this.recordList()}
        <Search
          placeholder="Input Comments here."
          enterButton="Save"
          defaultValue={this.state.loadedComments}
          size="large"
          onSearch={value => this.updateRecordComments(value, this.state.currentRecord)}
        />

      </div>
    )
  }
}

export default Outline;