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

// Components
import { getScheduleTeacher, getListLearners } from "../../api.js";
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
			// main info
			id: +Cookies.get("id") || -1,
			name: "",
			// schedule
			schedule: [],
			groups: [],
			subjects: [],
			// for tables
			activeTypeTable: "",
			activeGroupId: -1,
			activeSubjectId: -1
		}
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
				console.log(data);
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
	switcher(props, state){
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
				return (<ul>
					{
						this.state.groups.map((el, index) => <li onClick={e => this.setState({activeGroupId: index})}><Link to="/personalPage/tables/att">{el}</Link></li>)
					}
				</ul>)};break;
			case "subjects": {
				return (<ul>
					{
						this.state.subjects.map((el, index) => <li onClick={e => this.setState({activeSubjectId: index})}><Link to="/personalPage/tables/att">{el}</Link></li>)
					}
				</ul>)};break;
			case "table-att":
				return <TableAttendance listLearners={[]} props={this.props} state={this.state}/>;break;
			case "table-score":
				return <TableScore />;break;
		}
	}
	render() {
		console.log(this.props.match);
		return (
			<div>
				<Header groups={this.state.groups} subjects={this.state.subjects}/>
					{
						this.switcher()
					}
				<Footer />
			</div>
		);
	}
}
