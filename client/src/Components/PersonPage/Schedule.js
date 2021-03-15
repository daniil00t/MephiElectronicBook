import React from 'react';

export class Schedule extends React.Component {
	constructor(props) {
		super(props);
	}
	getType(type){
		switch(type){
			case "Лаб": return <div className="type type-lab">{type}</div>;break;
			case "Пр": 	return <div className="type type-practice">{type}</div>;break;
			case "Лек": return <div className="type type-lecture">{type}</div>;break;
			default: 		return <div className="type type-none">Доп</div>;
		}
	}
	compactLessons(day){
		let newDay 				= [];
		let arrayOfTime 	= [];
		let iterForNewDay = -1;
		day.map((lesson, index) => {
			if(!arrayOfTime.includes(lesson.time)){
				newDay.push(lesson);
				arrayOfTime.push(lesson.time);
				iterForNewDay++;
			}else{
				newDay[iterForNewDay].groups = newDay[iterForNewDay].groups.concat(lesson.groups);
			}
		});
		return newDay;
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
		console.log(props.data.even);
		return (
			<div className="lesson" data-order={`#${1}`}>
				<div className="time">{props.data.time}</div>
				{props.self.getType(props.data.type)}
				<div className="wday-wrap"><div className={`wday wday-${props.data.even}`}></div></div>
				<div className="name">{props.self.sliceName(props.data.name)}</div>
				{props.data.groups.map((obj, i) => <a href="#" className='link-group'>{obj}</a>)}
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
