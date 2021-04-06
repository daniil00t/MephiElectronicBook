import React 		from 'react'
import Cookies 	from "js-cookie"
import { Link } 	from "react-router-dom"
import { Card, ListGroup } from 'react-bootstrap'

// Components
import { getScheduleTeacher } 	from "../../api.js"
import Header 							from "./Header"
import Schedule 						from "./Schedule.js"
import { PanelTeacher } 			from "./PanelTeacher.js"
import { Footer } 					from "./Footer.js"
import Report 							from "./Report"

// Styles
import "../../styles/PersonPage.css"
import { connect } from 'react-redux'
import { 
	setSchedule, 
	changeSubject,
	initGlobal
 } from "../../redux/actions"



class PersonPage extends React.Component {
	constructor(props) {
		super(props)

		let id = +Cookies.get("id")
		this.state = {
			// main
			id: id || -1,

			// schedule
			schedule: [],
			groups: [],
			subjects: [],
			durations: [],
			compactSchedule: [],
		}
	}

	addUniqueItem(items, arr){
		items.map(item => { if(arr.indexOf(item) === -1) arr.push(item) });
		return arr;
	}
	solveCounts(schedule){
		let arraySubjects 	= [];
		let arrayGroups 		= [];
		let arrayDurations 	= [];
		let compacts 			= [];
		

		schedule.map(day => {
			day.map((lesson, index) => {
				// Add compact array subject -> (name, groups, durations, types)
				let tmpNames = compacts.reduce((acc, cur) => {
					return [...acc, cur.name];
				}, []);

				let indexName = tmpNames.indexOf(lesson.name);
				if(indexName != -1){
					compacts[indexName].groups = this.addUniqueItem(lesson.groups, compacts[indexName].groups);
					compacts[indexName].durations = this.addUniqueItem([lesson.duration], compacts[indexName].durations);
					compacts[indexName].types = this.addUniqueItem([lesson.type], compacts[indexName].types);
				}else{
					compacts.push({
						name: lesson.name,
						groups: [...lesson.groups],
						durations: [lesson.duration],
						types: [lesson.type]
					})
				}

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
			durations: arrayDurations,
			compacts: compacts
		};
	}
	componentDidMount(){
		console.log(this.props)
		if(this.state.id != -1){
			let id = this.state.id;
			getScheduleTeacher(id, data => {
				let name = data.name;
				let schedule = data.data;

				if(Cookies.get("id") == -1){
					Cookies.set("id", this.props.id);
				}

				this.props.updateSchedule(schedule)

				this.setState({
					name: name,
					schedule: schedule,
					groups: this.solveCounts(schedule).groups,
					subjects: this.solveCounts(schedule).subjects,
					durations: this.solveCounts(schedule).durations,
					compactSchedule: this.solveCounts(schedule).compacts
				});

				// Init global data redux
				this.props.initGlobal({
					nameTeacher: name,
					isLogged: Cookies.get("id") != -1,
					countSubject: this.solveCounts(schedule).subjects.length,
					countGroups:  this.solveCounts(schedule).groups.length
				})

			}, err => {
				console.log(err);
			});
		}
		else{
			// document.location.replace('/auth');
		}
	}


	Switcher(self){
		console.log(self.props)
		switch(this.props.match){
			case "main": {
				return (
					<main>
						<PanelTeacher 
							countSubject={this.props.countSubjects} 
							countGroups={this.props.countGroups} 
							name={this.props.nameTeacher}
							link={this.props.linkOnHomeMephi}
						/>
						<Schedule/>
					</main>
				)
			}
			case "groups": {
				return <this.ListGroups 
					groups={this.state.groups} 
					handleClickOnLink={subject => self.props.changeSubject(subject)}
					/>
			}
			case "subjects": {
				return <this.ListSubjects 
					subjects={this.state.subjects} 
					handleClickOnLink={subject => self.props.changeSubject(subject)} 
					/>
			}
			case "table-score":
			case "table-att":{
				return (
					<main>
						<PanelTeacher 
							countSubject={this.props.countSubjects} 
							countGroups={this.props.countGroups} 
							name={this.props.nameTeacher}
							link={this.props.linkOnHomeMephi}
						/>
						<Report
							compactSchedule={this.state.compactSchedule}
							groups={this.state.groups}
							subjects={this.state.subjects}
							durations={this.state.durations}
							name={this.state.name}
						/>
					</main>
				)
			}
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
										e => props.handleClickOnLink(props.subjects[+e.target.attributes.data_index.value])
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
				<Header groups={this.state.groups} subjects={this.state.subjects}/>
				{
					this.Switcher(this)
				}
				<Footer />
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => ({
	changeSubject: subject => dispatch(changeSubject(subject)),
	updateSchedule: schedule => dispatch(setSchedule(schedule)),
	initGlobal: initState => dispatch(initGlobal(initState))
})

const mapStateToProps = state => ({
	nameTeacher: state.GLOBAL.nameTeacher,
	countSubjects: state.GLOBAL.countSubject,
	countGroups: state.GLOBAL.countGroups,
	linkOnHomeMephi: state.GLOBAL.linkOnHomeMephi,
	schedule: state.schedule.data
})

export default connect(mapStateToProps, mapDispatchToProps)(PersonPage)