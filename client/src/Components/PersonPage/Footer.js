import React from 'react';

export class Footer extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<footer className="footer navbar-fixed-bottom">
			<div className="wrap-footer">
				<span><span className="markFooterGray">Front-end: Daniil Shenyagin</span> 2021&copy;All rights reserved. <span className="markFooterGray">Back-end: Gleb Ryabets </span></span>
			</div>
			</footer>
		);
	}
}
