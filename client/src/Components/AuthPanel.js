// default imports libs
import React 		from 'react';
import { Link } 	from "react-router-dom";
import Cookies 	from "js-cookie";

// import modules
import { getListTeachers, getIdByAuth } from "../api.js";

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

		// refs' inputs for get data
		this.refLogin = React.createRef()
		this.refPassword = React.createRef()
	}

	// componentDidMount() {
	// 	console.log(this.props);
	// 	getListTeachers(teachers => {
	// 		this.setState({listTeachers: teachers.data});
	// 	}, err => {
	// 		console.error(err)
	// 		this.props.showNotification({
	// 			title: "Error!",
	// 			content: "Please, check connect to server.",
	// 			type: "error"
	// 		})
	// 	})
	// }
	handleLogin(e){
		// e.preventDefault()
		console.log(this.refLogin.value)
		getIdByAuth(this.refLogin.value, this.refPassword.value, (data) => {
			console.log(data)
		}, (error) => {
			console.log(error)
		})
		
		if(this.refLogin.value === "root" && this.refPassword.value === "root"){
			Cookies.set("id", 8);
			this.props.changeStateLogged()
		}
		else{
			console.log('no!')
			e.preventDefault()
		}
	}
	render() {
		return (
			<main className="main-auth">
				<div className="container">
					<div className="row">
						<div className="col-md-6">
								<div className="card">
									<form className="box">
										<h1>Login</h1>
										<p className="text-muted" > Please enter your login and password!</p>
											<input ref={input => this.refLogin = input} type="text" name="" placeholder="Username"/> 
											<input ref={input => this.refPassword = input} type="password" name="" placeholder="Password"/> 
											<a className="forgot text-muted" href="#">Forgot password?</a> 
											<Link
												to="/personalPage" 
												// style={this.state.id == -1 ? {pointerEvents: "none"} : {}} 
												className="btn-login"
												onClick={this.handleLogin}
											>
												Login
											</Link>

										<div className="col-md-12">
												<ul className="social-network social-circle">
													<li><a href="#" className="icoFacebook" title="Facebook"><i className="fab fa-facebook-f"></i></a></li>
													<li><a href="#" className="icoTwitter" title="Twitter"><i className="fab fa-twitter"></i></a></li>
													<li><a href="#" className="icoGoogle" title="Google +"><i className="fab fa-google-plus"></i></a></li>
												</ul>
										</div>
									</form>
								</div>
						</div>
					</div>
				</div>
			</main>
		);
	}
}

const mapDispatchToProps = dispatch => ({
	changeNameTeacher: name => dispatch(changeNameTeacher(name)),
	changeStateLogged: () => dispatch(changeStateLogged()),
	showNotification: payload => dispatch(showNotification(payload))
})

/*

<div className="wrap">
					<select name="name" className="form-control teacher_name" onChange={this.handleChangeName}>
						<option value="-1">Select teacher</option>
						{
							this.state.listTeachers.map(teacher => <option value={teacher[0]}>{teacher[1]}</option>)
						}
					</select>
					<Link
						to="/personalPage" 
						style={this.state.id === -1 ? {pointerEvents: "none"} : {}} 
						className="btn btn-primary go" 
						onClick={e => this.handleLogin(e)}
					>
						login
					</Link>
				</div>
*/
export default connect(null, mapDispatchToProps)(AuthPanel)