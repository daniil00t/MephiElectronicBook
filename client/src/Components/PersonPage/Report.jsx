import React from 'react';
import { ButtonGroup, ToggleButton, Table } from "react-bootstrap";
import { 
	getReport, 
	setReport } from "../../api.js";

import "../../styles/Report.css";
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
			typeSubject: "",
			// Schedule
			table: {
				group: "",
				name: "",
				thead: [],
				meta: {},
				data: [[]]
			},
			// state for items table
			stateEdit: false
		};
		this.emmiter = this.props.emmiter;
		this.listen = this.listen.bind(this);
		this.listen();
	}
	isValidGetRequest(req){
		let access = false;
		console.log(req);
		if(typeof req.nameTeacher 				!== "undefined" && req.nameTeacher 			!= "" &&
				typeof req.nameGroup 			!== "undefined" && req.nameGroup 			!= "" &&
				typeof req.nameSubject 			!== "undefined" && req.nameSubject 			!= "" &&
				typeof req.durationSubject 	!== "undefined" && req.durationSubject 	!= "" &&
				typeof req.typeReport 			!== "undefined" && req.typeReport 			!= ""
		){
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
			this.setState({typeReport: data.data});
			this.getReportWithAccess({typeReport: data.data});
		});
	}
	componentDidMount(){
		this.setState({nameTeacher: this.props.name});
		this.getReportWithAccess({nameTeacher: this.props.name});
	}

	toggleTypeTable(type){
		this.setState({typeReport: type});
		this.getReportWithAccess({typeReport: type});
	}
	replaceChar(el){
		if(el === true) return "+";
		else if(el === false) return "-";
		else return el;
	}
	changeSubject(e){
		let subject = this.props.subjects[+e.target.value];
		let duration = this.props.durations[+e.target.value];
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
		let group = this.props.groups[+e.target.value];
		this.setState({nameGroup: group});
		this.getReportWithAccess({nameGroup: group});
	}
	changeType(e){
		this.setState({typeSubject: e.target.value});
		this.getReportWithAccess({typeSubject: e.target.value});
	}
	PanelTable(props){
		let groups 	= [];
		let types 	= [];
		let names = props.compactSchedule.reduce((acc, cur) => {
			return [...acc, cur.name];
		}, []);
		let TYPES = props.compactSchedule.reduce((acc, cur) => {
			return [...acc, cur.types];
		}, []);
		let indexName = names.indexOf(props.self.state.nameSubject);
		if(props.self.state.nameSubject != "" ){
			groups = props.compactSchedule[indexName].groups;
			types = props.compactSchedule[indexName].types;
		}
		return (
			<div className="panelHeadTable">
				<div className="tableWrap">
					<select onChange={e => props.self.changeSubject(e)} className="form-control subjects">
						<option value={-1}>Choose subject</option>
						{
							names.map((el, index) => 
								index == props.self.nameSubject ?
								<option selected value={index}>{`${el} [${TYPES[index]}]`}</option> :
								<option value={index}>{`${el} [${TYPES[index]}]`}</option>
							)
						}
					</select>
					<select onChange={e => props.self.changeType(e)} className="form-control types" style={{display: types.length > 1 ? "block" : "none"}}>
						<option value={undefined}>Choose type</option>
						{
							types.map((type, index) => <option value={type}>{type}</option>)
						}
					</select>
					<select onChange={e => props.self.changeGroup(e)} className="form-control groups">
						<option value={-1}>Choose group</option>
						{
							groups.map((el, index) => 
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
		            value={radio.alias}
		            checked={props.self.state.typeReport === radio.alias}
		            onChange={(e) => props.self.toggleTypeTable(e.currentTarget.value)}
		          >
		            {radio.name}
		          </ToggleButton>
		        ))}
		      </ButtonGroup>
		    </div>
	    </div>
		);
	}

	ItemTable(props){
		let stateItem = props.self.state.stateEdit;
		let inverseState = () => {
			props.self.setState({stateEdit: !stateItem})
		};
		console.log(stateItem);
		if(stateItem){
			return (<td onClick={inverseState}><input className="item-data" value={props.data.element}/></td>);
		}else{
			return (<td onClick={inverseState}><span className="item-data">{props.data.element}</span></td>);
		}
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
						groups={this.props.groups}
						subjects={this.props.subjects}
						compactSchedule={this.props.compactSchedule}
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
						  	this.state.table.data.map((row, indexRow) => 
						  		<tr>
							  		{
							  			row.map((el, indexColumn) => <this.ItemTable self={this} data={{indexRow: indexRow, indexColumn: indexColumn, element: el}} />)
							  		}
						  		</tr>
						  	)
						  }
					  </tbody>
					</Table>
				</div>
			</div>
		);
	}
}