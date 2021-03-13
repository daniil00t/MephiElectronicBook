import React from 'react';
import Cookies from "js-cookie";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {Card, ListGroup} from 'react-bootstrap';

// Components
import { 
	getScheduleTeacher, 
	getListLearners } from "../../api.js";
import { Header } from "./Header.js";
import { Schedule } from "./Schedule.js";
import { PanelTeacher } from "./PanelTeacher.js";
import { Footer } from "./Footer.js";
import Report from "./Report.jsx";
import EventEmmiter from "../../EventEmmiter.js";

// Styles
import "../../styles/PersonPage.css";



export class PersonPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// main info
			id: +Cookies.get("id") || -1,
			name: "",
			// schedule
			schedule: [],
			groups: [],
			subjects: [],
			// for tables
			activeTypeTable: -1,
			activeGroupId: -1,
			activeSubjectId: -1
		}
		this.emmiter = new EventEmmiter();
		this.listen = this.listen.bind(this);
		this.listen();
	}
	listen(){
		this.emmiter.on("changeTypeTable", data => {
			this.setState({activeTypeTable: data.data});
		})
	}
	solveCounts(schedule){
		let arraySubjects = [];
		let arrayGroups 	= [];

		schedule.map(day => {
			day.map(lesson => {
				if(!(arraySubjects.includes(lesson.name))) arraySubjects.push(lesson.name);
				lesson.groups.map(group => {
					if(!(arrayGroups.includes(group))) arrayGroups.push(group);		
				})
			})
		});
		return {
			subjects: arraySubjects,
			groups: arrayGroups
		};
	}
	componentDidMount(){
		let id = -1;
		if(this.props.id != -1 || this.state.id != -1){
			this.props.id != -1 ? (id = this.props.id) : (id = this.state.id);
			getScheduleTeacher(id, data => {
				let name = data.data[0].name;
				let schedule = data.data[0].data;

				if(Cookies.get("id") == -1){
					Cookies.set("id", this.props.id);
				}
				this.setState({
					name: name,
					schedule: schedule,
					groups: this.solveCounts(schedule).groups,
					subjects: this.solveCounts(schedule).subjects
				});
			}, err => {
				console.log(err);
			});
		}
		else{
			document.location.replace('/auth');
		}
	}


	switcher(self){
		switch(this.props.match){
			case "main": {
				return (
					<main>
						<PanelTeacher 
							countSubject={this.solveCounts(this.state.schedule).subjects.length} 
							countGroups={this.solveCounts(this.state.schedule).groups.length} 
							name={this.state.name}
						/>
						<Schedule schedule={this.state.schedule}/>
					</main>
				)
			};break;
			case "groups": {
				return <this.ListGroups groups={this.state.groups} handleClickOnLink={index => this.setState({activeGroupId: index})} />
			};break;
			case "subjects": {
				return <this.ListSubjects subjects={this.state.subjects} handleClickOnLink={index => this.setState({activeSubjectId: index})} />
			};break;
			case "table-score":
				// this.setState({activeTypeTable: 1});break;
			case "table-att":{
				// this.setState({activeTypeTable: 0});break;
				return (
					<main>
						<PanelTeacher 
							countSubject={this.solveCounts(this.state.schedule).subjects.length} 
							countGroups={this.solveCounts(this.state.schedule).groups.length} 
							name={this.state.name}
						/>
						<Report listLearners={[]} props={this.props} state={this.state} changeState={newState => this.setState(newState)}/>
					</main>
				)
			};break;
			// case "table-score":
			// 	return <TableScore />;break;
			default:
				return "Not Found:(";
		}
	}
	ListGroups(props){
		return (
			<div className="card-wrap">
				<Card style={{ width: '18rem' }}>
				  <Card.Header>Groups</Card.Header>
				  <ListGroup variant="flush">
				  	{
							props.groups.map((el, index) => <Link data_index={index} onClick={e => props.handleClickOnLink(+e.target.attributes.data_index.value)} className="list-group-item" to="/personalPage/tables/att">{el}</Link>)
						}
				  </ListGroup>
				</Card>
			</div>
		);
	}
	ListSubjects(props){
		return (
			<div className="card-wrap">
				<Card style={{ width: '18rem' }}>
				  <Card.Header>Subjects</Card.Header>
				  <ListGroup variant="flush">
				  	{
							props.subjects.map((el, index) => <Link data_index={index} onClick={e => props.handleClickOnLink(+e.target.attributes.data_index.value)} className="list-group-item" to="/personalPage/tables/att">{el}</Link>)
						}
				  </ListGroup>
				</Card>
			</div>
		);
	}
	render() {
		return (
			<div className="person-page-container">
				<Header groups={this.state.groups} subjects={this.state.subjects} self={this} emmiter={this.emmiter}/>
					{
						this.switcher(this)
					}
				<Footer />
			</div>
		);
	}
}
