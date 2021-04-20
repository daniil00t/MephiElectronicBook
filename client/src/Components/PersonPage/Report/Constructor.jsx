import React, { Component } from 'react'
import { Table, ButtonGroup, ToggleButton, Overlay, Popover } from "react-bootstrap"
import PanelReport from "./PanelReport"

// connect to redux
import { connect } from "react-redux"
import { getReport, changeTypeReport } from '../../../redux/actions'

class Constructor extends Component {
	constructor(props) {
		super(props)
		this.state = {
			/* 
			* main data which will be able to recieve to server in the future
			* but this needed upgrade: replace string to object -> "ФИО" -> {name: "ФИО", type: "number", maxValue: 50}
			* then when we would render data we can write "ФИО[number] (50)"
			*/
			thead: ["№", "ФИО"],
			test: ["студ #", "Иванов Иван Иванович", "", "", "", "", "", "", "", ""],
			stateEdit: false,
			showTT: true,
			targetPointer: null
		}
		this.inputRef = React.createRef()
		this.inputRefNumber = React.createRef()
	}
	range(start, end) {
		return Array.from({ length: end - start }, (_, i) => i)
	}
	addTheadItem(name){
		this.setState({
			stateEdit: !this.state.stateEdit,
			thead: [...this.state.thead,  
				{
					name: name,
					type: "text",
					enable: true,
					formula: ""
				}
			],
			test: [...this.state.test, ""],
		})
	}
	changeEditState(){
		this.setState({ stateEdit: !this.state.stateEdit })
	}
	addTheadKey(e){
		if(e.key == "Enter")
			this.addTheadItem(this.inputRef.value)
	}
	componentDidMount(){
		this.props.changeTypeReport("ch")
		this.setState({ thead: this.props.thead })
	}
   render() { 
		return ( 
			<div style={{width: "100%", padding: "20px 30px"}}>
				<PanelReport
					typeEdit="constructor"
					name={this.props.name}
					groups={this.props.groups}
					subjects={this.props.subjects}
					compactSchedule={this.props.compactSchedule}
				/>
				{
					this.props.thead.length > 0?
						<Table striped bordered hover style={{width: "80vw"}}>
						<thead>
							<tr>
								{
									this.props.thead.map((item, index) => <th>{item}</th>)
								}
								{
									!this.state.stateEdit?
										(
											<th>
												<button style={{width: "70px"}} onClick={e => this.changeEditState(e)}>+</button>
											</th>
										):
										(
											<th>
												<input 
													autoFocus 
													type="text" 
													placeholder="name column"
													ref={input => (this.inputRef = input)} 
													onKeyPress={e => this.addTheadKey(e)}
												/>
												<button onClick={e => this.addTheadItem(this.inputRef.value)}>Add</button>
												<Overlay
													show={this.state.showTT}
													target={this.state.targetPointer}
													placement="bottom"
													containerPadding={20}
													
													>
													<Popover id="popover-contained">
														<Popover.Title as="h3">Дополнительные настройки</Popover.Title>
														<Popover.Content>
														<ButtonGroup toggle>
															{["text", "number", "choose"].map((radio, idx) => (
																<ToggleButton
																	variant="light"
																	key={idx}
																	type="radio"
																	name="radio"
																	value={radio}
																	checked={false}
																	onChange={(e) => console.log(e)}
																> 
																	{radio}
																</ToggleButton>
															))}
														</ButtonGroup>
														<label>
															<input type="checkbox" />
															Enable
														</label>
														<input 
															// autoFocus 
															type="number" 
															placeholder="max value"
															ref={input => (this.inputRefNumber = input)} 
															// onKeyPress={e => this.changeEditStateKey(e)}
														/>
														</Popover.Content>
													</Popover>
												</Overlay>
											</th>
										)
								}
								
							</tr>
						</thead>
						<tbody>
							{
								this.range(0, 5).map(i => {
									return(
										<tr>
											{
												this.state.test.map(item => {
													return <td>{item}</td>
												})
											}	
										</tr>
									)
								})
							}
						</tbody>
					</Table>:
					<></>
				}
				
			</div>
		);
	}
}
 

const mapDispatchToProps = dispatch => ({
	getThead: () => dispatch(getReport()),
	changeTypeReport: type => dispatch(changeTypeReport(type))
})

const mapStateToProps = state => ({
	thead: state.report.data.thead
})
export default connect(mapStateToProps, mapDispatchToProps)(Constructor);