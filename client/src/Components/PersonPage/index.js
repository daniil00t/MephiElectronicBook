import React from 'react';
import Cookies from "js-cookie";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import { getScheduleTeacher, getListLearners } from "../../api.js";
// Components
import { Header } from "./Header.js";
import { Schedule } from "./Schedule.js";
import { PanelTeacher } from "./PanelTeacher.js";
import { Footer } from "./Footer.js";
import TableAttendance from "./TableAttendance.jsx";
import TableScore from "./TableScore.jsx";
// Styles
import "../../styles/PersonPage.css";



export class PersonPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: +Cookies.get("id") || -1,
			name: "",
			schedule: [],
			groups: [],
			subjects: []
		}
	}

	solveCounts(schedule){
		let arraySubjects = [];
		let arrayGroups 	= [];

		schedule.map((day, iterZ0) => {
			day.map((lesson, iterZ1) => {
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
		// console.log(useParams);
		let id = -1;
		// for save context
		let self = this;
		if(this.props.id != -1 || this.state.id != -1){
			this.props.id != -1 ? (id = this.props.id) : (id = this.state.id);
			getScheduleTeacher(id, data => {
				let name = data.data[0].name;
				let schedule = data.data[0].data;

				if(Cookies.get("id") == -1){
					Cookies.set("name", name);
					Cookies.set("id", this.props.id);
				}
				this.setState({
					name: name, 
					schedule: schedule,
					groups: self.solveCounts(schedule).groups,
					subjects: self.solveCounts(schedule).subjects
				});
			}, err => {
				console.log(err);
			});
		}
		else{
			document.location.replace('/auth');
		}
	}
	switcher(match, props){
		switch(match){
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
			case "table-att":
				return <TableAttendance listLearners={[]}/>;break;
			case "table-score":
				return <TableScore />;break;
		}
	}
	render() {
		console.log(this.props.match);
		return (
			<div>
				<Header groups={this.state.groups} subjects={this.state.subjects}/>
				{this.switcher(this.props.match)}
				<Footer />
			</div>
		);
	}
}
