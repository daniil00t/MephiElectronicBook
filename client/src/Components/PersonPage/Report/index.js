import React from 'react';
import { ButtonGroup, ToggleButton, Table } from "react-bootstrap";
import { 
	getReport, 
	setReport } from "../../../api.js";
import ItemTable from "./ItemTable.jsx";
import PanelReport from "./PanelReport"
import "../../../styles/Report.css";
import * as CONFIG from "../../../config.json";

// Redux is used
import { connect } from "react-redux"
import { changeTypeReport } from "../../../redux/actions"



class Report extends React.Component {
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
				data: []
			},
			// state for items table
			stateChanged: false
		};
		this.emmiter = this.props.emmiter;
	}
	isValidGetRequest(req){
		let access = false;
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
	componentDidMount(){
		console.log("Report updated!")
		this.setState({nameTeacher: this.props.name});
		this.getReportWithAccess({nameTeacher: this.props.name});
	}

	toggleTypeTable(type){
		this.setState({typeReport: type});
		this.props.changeTypeReport(type)
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
		let group = e.target.value;
		this.setState({nameGroup: group});
		this.getReportWithAccess({nameGroup: group});
	}
	changeType(e){
		this.setState({typeSubject: e.target.value});
		this.getReportWithAccess({typeSubject: e.target.value});
	}
   saveReport(e){
      console.log(this.state.table);
      setReport(this.state.table, pb => {
         console.log(pb);
      }, err => {
         throw err;
      })
   }
	render() {
		return (
			<div className="table-wrap">
            <ItemTable />
				<div className="TABLE">
					<PanelReport
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
					    		this.props.report.data.thead.map(el => <th>{el}</th>)
					    	}
					    </tr>
					  </thead>
					  <tbody>
						  {
						  	this.props.report.data.data.map((row, Irow) => 
						  		<tr>
							  		{
							  			row.map((el, Icol) => 
										  <ItemTable emmiter={this.emmiter} row={Irow} col={Icol} value={el} />
										)
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

const mapStateToProps = state => ({
	report: state.report
})
const mapDispatchToProps = dispatch => ({
	changeTypeReport: type => dispatch(changeTypeReport(type))
})

export default connect(mapStateToProps, mapDispatchToProps)(Report)