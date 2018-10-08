import React from 'react'
import { Select, Table, Alert, Row, Col, DatePicker } from 'antd'
import './index.css'
import * as column from '../constants/columns'
import * as data from '../constants/SimpsonData'

const Option = Select.Option;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedBore: ''
    };
    this.handleBoreSelect = this.handleBoreSelect.bind(this);
  }

  handleBoreSelect (evt) {
    this.setState({ selectedBore: evt });
  }
  async componentDidMount(){
  }
  async componentWillMount(){
  }

  selectJob() {
      return  <Select showSearch placeholder="Select a job Number" style={{ width: '100%', paddingBottom: 10 }} onChange={this.handleBoreSelect}>
                <Option key='one'>1823</Option>
                <Option key='two'>1234</Option>
                <Option key='three'>185523</Option>
              </Select>
  }
  selectDate() {
    return <DatePicker style={{width: '100%'}} />
  }
  alertStatus(status, statusMessage) {
    if (status !== null) {
      return  <Alert message={statusMessage} type={status} />
    }
  }

  render(){
    return(
    <div>
      <h1>Daily Report Sheet</h1>
      <div style={{paddingBottom: 10}}>
        <Row>
          <Col span={16} style={{paddingRight: 5}}>
            {this.selectJob()}
          </Col>
          <Col span={8} style={{paddingLeft: 5}}>
            {this.selectDate()}
          </Col>
        </Row>
      </div>
        <div className='boresPadding'>
          <Table
            pagination={false}
            bordered
            id='boresTableOne'
            className='boreTables tableResizer'
            columns={column.columnsOne}
            dataSource={data.SimpsonDataOne}
            rowKey='id'
            size="middle" />
        </div>
        <div className='boresPadding'>
          <Table
            pagination={false}
            title={() => 'Company Personnel'}
            footer={() => 'Total: 9:54'}
            bordered
            id='boresTableTwo'
            className='boreTables tableResizer'
            columns={column.dailyReportTimesheet}
            dataSource={data.SimpsonDataTwo}
            rowKey='id'
            size="small" />
        </div>
        <div className='boresPadding'>
          <Table
            pagination={false}
            title={() => 'Sub Contractors'}
            footer={() => 'Total: 2:26'}
            bordered
            id='boresTableTwo'
            className='boreTables tableResizer'
            columns={column.dailyReportTimesheet}
            dataSource={data.SimpsonDataThree}
            rowKey='id'
            size="small" />
        </div>
        <div className='boresPadding'>
          <Table
            pagination={false}
            title={() => 'Company Plant'}
            bordered
            id='boresTableTwo'
            className='boreTables tableResizer'
            columns={column.dailyReportPlant}
            dataSource={data.SimpsonDataFour}
            rowKey='id'
            size="small" />
        </div>
        <div className='boresPadding'>
          <Table
            pagination={false}
            title={() => 'Delivary Dockets Received'}
            bordered
            id='boresTableTwo'
            className='boreTables tableResizer'
            columns={column.dailyReportDockets}
            dataSource={data.SimpsonDataFive}
            rowKey='id'
            size="small" />
        </div>
    </div>
    );
  }
}

export default Home;
