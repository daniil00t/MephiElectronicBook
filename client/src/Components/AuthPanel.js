// default imports libs
import React from 'react';
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

// import modules
import { getListTeachers } from "../api.js";

// import styles
import "../styles/AuthPanel.css";

export class AuthPanel extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			listTeachers: [],
			id: -1
		};
		// binds for function this class
		this.handleLogin = this.handleLogin.bind(this);
		this.handleChangeName = this.handleChangeName.bind(this);
	}

	componentDidMount() {
		getListTeachers(schedule => {
			this.setState({listTeachers: schedule.data});
		}, (err) => {
			console.log(err);
		});
	}
	handleLogin(e){
		Cookies.set("id", this.state.id);
	}

	handleChangeName(e){
		this.setState({id: +e.target.value});
	}
	render() {
		return (
			<main>
				<div className="wrap">
					<select name="name" className="form-control teacher_name" onChange={this.handleChangeName}>
						<option value="-1">Select teacher</option>
						{
							this.state.listTeachers.map(teacher => <option value={teacher[0]}>{teacher[1]}</option>)
						}
					</select>
					<Link 
						to="/personalPage" 
						style={this.state.id == -1 ? {pointerEvents: "none"} : {}} 
						className="btn btn-primary go" 
						onClick={e => this.handleLogin(e)}
					>
						login
					</Link>
				</div>
			</main>
			);
		}
	}
