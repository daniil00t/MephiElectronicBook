import React from 'react';

export class PanelTeacher extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="teacher-panel">
				<div className="wrap-teacher-panel">
					<div className="teacher-panel-name">
						{this.props.name}
					</div>

					<span className="techer-panel-mark mark-subject">
					<span className="mark-subject-count">{this.props.countSubject}</span> Предмета
					</span>
					<span className="techer-panel-mark mark-groups">
					<span className="mark-groups-count">{this.props.countGroups}</span> Групп
					</span>

					<a href="#" className="link-homemephi">
					На страницу home.mephi.ru
					</a>
				</div>
			</div>
			);
	}
}
