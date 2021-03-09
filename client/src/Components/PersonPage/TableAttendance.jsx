import React from 'react';
import { Table } from 'react-bootstrap';
import date from "date.js";

export default class TableAttendance extends React.Component {

	constructor(props) {
		super(props);
	}

	getDates(dateStart, wdays, count){
		// input -> ("03.10.20", [1, 0, 1, 0, 1, 0], 10)
		// how work: понимаем, что 03 - *какой-то день недели*
		// Прибавляем к нему wdays[i]*week
		// output -> ["04.10.20", "06.10.20", "08.10.20"...]
		// console.log(date(`monday after ${dateStart}`));
		
		return date("next next monday");
	}
	render() {
		console.log(this.getDates("03.03.21", [0, 1, 0, 0, 1, 1], 20));
		return (
			<Table striped bordered hover>
			  <thead>
			    <tr>
			      <th>#</th>
			      <th>First Name</th>
			      <th>Last Name</th>
			      <th>Username</th>
			    </tr>
			  </thead>
			  <tbody>
			    <tr>
			      <td>1</td>
			      <td>Mark</td>
			      <td>Otto</td>
			      <td>@mdo</td>
			    </tr>
			    <tr>
			      <td>2</td>
			      <td>Jacob</td>
			      <td>Thornton</td>
			      <td>@fat</td>
			    </tr>
			    <tr>
			      <td>3</td>
			      <td colSpan="2">Larry the Bird</td>
			      <td>@twitter</td>
			    </tr>
			  </tbody>
			</Table>
		);
	}
}
