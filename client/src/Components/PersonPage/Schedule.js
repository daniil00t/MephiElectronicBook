import React from 'react';
import { connect } from "react-redux"
import { changeGroup, changeSubject } from '../../redux/actions';
import { Link } from "react-router-dom"
import "../../styles/PersonPage.css"

class Schedule extends React.Component {
	constructor(props) {
		super(props);
	}
	getType(type){
		switch(type){
			case "Лаб": return <div className="type type-lab">{type}</div>;break;
			case "Пр": 	return <div className="type type-practice">{type}</div>;break;
			case "Лек": return <div className="type type-lecture">{type}</div>;break;
			default: 	return <div className="type type-none">Доп</div>;
		}
	}

	sliceName(name){
		const len = 60;
		let res = "";
		name.length > len ? 
			(res = name.slice(0, len) + "...") :
			(res = name);
		return res;
	}

	Lesson(props){
		console.log("PROPS: ", props.self.props);
		return (
			<div className="lesson" data-order={`#${1}`}>
				<div className="time">{props.data.time}</div>
				{props.self.getType(props.data.type)}
				<div className="wday-wrap"><div className={`wday wday-${props.data.even}`}></div></div>

				<Link to="/personalPage/tables/att" className="name" onClick={e => props.self.props.changeSubject(props.data.name)}>{props.self.sliceName(props.data.name)}</Link>
				{props.data.groups.map((obj, i) => <Link to="/personalPage/tables/att" onClick={e => props.self.props.changeGroup(obj)} className='link-group spanLikeLink'>{obj}</Link>)}
				
				<div className="duration">{props.data.duration == "ALL_SEMESTER" ? "Весь семестр" : props.data.duration}</div>
				<div className="place" title={props.data.place}>{props.data.place}</div>
			</div>
		);
	}

	Day(props){
		const wday = [
			"Понедельник",
			"Вторник",
			"Среда",
			"Четверг",
			"Пятница",
			"Суббота"
		];
		let self = this;
		if(props.data.length != 0){
			return (
				<div className="schedule-day">
					<h5 className="schedule-day-name">{wday[props.wday]}</h5>
					<div className="lessons">
						{props.data.map(lesson => <props.self.Lesson data={lesson} self={props.self}/> )}
					</div>
				</div>
			);
		}
		else{
			return <div></div>;
		}
	}

	dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a,b) {
      /* next line works with strings and numbers, 
       * and you may want to customize it to your needs
       */
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
	}
	sortScheduleByTime(schedule){
		schedule.map((day, iterZ0) => {
			day.sort(this.dynamicSort("time"));
		})
		return schedule;
	}

	

	render() {
		return (
			<div class="schedule">
				<div class="schedule-wrap">
					<h4 class="schedule-name">Мое расписание</h4>

					<div class="schedule-days">
						{
							this.sortScheduleByTime(this.props.schedule).map((day, iter) => <this.Day self={this} data={day} wday={iter} /> )
						}
					</div>
				</div>	
			</div>
		);
	}
}

const mapStateToProps = state => ({
	schedule: state.schedule.data
})

const mapDispatchToProps = dispatch => ({
	changeGroup: group => dispatch(changeGroup(group)),
	changeSubject: subject => dispatch(changeSubject(subject))
})
export default connect(mapStateToProps, mapDispatchToProps)(Schedule)