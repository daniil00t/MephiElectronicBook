import React from 'react';
import { ButtonGroup, ToggleButton, Table } from "react-bootstrap";
import { 
	getReport, 
	setReport } from "../../api.js";

import "../../styles/tables.css";
import * as CONFIG from "../../config.json";

export default class Report extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			// Request
			nameGroup: "",
			nameTeacher: "",
			nameSubject: "",
			durationSubject: "",
			typeReport: "",
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
	isValidGetRequest(req){
		let access = false;
		console.log(req);
		if(typeof req.nameTeacher 			!== "undefined" && req.nameTeacher 		!= "" &&
				typeof req.nameGroup 		!== "undefined" && req.nameGroup 		!= "" &&
				typeof req.nameSubject 		!== "undefined" && req.nameSubject 		!= "" &&
				typeof req.durationSubject 	!== "undefined" && req.durationSubject 	!= "" &&
				typeof req.typeReport 		!== "undefined" && req.typeReport 		!= "") 
		{
			access = true;
		}
		return access;
	}
	getReportWithAccess(updateObject){
		if(this.isValidGetRequest(this.updateObject(this.state, updateObject))){
			console.log("access");
			getReport(this.updateObject({
				nameGroup: this.state.nameGroup,
				nameTeacher: this.state.nameTeacher,
				nameSubject: this.state.nameSubject,
				durationSubject: this.state.durationSubject,
				typeReport: this.state.typeReport
			}, updateObject), data => {
				this.setState({table: data});
			}, err => {
				console.error(err);
			})
		}
	}
	updateObject(baseObject, appendObject){
		return Object.assign({}, baseObject, appendObject);
	}
	listen(){
		this.emmiter.on("changeTypeTable", data => {
			this.setState({typeReport: CONFIG.TYPES_REPORTS[data.data].alias});
			this.getReportWithAccess({typeReport: CONFIG.TYPES_REPORTS[data.data].alias});
		});
	}
	componentDidMount(){
		this.setState({nameTeacher: this.props.name});
		this.getReportWithAccess({nameTeacher: this.props.name});
	}

	toggleTypeTable(type){
		this.setState({typeReport: CONFIG.TYPES_REPORTS[type].alias});
		this.getReportWithAccess({typeReport: CONFIG.TYPES_REPORTS[type].alias});
	}
	replaceChar(el){
		if(el === true) return "+";
		else if(el === false) return "-";
		else return el;
	}
	changeSubject(e){
		let subject = this.props.compactSchedule.subjects[+e.target.value];
		let duration = this.props.compactSchedule.durations[+e.target.value];
		this.setState({
			nameSubject: subject, 
			durationSubject: duration
		});
		this.getReportWithAccess({
			nameSubject: subject, 
			durationSubject: duration
		});
	}
	changeGroup(e){
		let group = this.props.compactSchedule.groups[+e.target.value];
		this.setState({nameGroup: group});
		this.getReportWithAccess({nameGroup: group});
	}
	PanelTable(props){

		return (
			<div className="panelHeadTable">
				<div className="tableWrap">
					<select onChange={e => props.self.changeSubject(e)} className="form-control subjects">
						<option value={-1}>Choose subject</option>
						{
							props.subjects.map((el, index) => 
								index == props.self.nameSubject ?
								<option selected value={index}>{el}</option> :
								<option value={index}>{el}</option>
							)
						}
					</select>
					<select onChange={e => props.self.changeGroup(e)} className="form-control groups">
						<option value={-1}>Choose group</option>
						{
							props.groups.map((el, index) => 
								index == props.self.nameGroup ?
								<option selected value={index}>{el}</option> :
								<option value={index}>{el}</option>
							)
						}
					</select>
					<ButtonGroup toggle>
		        {CONFIG.TYPES_REPORTS.map((radio, idx) => (
		          <ToggleButton
								variant="light"
		            key={idx}
		            type="radio"
		            name="radio"
		            value={radio.id}
		            checked={props.self.state.typeReport === radio.id}
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
		this.getReportWithAccess();
	}
	render() {
		// console.log(this.getDates("03.03.21", [0, 1, 0, 0, 1, 1], 20));
		// console.log(this.props.state);
		// this.getReportWithAccess({});
		return (
			<div className="table-wrap">
				<div className="TABLE">
					<this.PanelTable
						self={this}
						name={this.props.name}
						groups={this.props.compactSchedule.groups}
						subjects={this.props.compactSchedule.subjects}
					/>
					<Table striped bordered hover>
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