import React from 'react';
import { Header } from "./Header.js"
import { Schedule } from "./Schedule.js"
import { PanelTeacher } from "./PanelTeacher.js"
import { Footer } from "./Footer.js"
import "../../styles/PersonPage.css";


export class PersonPage extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<Header />
				<main>
					<PanelTeacher />
					<Schedule schedule={
						{
							data: [
								[
									{time: '12:45 — 14:20', 
									even: 0, 
									type: 'Пр', 
									duration: 'ALL_SEMESTER', 
									place: '408', 
									groups: ['Б20-513', 'Б20-523'], 
									name: 'Линейная алгебра', 
									wday: 5}
								]
							]
						}
					}/>
				</main>
				<Footer />
			</div>
		);
	}
}
