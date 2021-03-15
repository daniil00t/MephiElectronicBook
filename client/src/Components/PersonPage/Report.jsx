import React from 'react';
import { Table, ButtonGroup, ToggleButton } from 'react-bootstrap';
import Cookies from "js-cookie";
import EventEmmiter from "../../EventEmmiter.js";
import { 
	getReport, 
	setReport } from "../../api.js";

import "../../styles/tables.css";
import * as CONFIG from "../../config.json";

export default class Report extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			getRequest: {
				nameGroup: "",
				nameTeacher: "",
				nameSubject: "",
				durationSubject: "",
				typeReport: ""
			},
			table: {
				group: "",
				name: "",
				thead: [],
				meta: {},
				data: [[]]
			}
		};
		this.emmiter = this.props.emmiter;
		this.listen = this.listen.bind(this);
		this.listen();
	}
	isValidGetRequest(){
		let access = false;
		let req = this.state.getRequest;
		if(typeof req.nameTeacher !== "undefined" && req.nameTeacher != "" &&
				typeof req.nameGroup !== "undefined" && req.nameGroup != "" &&
				typeof req.nameSubject !== "undefined" && req.nameSubject != "" &&
				typeof req.durationSubject !== "undefined" && req.durationSubject != "" &&
				typeof req.typeReport !== "undefined" && req.typeReport != "") 
		{
			access = true
		}
		return access;
	}
	getReportWithAccess(){
		if(this.isValidGetRequest()){
			getReport(this.state.getRequest, data => {
				this.setState({table: data});
			}, err => {
				console.error(err);
			})
		}
	}
	concatObject(baseObject, appendObject){
		return Object.assign({}, baseObject, appendObject);
	}
	listen(){
		this.emmiter.on("changeTypeTable", data => {
			this.setState({getRequest: this.concatObject(this.state.getRequest, {typeReport: CONFIG.TYPES_REPORTS[data.data].alias})});
			this.getReportWithAccess();
		});
	}
	componentDidMount(){
		// console.log("THIS: ", Object.keys(this.props.state));
		this.setState({
			getRequest: {
				nameTeacher: this.props.state.name,
				typeReport: this.props.state.activeTypeTable,
			}
		});
		this.getReportWithAccess();
		// request to server, but now used object
		// this.setState({table: table});
	}

	toggleTypeTable(type){
		this.props.changeState({activeTypeTable: type})
		this.setState({getRequest: this.concatObject(this.state.getRequest, {typeReport: CONFIG.TYPES_REPORTS[type].alias})});
		this.getReportWithAccess();
	}
	replaceChar(el){
		if(el === true){
			return "+";
		}else if(el === false){
			return "-";
		}
		else{
			return el;
		}
	}
	changeSubject(e, props){
		let subject = props.subjects[+e.target.value];
		this.setState({getRequest: this.concatObject(this.state.getRequest, {nameSubject: subject, durationSubject: this.props.state.durations[+e.target.value]})});
		this.getReportWithAccess();
	}
	changeGroup(e, props){
		// this is correct, but have some problems on server
		let group = props.groups[+e.target.value];
		// let group = props.groups[+e.target.value][0];
		this.setState({getRequest: this.concatObject(this.state.getRequest, {nameGroup: group})});
		this.getReportWithAccess();
	}
	PanelTable(props){
		const radios = [
	    { name: 'Посещаемость', value: 0 },
	    { name: 'Оценки', value: 1 },
	    { name: 'Итоги', value: 2 }
	  ];
		return (
			<div className="panelHeadTable">
				<div className="tableWrap">
					<select onChange={e => props.self.changeGroup(e, props)} className="form-control groups">
						<option value={-1}>Choose group</option>
						{
							props.groups.map((el, index) => 
								index == props.group ?
								<option selected value={index}>{el}</option> :
								<option value={index}>{el}</option>
							)
						}
					</select>
					<select onChange={e => props.self.changeSubject(e, props)} className="form-control subjects">
						<option value={-1}>Choose subject</option>
						{
							props.subjects.map((el, index) => 
								index == props.subject ?
								<option selected value={index}>{el}</option> :
								<option value={index}>{el}</option>
							)
						}
					</select>
					<span>{props.type}</span>
					
		      <ButtonGroup toggle>
		        {radios.map((radio, idx) => (
		          <ToggleButton
								variant="light"
		            key={idx}
		            type="radio"
		            name="radio"
		            value={radio.value}
		            checked={props.state.activeTypeTable === radio.value}
		            onChange={(e) => props.self.toggleTypeTable(+e.currentTarget.value)}
		          >
		            {radio.name}
		          </ToggleButton>
		        ))}
		      </ButtonGroup>
		      </div>
	    </div>
		);
	}
	handleClick(){
		setReport(this.state.table, (data) => console.log(data));
	}
	render() {
		// console.log(this.getDates("03.03.21", [0, 1, 0, 0, 1, 1], 20));
		console.log(this.props.state);
		return (
			<div className="table-wrap">
				<div className="TABLE">
					<this.PanelTable
						self={this}
						state={this.props.state}
						name={this.props.state.name}
						groups={this.props.state.groups}
						subjects={this.props.state.subjects}
						group={this.props.state.activeGroupId}
						subject={this.props.state.activeSubjectId}
					/>
					<Table striped bordered hover variant="dark">
					  <thead>
					    <tr>
					    	{
					    		this.state.table.thead.map(el => <th>{el}</th>)
					    	}
					    </tr>
					  </thead>
					  <tbody>
						  {
						  	this.state.table.data.map(row => 
						  		<tr>
							  		{
							  			row.map(el => <td>{this.replaceChar(el)}</td>)
							  		}
						  		</tr>
						  	)
						  }
					  </tbody>
					</Table>
					<button onClick={e => this.handleClick(e)}>Click!</button>
				</div>
			</div>
		);
	}
}
