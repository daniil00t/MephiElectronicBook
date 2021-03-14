import React from 'react';
import { Table, ButtonGroup, ToggleButton } from 'react-bootstrap';
import date from "date.js";
import Cookies from "js-cookie";
import EventEmmiter from "../../EventEmmiter.js";

import "../../styles/tables.css";

export default class Report extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			table: {
				group: "",
				name: "",
				thead: [],
				meta: {},
				data: [[]]
			}
		}
		this.emmiter = new EventEmmiter();
	}
	componentDidMount(){
		// request to server, but now used object
		let table = {
			nameGroup: "Б20-101",
			nameTeacher: "Уткин Игорь Шапкович",
			nameSubject: "Физика",
			thead: ["id", "name", "03.03.21", "05.03.21", "06.03.21", "08.03.21", "11.03.21", "13.03.21", "15.03.21", "common"],
			meta: {
				countSpecialCols: 2
			},
			data: [
				[1, "Аржаков Владислав Леонидович", true, false, true, false, false, true, true],
				[2, "Арляпов Евгений Романович",  true, true, true, true, false, false, true],
				[3, "Бугрей Павел Сергеевич", true, false, true, false, false, true, true],
				[4, "Гончаров Иван Юрьевич", true, true, true, true, false, false, true],
				[5, "Горбунов Дмитрий Сергеевич", true, false, true, false, false, true, true]
				// ...
			]
		}
		this.setState({table: table});
	}

	toggleTypeTable(type){
		this.props.changeState({activeTypeTable: type})
		Cookies.set("reportType", type)
	}
	replaceChar(el){
		if(el === true){
			return "+";
		}else if(el === false){
			return "-";
		}
		else{
			return el;
		}
	}
	PanelTable(props){
		const radios = [
	    { name: 'Посещаемость', value: 0 },
	    { name: 'Оценки', value: 1 },
	    { name: 'Итоги', value: 2 }
	  ];
		return (
			<div className="panelHeadTable">
				<div className="tableWrap">
					<select className="form-control groups">
						<option value={-1}>Choose group</option>
						{
							props.groups.map((el, index) => 
								index == props.group ?
								<option selected value={index}>{el}</option> :
								<option value={index}>{el}</option>
							)
						}
					</select>
					<select className="form-control subjects">
						<option value={-1}>Choose subject</option>
						{
							props.subjects.map((el, index) => 
								index == props.subject ?
								<option selected value={index}>{el}</option> :
								<option value={index}>{el}</option>
							)
						}
					</select>
					<span>{props.type}</span>
					
		      <ButtonGroup toggle>
		        {radios.map((radio, idx) => (
		          <ToggleButton
								variant="light"
		            key={idx}
		            type="radio"
		            name="radio"
		            value={radio.value}
		            checked={props.state.activeTypeTable === radio.value}
		            onChange={(e) => props.This.toggleTypeTable(+e.currentTarget.value)}
		          >
		            {radio.name}
		          </ToggleButton>
		        ))}
		      </ButtonGroup>
		      </div>
	    </div>
		);
	}
	render() {
		// console.log(this.getDates("03.03.21", [0, 1, 0, 0, 1, 1], 20));
		return (
			<div className="table-wrap">
				<div className="TABLE">
					<this.PanelTable
						This={this}
						state={this.props.state}
						name={this.props.state.name}
						groups={this.props.state.groups}
						subjects={this.props.state.subjects}
						group={this.props.state.activeGroupId}
						subject={this.props.state.activeSubjectId}
					/>
					<Table striped bordered hover variant="dark">
					  <thead>
					    <tr>
					    	{
					    		this.state.table.thead.map(el => <th>{el}</th>)
					    	}
					    </tr>
					  </thead>
					  <tbody>
						  {
						  	this.state.table.data.map(row => 
						  		<tr>
							  		{
							  			row.map(el => <td>{this.replaceChar(el)}</td>)
							  		}
						  		</tr>
						  	)
						  }
					  </tbody>
					</Table>
				</div>
			</div>
		);
	}
}
