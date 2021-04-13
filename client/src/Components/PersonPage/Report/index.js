import React from 'react';
import { Table } from "react-bootstrap";
import ItemTable from "./ItemTable.jsx";
import PanelReport from "./PanelReport"
import "../../../styles/Report.css";

// Redux is used
import { connect } from "react-redux"
import { changeTypeReport, addChangeToReport } from "../../../redux/actions"



class Report extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// Schedule
			table: {
				group: "",
				name: "",
				thead: [],
				meta: {},
				data: []
			},
			// state for items table
			stateChanged: false
		};
		this.lastTime = ""
	}
	toggleTypeTable(type){
		this.props.changeTypeReport(type)
	}
	replaceChar(el){
		if(el === true) return "+";
		else if(el === false) return "-";
		else return el;
	}
	filterTime(element, index){
		let result = ""
		const filter = res => res.slice(5, 10)
		if(index > 4){
			if(this.lastTime == element.slice(10)){
				result = filter(element)
			}
			else{
				result = element
			}
		}
		else if(index == 4){
			this.lastTime = element.slice(10)
			result = filter(element)
		}
		else{
			result = element
		}
		return result
	}
	pickAllCol(index){
		for (let i = 0; i < this.props.report.data.data.length; i++) {
			console.log(i)
			this.props.addChangeToReport({
				row: i,
				col: index,
				value: "+"
			})
		}
	}
	render() {
		return (
			<div className="table-wrap">
				<div className="TABLE table-wrapper-scroll-x my-custom-scrollbar">
					<PanelReport
						self={this}
						name={this.props.name}
						groups={this.props.groups}
						subjects={this.props.subjects}
						compactSchedule={this.props.compactSchedule}
					/>
					<Table striped bordered hover style={{width: "100vw"}}>
					  <thead>
					    <tr>
					    	{
					    		this.props.report.data.thead.map((el, index) => {
										switch(this.props.report.typeReport){
											case "att":
												if(index > 3)
													return <th onClick={e => this.pickAllCol(index)}>
																<span className="itemTH">{this.filterTime(el, index)}</span>
															</th>
											case "score":
												return <th><span className="itemTH">{this.filterTime(el, index)}</span></th>
											case "ch":
												return <th><span className="itemTH">{el}</span></th>
										}
									}
								)
					    	}
					    </tr>
					  </thead>
					  <tbody>
						  {
						  	this.props.report.data.data.map((row, Irow) => 
						  		<tr>
							  		{
							  			row.map((el, Icol) => 
										  <ItemTable row={Irow} col={Icol} value={el} />
										)
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

const mapStateToProps = state => ({
	report: state.report
})
const mapDispatchToProps = dispatch => ({
	changeTypeReport: type => dispatch(changeTypeReport(type)),
	addChangeToReport: change => dispatch(addChangeToReport(change))
})

export default connect(mapStateToProps, mapDispatchToProps)(Report)