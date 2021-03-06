import React from 'react';
import Cookies from "js-cookie";
import { getScheduleTeacher, getListLearners } from "../../api.js";
// Components
import { Header } from "./Header.js"
import { Schedule } from "./Schedule.js"
import { PanelTeacher } from "./PanelTeacher.js"
import { Footer } from "./Footer.js"
// Styles
import "../../styles/PersonPage.css";



export class PersonPage extends React.Component {
	constructor(props) {
		super(props);
		// const [cookies, setCookie] = useCookies(['name']);
		this.state = {
			id: +Cookies.get("id") || -1,
			name: "",
			schedule: []
		}
	}

	componentDidMount(){
		if(this.props.id != -1 || this.state.id != -1){
			let id = -1;
			this.props.id != -1 ? (id = this.props.id) : (id = this.state.id);
			getScheduleTeacher(id, data => {
				let name = data.data[0].name;
				let schedule = data.data[0].data;

				if(Cookies.get("id") == -1){
					Cookies.set("name", name);
					Cookies.set("id", this.props.id);
				}
				this.setState({name: name, schedule: schedule});
			}, err => {
				console.log(err);
			});
		}
		else{
			document.location.replace('/auth');
		}
	}
	render() {
		return (
			<div>
				<Header />
				<main>
					<PanelTeacher countSubject={4} countGroups={11} name={this.state.name}/>
					<Schedule schedule={this.state.schedule}/>
				</main>
				<Footer />
			</div>
		);
	}
}
