import React from 'react';
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import {Card, ListGroup} from 'react-bootstrap';

// Components
import { getScheduleTeacher } from "../../api.js";
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
			durations: [],
			// for tables
			activeGroupId: -1,
			activeSubjectId: -1
		}
		this.emmiter = new EventEmmiter();
		console.clear();
	}
	solveCounts(schedule){
		let arraySubjects 	= [];
		let arrayGroups 		= [];
		let arrayDurations 	= [];
		

		schedule.map(day => {
			day.map((lesson, index) => {
				if(!(arraySubjects.includes(lesson.name))){
					let indexDuration = arraySubjects.indexOf(lesson.name);
					let itemDuration = arrayDurations[indexDuration];
					if(lesson.duration != itemDuration){
						if(Array.isArray(itemDuration)){
							arrayDurations[indexDuration] = [arrayDurations[indexDuration], itemDuration];
						}
						else{
							arrayDurations.push(lesson.duration);
						}
					}
                    // arrayGroups.push(lesson.groups);
					arraySubjects.push(lesson.name);
				}
				lesson.groups.map(group => {
					if(!(arrayGroups.includes(group))) arrayGroups.push(group);		
				})
			})
		});
		return {
			subjects: arraySubjects,
			groups: arrayGroups,
			durations: arrayDurations
		};
	}
	componentDidMount(){
		if(this.state.id != -1){
			let id = this.state.id;
			getScheduleTeacher(id, data => {
				let name = data.name;
				let schedule = data.data;

				if(Cookies.get("id") == -1){
					Cookies.set("id", this.props.id);
				}
				this.setState({
					name: name,
					schedule: schedule,
					groups: this.solveCounts(schedule).groups,
					subjects: this.solveCounts(schedule).subjects,
					durations: this.solveCounts(schedule).durations
				});
			}, err => {
				console.log(err);
			});
		}
		else{
			document.location.replace('/auth');
		}
	}


	Switcher(self){
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
				return <this.ListGroups 
					groups={this.state.groups} 
					handleClickOnLink={index => this.setState({activeGroupId: index})}
					/>;
			};break;
			case "subjects": {
				return <this.ListSubjects 
					subjects={this.state.subjects} 
					handleClickOnLink={index => this.setState({activeSubjectId: index})} 
					/>;
			};break;
			case "table-score":
				this.emmiter.emit("initReportType", {activeTypeTable: 1});
			case "table-att":{
				this.emmiter.emit("initReportType", {activeTypeTable: 0});
				return (
					<main>
						<PanelTeacher 
							countSubject={this.solveCounts(this.state.schedule).subjects.length} 
							countGroups={this.solveCounts(this.state.schedule).groups.length} 
							name={this.state.name}
						/>
						<Report
							compactSchedule={{
								groups: this.state.groups,
								subjects: this.state.subjects,
								durations: this.state.durations
							}}
							name={this.state.name}
							emmiter={this.emmiter}
						/>
					</main>
				)
			};break;
			default:
				return "Not Found Match";
		}
	}
	ListGroups(props){
		return (
			<div className="card-wrap">
				<Card style={{ width: '18rem' }}>
				  <Card.Header>Groups</Card.Header>
				  <ListGroup variant="flush">
				  		{
							props.groups.map(
								(el, index) => 
								<Link 
									data_index={index} 
									onClick={
										e => props.handleClickOnLink(+e.target.attributes.data_index.value)
									} 
									className="list-group-item" 
									to="/personalPage/tables/att"
								>
									{el}
								</Link>
							)
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
							props.subjects.map(
								(el, index) => 
								<Link 
									data_index={index} 
									onClick={
										e => props.handleClickOnLink(+e.target.attributes.data_index.value)
									} 
									className="list-group-item" 
									to="/personalPage/tables/att"
								>
									{el}
								</Link>
							)
						}
				  </ListGroup>
				</Card>
			</div>
		);
	}
	render() {
		return (
			<div className="person-page-container">
				<Header groups={this.state.groups} subjects={this.state.subjects} emmiter={this.emmiter}/>
				{
					this.Switcher(this)
				}
				<Footer />
			</div>
		);
	}
}
