import React, { Component } from "react";
import { Select, Table, message } from "antd";
import { columns } from "./columns";
import { Client } from "fulcrum-app";
import "./index.css";

const client = new Client(process.env.REACT_APP_SECRET_KEY);

export default class IncidentRegister extends Component {
  state = {
    selectedJob: [],
    data: [],
    loading: false
  };
  componentDidMount() {
    this.tableData();
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.incidentNonConf !== this.props.incidentNonConf ||
      prevState.selectedJob !== this.state.selectedJob
    ) {
      this.tableData();
    }
  }

  selectJob() {
    let sorted = this.props.jobFiles.sort((a, b) => {
      if (a.form_values["5f36"]) {
        if (a.form_values["5f36"] < b.form_values["5f36"]) return 1;
        if (a.form_values["5f36"] > b.form_values["5f36"]) return -1;
        return 0;
      }
      return null;
    });
    return (
      <Select
        mode="multiple"
        placeholder="Select Job Number(s)"
        style={{ width: "100%", paddingBottom: 10 }}
        onChange={jobs => {
          this.setState({
            selectedJob: jobs.map(job =>
              job.substring(0, job.indexOf("p.lSS#@"))
            )
          });
        }}>
        {sorted.map(job => {
          if (job.project_id) {
            return (
              <Select.Option
                key={`${job.project_id}p.lSS#@${job.form_values["5b1c"]}`}>
                {job.form_values["5b1c"]}
              </Select.Option>
            );
          }
          return null;
        })}
      </Select>
    );
  }
  tableData() {
    let data = [];
    this.props.incidentNonConf.forEach(record => {
      if (record.form_values["800c"]) {
        if (
          record.form_values["800c"].choice_values[0] !==
          "Quality Non-Conformance"
        ) {
          const job = () => {
            let index = this.props.jobFiles.findIndex(
              job => job.project_id === record.project_id
            );
            let jobNumber =
              index > 0
                ? this.props.jobFiles[index].form_values["5f36"]
                : "none";
            return jobNumber;
          };
          const description = () => {
            let myDescription = "";
            if (record.form_values["3c19"]) {
              myDescription = record.form_values["3c19"];
            } else if (record.form_values["ebcb"]) {
              myDescription = record.form_values["ebcb"];
            }
            return myDescription;
          };
          record.job = job();
          record.description = description();
          if (this.state.selectedJob.length <= 0) {
            data.push(record);
          } else {
            if (this.state.selectedJob.indexOf(record.project_id) !== -1) {
              data.push(record);
            }
            return;
          }
        }
      }
    });
    this.setState({ data });
  }
  action = (val, type) => {
    this.setState({ loading: true });
    let data = this.state.data;
    let index = data.findIndex(item => item.id === val.id);

    if (type === "PM") {
      val["d234"] = "yes";
      val.status = "SQE Action Required";
    }
    if (type === "SQE") {
      val["6e01"] = "yes";
      val.status = "Closed Out";
    }
    data[index] = val;
    client.records
      .update(val.id, val)
      .then(resp => {
        this.setState({ data, loading: false });
        message.success("Action Submitted.");
      })
      .catch(err => {
        console.log(err);
        message.error(
          "An error occured. Please check your internet connection."
        );
        this.setState({ loading: false });
      });
  };
  render() {
    return (
      <div>
        {this.selectJob()}
        <Table
          bordered
          loading={this.state.loading}
          pagination={false}
          id="boresTableOne"
          className="boreTables tableResizer"
          columns={columns(this.action)}
          dataSource={this.state.data}
          //   rowClassName={record => record.status}
          rowKey="id"
          size="middle"
        />
      </div>
    );
  }
}
