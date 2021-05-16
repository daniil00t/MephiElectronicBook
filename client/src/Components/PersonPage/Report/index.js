import React from 'react';
import { Table, Overlay, Popover, Button } from "react-bootstrap";
import ItemTable from "./ItemTable.jsx";
import PanelReport from "./PanelReport"
import "../../../styles/Report.css";

// Redux is used
import { connect } from "react-redux"
import { changeTypeReport, 
			addChangeToReport, 
			backChange, 
			template__addPart, 
			template__addStudent, 
			fullUpdate, 
			changeMaxThead, 
			template__deleteStudent,
			template__markAsHeadman,
			template__deletePart
} from "../../../redux/actions"



class Report extends React.Component {
	constructor(props) {
		super(props);

		// it will be able to better recieve from 
		// server to client not string, but needed return object which exist 
		// the next parametres
		this.state = {
			// state vars for ch report
			showTT: true,	// state show pop-up
			targetsThead: [],	// linked <th /> for pop-up
			targetsNames: [], // targets for pop-up [names...T]
			activeTarget: -1,	// active index <th />
			activeName: -1, // active index for name pop-up
			valuesScores: [], // default value = 50 and count elements = 20
			editNewStudent: false,
			editNewPart: false,
			hoverAdditional: false
		};
		this.lastTime = ""
		this.colors = {
			transparent: {
				color: "transparent",
				priority: 99
			},
			greyWhite: {
				color: "var(--global-color-grey-white)",
				priority: 3
			},
			greyBlack: {
				color: "var(--global-color-grey-black)",
				priority: 2
			},
			green: {
				color: "var(--global-color-green)",
				priority: 1
			},
			red: {
				color: "var(--global-color-red)",
				priority: 0
			}
		}
		this.inputAddStudent = React.createRef()
	}

	// This function compares two adjacent cells with the time, 
	// and if the time is the same, only the date of the cell is displayed.
	filterTime(element, index){
		let result = ""
		const filter = res => res.slice(5, 10)
		if(index > this.props.report.data.meta.firstCol){
			if(this.lastTime === element.slice(10)){
				result = filter(element)
			}
			else{
				result = element
			}
		}
		else if(index === this.props.report.data.meta.firstCol){
			this.lastTime = element.slice(10)
			result = filter(element)
		}
		else{
			result = element
		}
		return result
	}

	// Function combines all the cells of a given cols and marks it as marked
	pickAllCol(index){
		this.props.addChangeToReport({
			col: index,
			value: "+",
			allCol: true
		})
	}

	// Function required to change the score boundary for each col
	changeRange(e){
		// console.log(e)
		let arr = this.state.valuesScores
		arr[this.state.activeTarget+2] = e.target.valueAsNumber
		this.functionReallocation(
			this.state.activeTarget+2, e.target.valueAsNumber)
		this.props.changeMaxThead(
			this.state.activeTarget+2, e.target.valueAsNumber)
		this.setState({
			valuesScores: arr
		})
	}

	// for change state after update component
	static getDerivedStateFromProps(nextProps, prevState){
		function* putScoresTHead(n){
			for (let index = 0; index < n; index++){
				if(typeof(nextProps.report.data.thead[index].max) == "number")
					yield nextProps.report.data.thead[index].max
				else
					yield null
			}
		}
		if(nextProps.report.data.thead.length !== prevState.valuesScores.length)
			return {valuesScores: [...putScoresTHead(
					nextProps.report.data.xlsx.columns.length || 0
				)]
			}
	}

	// this method calls when render() has called
	componentDidUpdate(prev){

		/*
		*
		* This is old aproach
		* but new way - static getDerivedStateFromProps
		*
		*/
		// const self = this

		// function* putScoresTHead(n){
		// 	for (let index = 0; index < n; index++){
		// 		yield self.props.report.data.thead[index].max || null
		// 	}
		// }
		// if(this.state.valuesScores.length === 0 &&
		// 	this.props.report.data.thead.length !== 0 &&
		// 	this.props.report.typeReport === "ch")
		// 	this.setState({valuesScores: [...putScoresTHead(
		// 			this.props.report.data.xlsx.columns.length || 0
		// 		)]
		// 	})
		// console.log(prev, this.props)

		// eslint-disable-next-line react/no-direct-mutation-state
		this.state.targetsNames = 
			Array(this.props.report.data.xlsx.data.length).fill(null)
	}

	// This function is required for concat two arrays 
	// (from state and from changes) and returns value from this concat array
	concatChanges(row, col){
		if(this.props.changes.length > 0){
			for (let i = this.props.changes.length - 1; i >= 0; i--) {
				let item = this.props.changes[i]
				// if(!!item.allCol && item.col == col) return item.value // for all col
				if(item.row === row && item.col === col) return item.value
			}
		}
		return this.props.report.data.xlsx.data[row][col]
	}

	// The next code is required for reallocation scores between parts and other
	// cols, which contains "max" key in their object
	functionReallocation(index, value){
		const MAX_VALUE 	= 100
		const STEP 			= 5
		const thead = this.props.report.data.thead
		const countParts = this.props.report.data.meta.countParts
		const startParts = this.props.report.data.meta.startParts
		const indexesParts = [...Array(countParts + startParts).keys()]
			.filter(item => item >= startParts && item !== index)
		
		const indexExam 	=  countParts + startParts + 2

		var values = this.state.valuesScores

		if (index === indexExam){
			let localIndexFixed = Math.floor(value / STEP) % countParts
			let localValueFixed = MAX_VALUE - 
			indexesParts
				.filter(item => item !== indexesParts[localIndexFixed])
				.reduce((acc, cur) => acc += thead[cur].max, 0) - value
	
			values[indexesParts[localIndexFixed]] = localValueFixed
			this.props.changeMaxThead(indexesParts[localIndexFixed], localValueFixed)
	
			this.setState({valuesScores: values})
		} else {

			let getLocalIndexFixed = (val) => Math.floor(value / STEP) % (countParts - 1)
			let getLocalValueFixed = (ind) => MAX_VALUE - values[indexExam] - 
				indexesParts
					.filter(item => item !== indexesParts[ind])
					.reduce((acc, cur) => acc += thead[cur].max, 0) - value

			let localIndexFixed = getLocalIndexFixed(value)
			let localValueFixed = getLocalValueFixed(localIndexFixed)
					
			console.log(indexesParts[localIndexFixed], localValueFixed)
			values[indexesParts[localIndexFixed]] = localValueFixed
			this.props.changeMaxThead(indexesParts[localIndexFixed], localValueFixed)
	
			this.setState({valuesScores: values})
			// while(localValueFixed < 0){
			// 	localIndexFixed = getLocalIndexFixed(value)
			// 	localValueFixed = getLocalValueFixed((localIndexFixed + 1) % (countParts - 1))
			// }
			// console.log(indexesParts[localIndexFixed], localValueFixed)
			// console.log(countParts, startParts, indexesParts, localIndexFixed, localValueFixed)

			// if(localValueFixed < 0){
			// 	console.log("1. < 0", indexesParts[localIndexFixed])
			// 	localIndexFixed = (localIndexFixed + 1) % indexesParts.length
			// 	(indexesParts[localIndexFixed] === index) && (localIndexFixed = (localIndexFixed + 1) % indexesParts.length)
			// 	console.log("2. < 0", indexesParts[localIndexFixed])
			// }else{
				
			// }


			
		}
		
	}

	// Return array with colors (and contains priority colors) depending on the
	// col, row and value
	indicationItem(row, col, value){
		const color = []
		const curCol = this.props.report.data.meta.curCol
		const firstCol = this.props.report.data.meta.firstCol
		// const headmanRowIndex = this.props.report.data.meta.headmanRow || 0
		const thead = this.props.report.data.thead
		const countParts = this.props.report.data.meta.countParts || 2
		const startParts = this.props.report.data.meta.startParts || 2
		const MAX_VALUE = 100
		const coff = 0.6
		// default consts for types report

		// Att type
		const minProcent = MAX_VALUE * coff
		const procentIndex = 3

		// Score type
		const averageIndex = 2
		const minScore = MAX_VALUE * coff

		// Ch type -> chain indexed counts
		const indexesParts = [...Array(countParts + startParts).keys()]
			.filter(item => item >= startParts)

		const indexSummParts = indexesParts[indexesParts.length - 1] + 1
		const indexAtt = indexSummParts + 1
		const indexExam = indexAtt + 1
		const indexEnd = indexExam + 1

		const minSummParts = indexesParts.reduce((acc, cur) =>
			acc += thead[cur].max, 0) * coff
		const minExam = thead[indexExam].max * coff
		const minEnd = minSummParts + minExam


		function sortByThenBy(arr, props) {
			// apply custom sort function on array
			return arr.sort(function(a, b) {
			  // generate compare function return value by 
			  // iterating over the properties array
			  return props.reduce(function(bool, k) {
				 // if previous compare result is `0` then compare
				 // with the next property value and return result
				 return bool || (a[k] - b[k]);
				 // set initial value as 0
			  }, 0);
			})
		}

		switch(this.props.report.typeReport){
			case "score":
				if(col < curCol && col >= firstCol) color.push(this.colors.greyWhite)
				if(col === curCol) color.push(this.colors.greyBlack)
				if(col === averageIndex && +value >= minScore) color.push(this.colors.green)
				if(col === averageIndex && +value < minScore) color.push(this.colors.red)
				break
			case "att":
				if(col < curCol && col >= firstCol) color.push(this.colors.greyWhite)
				if(col === curCol) color.push(this.colors.greyBlack)
				if(col === procentIndex && +value >= minProcent) color.push(this.colors.green)
				if(col === procentIndex && +value < minProcent) color.push(this.colors.red)
				break
			// case "ch":
			case "ch":
			// eslint-disable-next-line no-lone-blocks
			{
				for (var indexPart = 0; indexPart < indexesParts.length; indexPart++) {
					switch(col){
						case indexesParts[indexPart]:
							if(+value === 0){color.push(this.colors.transparent); break;}
							if(+value < thead[indexesParts[indexPart]].max * coff) color.push(this.colors.red)
							if(+value >= thead[indexesParts[indexPart]].max * coff) color.push(this.colors.green)
							break
						case indexSummParts:
							if(+value === 0){color.push(this.colors.transparent); break;}
							if(+value < minSummParts) color.push(this.colors.red)
							if(+value >= minSummParts) color.push(this.colors.green)
							break
						case indexExam:
							if(+value === 0){color.push(this.colors.transparent); break;}
							if(+value < minExam) color.push(this.colors.red)
							if(+value >= minExam) color.push(this.colors.green)
							break
						case indexEnd:
							if(+value === 0){color.push(this.colors.transparent); break;}
							if(+value < minEnd) color.push(this.colors.red)
							if(+value >= minEnd) color.push(this.colors.green)
							break
						default:
							break
					}
				}
			};break
			default:
				break
		}
		return this.props.report.edit.indicate? sortByThenBy(color, ["priority"]) : []
	}

	// The next code returns max value or default value depending on the values
	// cols, which contains "max" key
	calcMaxValue(col){
		const thead = this.props.report.data.thead
		const countParts = this.props.report.data.meta.countParts || 2
		const startParts = this.props.report.data.meta.startParts || 2

		const MAX_VALUE = 100
		const indexesParts = [...Array(countParts + startParts).keys()]
			.filter(item => item >= startParts)
		const indexSummParts = indexesParts[indexesParts.length - 1] + 1
		const indexAtt = indexSummParts + 1
		const indexExam = indexAtt + 1
		const indexEnd = indexExam + 1
		const indexECTS = indexEnd + 1

		switch(col){
			case indexSummParts:
				return indexesParts.reduce((acc, cur) => acc += thead[cur].max, 0)
			case indexEnd:
				return MAX_VALUE
			case indexAtt:
				return "ch"
			case indexECTS:
				return "F-A"
			default:
				return null
		}
	}
	
	onShowPopUp(row){
		if(this.state.hoverAdditional && this.state.activeName === row)
			this.setState({ hoverAdditional: false })
		else
			this.setState({ activeName: row, hoverAdditional: true })
	}

	deleteStudent(){
		if(window.confirm("Вы уверены? Данные о студенте будут утеряны.")) 
			this.props.deleteStudent(this.state.activeName)
	}

	addStudent(name){
		this.props.addStudent(name)
		this.inputAddStudent.value = ""
	}

	initTd(ref, index, maxValue){
		// eslint-disable-next-line react/no-direct-mutation-state
		this.state.targetsThead[index-2] = ref
		// eslint-disable-next-line react/no-direct-mutation-state
		// this.state.valuesScores[index-2] = maxValue
	}
	render() {
		return (
			<div className="table-wrap">

				{/* Pop-up for change range scores */}
				<Overlay
					show={this.state.showTT}
					target={this.state.targetsThead[this.state.activeTarget]}
					placement="bottom"
					containerPadding={20}
					>
					<Popover 
						id="popover-contained" 
						onMouseEnter={e => this.setState({ showTT: true })} 
						onMouseLeave={e => this.setState({ showTT: false })}>
						<Popover.Title as="h3">Изменение границы оценок</Popover.Title>
						<Popover.Content>
							<input type="range" 
								value={this.state.valuesScores[this.state.activeTarget+2]} 
								class="form-control-range" 
								id="formControlRange" min="0" max="50" step="5" 
								onChange={e => this.changeRange(e)}/>
						</Popover.Content>
					</Popover>
				</Overlay>

				{/* Pop-up for actions student */}
				<Overlay
					show={this.state.hoverAdditional}
					target={this.state.targetsNames[this.state.activeName]}
					placement="right"
					containerPadding={20}
					variant="dark"
					>
					<Popover id="popover-contained" 
						onMouseLeave={e => this.setState({ hoverAdditional: false })}>
						<Popover.Title as="h3">Actions</Popover.Title>
						<Popover.Content>
							<div className="wrap-body-popup">
								<Button variant="danger" 
									onClick={e => this.deleteStudent()}>Delete row</Button>
								<Button variant="info" 
									onClick={e => 
										this.props.markAsHeadman(this.state.activeName)
									}>Mark as headman</Button>

							</div>
						</Popover.Content>
					</Popover>
				</Overlay>


				<div className="TABLE table-wrapper-scroll-x my-custom-scrollbar">
					<PanelReport
						typeEdit="report"
						name={this.props.name}
						groups={this.props.groups}
						subjects={this.props.subjects}
						compactSchedule={this.props.compactSchedule}
					/>
					<Table striped bordered hover style={{width: "100vw"}} variant="dark" >
					  <thead>
					    <tr>
					    	{
					    		this.props.report.data.thead.map((el, index) => {
										switch(this.props.report.typeReport){
											case "att":
												if(index > 3)
													return <th 	onClick={e => this.pickAllCol(index)} 
																	style={{cursor: "pointer"}} 
																	title="Нажмите, чтобы заполнить весь столбец">
																<span className="itemTH">{`${this.filterTime(el.name, index)}`}</span>
															</th>
												else return <th><span>{el.name}</span></th>
											case "score":
												if(index > 2)
													return <th>
																<span className="itemTH">{`${this.filterTime(el.name, index)}`}</span>
															</th>
												else return <th><span>{el.name}</span></th>
											case "ch":
												if(index < 2)
													return <th><span className="itemTH">{el.name}</span></th>
												else
													return <th 	onMouseEnter={e => 
																		typeof(this.state.valuesScores[index]) === "number"  && this.setState(
																			{ activeTarget: index-2, showTT: true }
																		)
																	}
																	onMouseLeave={e => 
																		typeof(this.state.valuesScores[index]) === "number" && 
																		this.setState({ showTT: false })
																	} 
																	
																	ref={th => this.initTd(th, index, el.max)}>
																<div 	className="wrapTd" 
																		style={
																			{display: "flex", 
																			alignItems: "center", 
																			flexDirection: "column"
																		}}>

																	{(this.props.template.isEdit && el.keyName === "part") && 
																	<button className="btn btn-danger" onClick={e => this.props.deletePart(index)}>x</button>}

																	<span className="itemTH">
																		{el.name}
																		{typeof(this.state.valuesScores[index]) !== "object" ?
																			<span style={{color: "#007bff"}}>
																				({this.state.valuesScores[index]})
																			</span>: 
																			<span style={{color: "var(--global-color-green)"}}> 
																				{`(${!!this.calcMaxValue(index)?
																					this.calcMaxValue(index):
																					""})`}
																			</span>}
																	</span>
																</div>
														</th>
											default:
												break
										}
										return (<></>)
									}
								)
					    	}
							{
								(this.props.template.isEdit && this.props.report.typeReport === "ch") &&  <tr>
									<td>
										<button className="btn btn-success" onClick={e => this.props.addPart()}>Add part</button>
									</td>
								</tr>
						  }
					    </tr>
					  </thead>
					  <tbody>
						  {
						  	this.props.report.data.xlsx.data.map((row, Irow) => 
						  		<tr>
							  		{
							  			row.map((col, Icol) => 
										  <ItemTable 
												row={Irow} 
												col={Icol}
												onShowPopUp={this.onShowPopUp.bind(this)}
												headman={Irow === this.props.report.data.meta.headmanRow}
												// eslint-disable-next-line react/no-direct-mutation-state
												_ref={el => Icol === 1? this.state.targetsNames[Irow] = el: null}
												value={this.concatChanges(Irow, Icol)} 
												type={this.props.report.data.thead[Icol].type || "string"}
												enable={this.props.report.data.thead[Icol].enable} 
												maxValue={this.state.valuesScores[Icol]}
												indication={this.indicationItem(Irow, Icol, this.concatChanges(Irow, Icol))}
											/>
										)
							  		}
						  		</tr>
						  	)
						  }
						  {
								this.props.template.isEdit?
									<tr>
										<td><button 
												className="btn btn-primary button_newStudent"
												onClick={e => 
													this.setState({ 
														editNewStudent: !this.state.editNewStudent })
										}>{!this.state.editNewStudent? "+": "-"}</button></td>
										{
											this.state.editNewStudent?
												<td><input 	
														className="form-control"
														type="text" 
														ref={inp => this.inputAddStudent = inp}
														onKeyPress={e => 
															e.key === "Enter" && this.addStudent(e.target.value)}/></td>:
												<></>
										}
									</tr>:
									<></>

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
	changes: state.report.edit.changes,
	template: state.report.template
})
const mapDispatchToProps = dispatch => ({
	changeTypeReport: type => dispatch(changeTypeReport(type)),
	addChangeToReport: change => dispatch(addChangeToReport(change)),
	fullUpdate: table => dispatch(fullUpdate(table)),
	backChange: () => dispatch(backChange()),

	addPart: () => dispatch(template__addPart()),
	deletePart: col => dispatch(template__deletePart(col)),
	addStudent: name => dispatch(template__addStudent(name)),
	deleteStudent: row => dispatch(template__deleteStudent(row)),
	markAsHeadman: row => dispatch(template__markAsHeadman(row)),
	changeMaxThead: (col, value) => dispatch(changeMaxThead(col, value))
})

export default connect(mapStateToProps, mapDispatchToProps)(Report)