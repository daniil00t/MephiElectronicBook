import React, { Component } from 'react'
import { Table, ButtonGroup, ToggleButton } from "react-bootstrap"

class Constructor extends Component {
	constructor(props) {
		super(props)
		this.state = {
			// main data which will be able to recieve to server in the future
			// but this needed upgrade: replace string to object -> "ФИО" -> {name: "ФИО", type: "number", maxValue: 50}
			// then when we would render data we can write "ФИО[number](50)"
			thead: ["№", "ФИО"],
			test: [`студ #`, "Иванов Иван Иванович", ""],
			newColIndex: 2,
			stateEdit: false
		}
		this.inputRef = React.createRef()
		this.inputRefNumber = React.createRef()
	}
	range(start, end) {
		return Array.from({ length: end - start }, (_, i) => i)
	}
	changeEditState(){
		this.setState({
			stateEdit: !this.state.stateEdit
		})
		// this.inputRef.current.focus()
	}
	changeEditStateKey(e){
		if(e.key == "Enter")
			this.setState({
				stateEdit: !this.state.stateEdit,
				thead: [...this.state.thead, this.inputRef.value + "("+ this.inputRefNumber.value +")"],
				test: [...this.state.test, ""],
			})
	}
   render() { 
		return ( 
			<div>
				<Table striped bordered hover style={{width: "80vw"}}>
					<thead>
						<tr>
							{
								this.state.thead.map((item, index) => <th>{item}</th>)
							}
							{
								!this.state.stateEdit?
									(
										<th>
											<button onClick={e => this.changeEditState(e)}>+</button>
										</th>
									):
									(
										<th>
											<input 
												autoFocus 
												type="text" 
												placeholder="name column"
												ref={input => (this.inputRef = input)} 
												onKeyPress={e => this.changeEditStateKey(e)}
											/>
											<ButtonGroup toggle>
												{["text", "number"].map((radio, idx) => (
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
											<input 
												// autoFocus 
												type="number" 
												placeholder="max value"
												ref={input => (this.inputRefNumber = input)} 
												// onKeyPress={e => this.changeEditStateKey(e)}
											/>
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
				</Table>
			</div>
		);
	}
}
 
export default Constructor;