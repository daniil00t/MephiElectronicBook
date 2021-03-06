import React from 'react';
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

import { getListTeachers } from "../api.js";
import ee from "../EventEmmiter.js";

import "../styles/AuthPanel.css";

export class AuthPanel extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			listTeachers: [],
			id: -1
		};
		this.handleClick = this.handleClick.bind(this);
		this.handleChangeName = this.handleChangeName.bind(this);
	}

	componentDidMount() {
		getListTeachers(schedule => {
			// console.log(data);
			this.setState({listTeachers: schedule.data});
		}, (err) => {
			console.log(err);
		});
	}
	handleClick(){
		// this.setState({counter: this.state.counter+1});
		// this.props.This.setState({id: this.state.id});
		ee.emit("changeNameIdTeacher", {type: "int", id: this.state.id});
		Cookies.set("id", this.state.id);
		// ee.on("changeNameIdTeacher", data => {console.log(data)}); 	
		// document.location.replace('/personalPage?id=' + this.state.id);
		// window.history.replaceState({id: this.state.id}, "", "/personalPage");
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

				<Link to="/personalPage" className="btn btn-primary go" onClick={this.handleClick}>login</Link>
				</div>

			</main>
			);
		}
	}
