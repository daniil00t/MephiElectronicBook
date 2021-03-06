import React from 'react';

export class Schedule extends React.Component {
	constructor(props) {
		super(props);
	}
	Lesson(props){
		return (
			<div className="lesson" data-order={`#${1}`}>
				<div className="time">{props.data.time}</div>
				<div className="type">{props.data.type}</div>
				<div className="name">{props.data.name}</div>
				{props.data.groups.map((obj, i) => <a href="#" className='link-group'>{obj}</a>)}
				<div className="place">{props.data.place}</div>
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
		if(props.data.length  != 0){
			return (
				<div className="schedule-day">
					<h5 className="schedule-day-name">{wday[props.wday]}</h5>
					<div className="lessons">
						{props.data.map(lesson => <props.This.Lesson data={lesson} /> )}
					</div>
				</div>
			);
		}
		else{
			return <div></div>;
		}
}


	render() {
		console.log(this.props.schedule);
		return (
			<div class="schedule">
				<div class="schedule-wrap">
					<h4 class="schedule-name">Мое расписание</h4>

					<div class="schedule-days">

						{
							this.props.schedule.map((day, iter) => <this.Day This={this} data={day} wday={iter} /> )
						}
					
					</div>
				</div>	
			</div>
		);
	}
}
