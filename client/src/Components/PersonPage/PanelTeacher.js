import React from 'react';
import Cookies from "js-cookie";
import { Link } from "react-router-dom";


export class PanelTeacher extends React.Component {
	// eslint-disable-next-line no-useless-constructor
	constructor(props) {
		super(props);
	}

	validNameGroups(count){
		switch(count % 10){
			case 1: return "Группа"
			case 2:
			case 3:
			case 4: return "Группы"
			default:
				return "Групп"
		}
	}
	validNameSubjects(count){
		switch(count % 10){
			case 1: return "Предмет";
			case 2:
			case 3:
			case 4: return "Предмета";
			default:
				return "Предметов";
		}
	}
	render() {
		return (
			<div className="teacher-panel">
				<div className="wrap-teacher-panel">
					<div className="teacher-panel-name">
						{this.props.name}
					</div>

					<span className="techer-panel-mark mark-subject">
					<span className="mark-subject-count">{this.props.countSubject}</span> {this.validNameSubjects(this.props.countSubject)}
					</span>
					<span className="techer-panel-mark mark-groups">
					<span className="mark-groups-count">{this.props.countGroups}</span> {this.validNameGroups(this.props.countGroups)}
					</span>

					<span className="right-floating">
						<a href={this.props.link} className="link-homemephi">На страницу home.mephi.ru</a>
						<Link to="/auth"  className="logout btn btn-danger" onClick={(e) => Cookies.set("id", -1)}>Выйти</Link>
					</span>
				</div>
			</div>
			);
	}
}
