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
					Трифоненков Владимир Петрович
					</div>

					<span className="techer-panel-mark mark-subject">
					<span className="mark-subject-count">4</span> Предмета
					</span>
					<span className="techer-panel-mark mark-groups">
					<span className="mark-groups-count">10</span> Групп
					</span>

					<a href="#" className="link-homemephi">
					На страницу home.mephi.ru
					</a>
				</div>
			</div>
			);
	}
}
