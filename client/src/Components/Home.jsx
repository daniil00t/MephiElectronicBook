import React from 'react';
import { Link } from "react-router-dom";

export default class Home extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				Welcome to the ELBook!
				<Link to="/auth">Auth</Link>
			</div>
		);
	}
}
