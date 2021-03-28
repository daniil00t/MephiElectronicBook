// default imports libs
import React from 'react';
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

// import modules
import { getListTeachers } from "../api.js";

// import styles
import "../styles/AuthPanel.css";

// use redux for change global name teacher
import { connect } from "react-redux"
import { changeNameTeacher, changeStateLogged, showNotification } from "../redux/actions"

class AuthPanel extends React.Component {

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
		console.log(this.props);
		getListTeachers(teachers => {
			this.setState({listTeachers: teachers.data});
		}, (err) => {
			this.props.showNotification({
				title: "Error!",
				content: "Please, check connect to server.",
				type: "error"
			})
		});
	}
	handleLogin(e){
		Cookies.set("id", this.state.id);
		this.props.changeStateLogged()
	}

	handleChangeName(e){
		console.dir(+e.target.value)
		this.setState({id: e.target.value});

		(+e.target.value != -1) ?
			this.props.changeNameTeacher(this.state.listTeachers[+e.target.value - 1][1]):
			this.props.changeNameTeacher("")
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

const mapDispatchToProps = dispatch => ({
	changeNameTeacher: name => dispatch(changeNameTeacher(name)),
	changeStateLogged: () => dispatch(changeStateLogged()),
	showNotification: (payload) => dispatch(showNotification(payload))
})


export default connect(null, mapDispatchToProps)(AuthPanel)