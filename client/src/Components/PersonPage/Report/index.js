import React from 'react';
import { Table, Overlay, Popover } from "react-bootstrap";
import ItemTable from "./ItemTable.jsx";
import PanelReport from "./PanelReport"
import "../../../styles/Report.css";

// Redux is used
import { connect } from "react-redux"
import { changeTypeReport, addChangeToReport, backChange } from "../../../redux/actions"



class Report extends React.Component {
	constructor(props) {
		super(props);

		function* putScoresTHead(n){
			for (let index = 0; index < n; index++)
				yield 50
		}
		// Idea: i think that it will be able to better recieve from server to client 
		// not string, but needed return object which exist the next parametres:
		// thead = [
		// 	{
		// 		name: "ФИО",
		// 		type: "string",
		// 		enable: false
		// 	},
		// 	...
		// 	{
		// 		name: "Раздел 1",
		// 		type: "number",
		// 		enable: true,
		// 		maxValue?: 50
		// 	},
		// 	{
		// 		name: "Аттестация",
		// 		type: "choose",
		// 		enable: true,
		// 		choosers: "а/н"
		// 	}
		// 	...
		// 	{
		// 		{
		// 			name: "Сумма",
		// 			type: "number",
		// 			enable: false,
		//				maxValue: 100,
		// 			formula: "summ(#1, #2)" -> where #1 - start col, #2 - end col
		// 		}
		// 	}
		// ]
		this.state = {
			// Schedule
			table: {
				group: "",
				name: "",
				thead: [],
				meta: {},
				data: []
			},
			// state vars for ch report
			showTT: false,	// state show pop-up
			targets: [],	// linked <th /> for pop-up
			activeTarget: -1,	// active index <th />
			valuesScores: [...putScoresTHead(this.props.report.data.thead.length || 20)] // default value = 50 and count elements = 20
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
		if(index > 3){
			if(this.lastTime == element.slice(10)){
				result = filter(element)
			}
			else{
				result = element
			}
		}
		else if(index == 3){
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
			this.props.addChangeToReport({
				row: i,
				col: index,
				value: "+"
			})
		}
	}
	changeRange(e){
		// console.log(e)
		let arr = this.state.valuesScores
		arr[this.state.activeTarget+2] = e.target.valueAsNumber
		console.log(arr[this.state.activeTarget], this.state.activeTarget)
		this.setState({
			valuesScores: arr
		})
	}
	componentDidMount(){
		console.log(this.props.edit)
	}
	concatChanges(row, col){
		if(this.props.changes.length > 0){
			for (let i = this.props.changes.length - 1; i >= 0; i--) {
				let item = this.props.changes[i]
				if(item.row == row && item.col == col) return item.value
			}
		}
		return this.props.report.data.data[row][col]
	}
	render() {
		console.log(this.props.changes)
		return (
			<div className="table-wrap">
				<Overlay
					show={this.state.showTT}
					target={this.state.targets[this.state.activeTarget]}
					placement="bottom"
					containerPadding={20}
					
					>
					<Popover id="popover-contained" onMouseEnter={e => this.setState({ showTT: true })} onMouseLeave={e => this.setState({ showTT: false })}>
						<Popover.Title as="h3">Изменение границы оценок</Popover.Title>
						<Popover.Content>
							<input type="range" value={this.state.valuesScores[this.state.activeTarget+2]} class="form-control-range" id="formControlRange" onChange={e => this.changeRange(e)}/>
						</Popover.Content>
					</Popover>
				</Overlay>


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
												if(index > 2)
													return <th onClick={e => this.pickAllCol(index)} style={{cursor: "pointer"}} title="Нажмите, чтобы заполнить весь столбец">
																<span className="itemTH">{`${this.filterTime(el, index)}`}</span>
															</th>
												else return <th><span>{el}</span></th>
											case "score":
												if(index > 2)
													return <th>
																<span className="itemTH">{`${this.filterTime(el, index)}`}</span>
															</th>
												else return <th><span>{el}</span></th>
											case "ch":
												if(index < 2)
													return <th><span className="itemTH">{el}</span></th>
												else
													return <th onMouseEnter={e => this.setState({ activeTarget: index-2, showTT: true })} onMouseLeave={e => this.setState({ showTT: false })} ref={el => this.state.targets[index-2] = el}>
															<span className="itemTH">{el}<span style={{color: "#007bff"}}> ({this.state.valuesScores[index]})</span></span>
														</th>
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
										  <ItemTable row={Irow} col={Icol} value={this.concatChanges(Irow, Icol)} maxValue={this.state.valuesScores[Icol]}/>
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
	report: state.report,
	changes: state.report.edit.changes
})
const mapDispatchToProps = dispatch => ({
	changeTypeReport: type => dispatch(changeTypeReport(type)),
	addChangeToReport: change => dispatch(addChangeToReport(change)),

	backChange: () => dispatch(backChange())
})

export default connect(mapStateToProps, mapDispatchToProps)(Report)