import React from 'react';
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

export default class Home extends React.Component {
	constructor(props) {
		super(props);
	}

	switcher(){
		if(Cookies.get("id") != -1){
			return <Link to="/personalPage">Go to my page</Link>;
		}
		else{
			return <Link to="/auth">Auth</Link>
		}
	}
	render() {
		return (
			<div>
				Welcome to the ELBook!
				{this.switcher()}
			</div>
		);
	}
}
