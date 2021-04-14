import React from 'react';
import { Table, Overlay, Popover } from "react-bootstrap";
import ItemTable from "./ItemTable.jsx";
import PanelReport from "./PanelReport"
import "../../../styles/Report.css";

// Redux is used
import { connect } from "react-redux"
import { changeTypeReport, addChangeToReport } from "../../../redux/actions"



class Report extends React.Component {
	constructor(props) {
		super(props);

		function* putScoresTHead(minIndex, n){
			for (let index = 0; index < n; index++) {
				if(index > minIndex)
					yield 50
				else
					yield 0
			}
		}

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
			stateChanged: false,
			showTT: false,
			targets: [],
			activeTarget: -1,
			valuesScores: [...putScoresTHead(1, this.props.report.data.thead.length || 20)]
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
			console.log(i)
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
		// this.forceUpdate()
	}
	render() {
		return (
			<div className="table-wrap">
				<Overlay
					show={this.state.showTT}
					target={this.state.targets[this.state.activeTarget]}
					placement="bottom"
					// container={ref.current}
					containerPadding={20}
					>
					<Popover id="popover-contained" onMouseLeave={e => this.setState({ showTT: !this.state.showTT })}>
						<Popover.Title as="h3">Изменение границы оценок</Popover.Title>
						<Popover.Content>
							<input type="range" defaultValue={this.state.valuesScores[this.state.activeTarget+2]} class="form-control-range" id="formControlRange" onChange={e => this.changeRange(e)}/>
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
													return <th data-key={index} onClick={e => this.pickAllCol(index)} onMouseEnter={e => this.setState({ activeTarget: index-3, showTT: !this.state.showTT })} ref={el => this.state.targets.push(el)}>
																<span className="itemTH">{`${this.filterTime(el, index)} (${this.state.valuesScores[index]})`}</span>
															</th>
											case "score":
												if(index > 2)
												return <th data-key={index} onClick={e => this.pickAllCol(index)} onMouseEnter={e => this.setState({ activeTarget: index-3, showTT: !this.state.showTT })} ref={el => this.state.targets.push(el)}>
															<span className="itemTH">{`${this.filterTime(el, index)} (${this.state.valuesScores[index]})`}</span>
														</th>
											case "ch":
												if(index < 2)
													return <th><span className="itemTH">{el}</span></th>
												else
													return <th data-key={index} onClick={e => this.pickAllCol(index)} onMouseEnter={e => this.setState({ activeTarget: index-2, showTT: !this.state.showTT })} ref={el => this.state.targets.push(el)}>
															<span className="itemTH">{`${el} (${this.state.valuesScores[index]})`}</span>
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