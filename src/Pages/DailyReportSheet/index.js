import React from 'react'
import { Select, Table, Alert, Row, Col, DatePicker } from 'antd'
import './index.css'
import * as column from './columns'
import * as data from '../../constants/SimpsonData'
import { db } from '../../firebase'

const Option = Select.Option;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedBore: ''
    };
    this.handleBoreSelect = this.handleBoreSelect.bind(this);
  }

  handleBoreSelect(evt) {
    this.setState({ selectedBore: evt });
  }
  componentDidMount() {
    db.lastViewedPage(this.props.user.id, 'home')
  }
  componentDidUpdate() {
    db.lastViewedPage(this.props.user.id, 'home')
  }

  selectJob() {
    return (
      <Select showSearch placeholder="Select a job Number" style={{ width: '100%', paddingBottom: 10 }} onChange={this.handleBoreSelect}>
        <Option key='one'>1823</Option>
        <Option key='two'>1234</Option>
        <Option key='three'>185523</Option>
      </Select>
    )
  }
  selectDate() {
    return <DatePicker style={{ width: '100%' }} />
  }
  alertStatus(status, statusMessage) {
    if (status !== null) {
      return <Alert message={statusMessage} type={status} />
    }
  }

  render() {
    return (
      <div>
        <div style={{ paddingBottom: 10 }}>
          <Row>
            <Col span={16} style={{ paddingRight: 5 }}>
              {this.selectJob()}
            </Col>
            <Col span={8} style={{ paddingLeft: 5 }}>
              {this.selectDate()}
            </Col>
          </Row>
        </div>
        <div className='boresPadding'>
          <Table
            pagination={false}
            bordered
            id='boresTableOne'
            className='boreTables tableResizer dailyReportTables'
            columns={column.jobDetails}
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
            className='boreTables tableResizer dailyReportTables'
            columns={column.timesheet}
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
            id='boresTableThree'
            className='boreTables tableResizer dailyReportTables'
            columns={column.timesheet}
            dataSource={data.SimpsonDataThree}
            rowKey='id'
            size="small" />
        </div>
        <div className='boresPadding'>
          <Row gutter={10}>
            <Col span={8}>
              <Table
                pagination={false}
                title={() => 'Company Plant'}
                bordered
                id='boresTableFour'
                className='boreTables tableResizer dailyReportTables'
                columns={column.companyPlant}
                dataSource={data.SimpsonDataFour}
                rowKey='id'
                size="small" />
            </Col>
            <Col span={16}>
              <Table
                pagination={false}
                title={() => 'Hired Plant'}
                bordered
                id='boresTableFive'
                className='boreTables tableResizer dailyReportTables'
                columns={column.hiredPlant}
                dataSource={data.SimpsonDataFour}
                rowKey='id'
                size="small" />
            </Col>
          </Row>
        </div>
        <div className='boresPadding'>
          <Row gutter={10}>
            <Col span={8}>
              <Table
                pagination={false}
                title={() => 'Delivary Dockets Received'}
                bordered
                id='boresTableSix'
                className='boreTables tableResizer dailyReportTables'
                columns={column.docketsReceived}
                dataSource={data.SimpsonDataFive}
                rowKey='id'
                size="small" />
            </Col>
            <Col span={16}>
              <Table
                pagination={false}
                title={() => 'Materials Delivered'}
                bordered
                id='boresTableSeven'
                className='boreTables tableResizer dailyReportTables'
                columns={column.materialsReceived}
                dataSource={data.SimpsonDataFive}
                rowKey='id'
                size="small" />
            </Col>
          </Row>
        </div>
        <div className="boresPadding">
          <Table
            pagination={false}
            title={() => 'SQE Stats'}
            bordered
            id='boresTableSeven'
            className='boreTables tableResizer dailyReportTables'
            columns={column.sqeStats}
            dataSource={data.SimpsonDataFive}
            rowKey='id'
            size="small" /></div>
      </div>
    );
  }
}

export default Home;
