import React from 'react';
import { ButtonGroup, ToggleButton, Table } from "react-bootstrap";
import { 
	getReport, 
	setReport } from "../../../api.js";
import ItemTable from "./ItemTable.jsx";
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
		// this.listen();
		this.listen = this.listen.bind(this);
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
            this.listen();
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
			console.log(data.data);
			this.setState({typeReport: data.data});
			this.getReportWithAccess({typeReport: data.data});
		});
      let self = this;
      this.emmiter.on("changeReport", change => {
         let table = self.state.table;
         if(Array.isArray(table.data[change.row])){
            table.data[+change.row][+change.col] = change.value;
            self.setState({
               stateChanged: change.state,
               table: table
            });
         }
         
      })
	}
	componentDidMount(){
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
	PanelTable(props){
		let groups 	= [];
		let types 	= [];
		let names = props.compactSchedule.reduce((acc, cur) => {
			return [...acc, cur.name];
		}, []);
		let TYPES = props.compactSchedule.reduce((acc, cur) => {
			return [...acc, cur.types];
		}, []);


		let indexName;
		~names.indexOf(props.self.state.nameSubject) ? 
			indexName = names.indexOf(props.self.state.nameSubject):
			indexName = names.indexOf(props.self.props.report.subject);

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
								index == indexName ?
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
								<option selected value={el}>{el}</option> :
								<option value={el}>{el}</option>
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
		            checked={props.self.props.report.typeReport === radio.alias}
		            onChange={(e) => props.self.toggleTypeTable(e.currentTarget.value)}
		          > 
		            {radio.name}
		          </ToggleButton>
		        ))}
		      </ButtonGroup>
            <button style={props.self.state.stateChanged ? {display: "block"} : {display: "none"}} onClick={props.self.saveReport.bind(props.self)}>Save</button>
		    </div>
	    </div>
		);
	}
	render() {
		// console.log(this.getDates("03.03.21", [0, 1, 0, 0, 1, 1], 20));
		// console.log(this.props.state);
		// this.getReportWithAccess({});
		return (
			<div className="table-wrap">
            <ItemTable />
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
						  	this.state.table.data.map((row, Irow) => 
						  		<tr>
							  		{
							  			row.map((el, Icol) => <ItemTable emmiter={this.emmiter} row={Irow} col={Icol} value={el} />)
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