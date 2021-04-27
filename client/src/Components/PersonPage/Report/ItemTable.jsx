import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addChangeToReport, changeStateEdit, showNotification } from '../../../redux/actions';

const AttItem = (props) => {
	return(
		<td 
			className="main" 
			style={props.col == 1 ? 
				{width: "320px", display: "block", height: "100%"}: 
				{width: "40px", textAlign: "center", cursor: "pointer"}
			} 
			onClick={props.activeItemTable}
		>
			<span 
				className="item-data" 
				style={props.col > 3 ? (props.value == "+"? {color: "green"} : {color: "red"}) : {}}
			>
				{props.value}
			</span>
		</td>
	)
}


const ScoreItem = props => {
	if(!props.activeState){
		return (<td 
			className={props.col > 2? "main time" : "main"} 
			style={props.col == 1 ? 
				{width: "320px", display: "block", height: "100%"}: 
				{width: "50px"}} 
			onClick={props.activeItemTable}
		>
			<span>
				{props.value}
			</span>
		</td>
		)
	}
	else {
		return (
			<td className="main" style={{width: "50px", padding: 0, color: "red"}}>
				<input 
					autoFocus 
					ref={input => props.textInput(input)} 
					type="text" 
					onKeyDown={props.pressKey} 
					defaultValue={props.value} 
					className="item-data"
				/>
				<button onClick={props.exitLabel}>X</button>
			</td>
		)
	}
}


const ChItem = props => {
	if(!props.activeState){
		return (<td 
			className={props.col > 1? "main time" : "main"} 
			style={props.col == 1 ? 
				{width: "320px", display: "block", height: "100%"}: 
				{width: "50px"}} 
			onClick={props.activeItemTable}
		>
			<span>
				{props.value}
			</span>
		</td>
		)
	}
	else {
		return (
			<td className="main" style={{width: "50px", padding: 0, color: "red"}}>
				<input 
					autoFocus 
					ref={input => props.textInput(input)} 
					type="text" 
					onKeyDown={props.pressKey} 
					defaultValue={props.value} 
					className="item-data"
					style={props.errorValue? {border: "2px solid red"}: {border: "2px solid transparent"}}
				/>
				<button onClick={props.exitLabel}>X</button>
			</td>
		)
	}
}



class ItemTable extends Component {
   constructor(props) {
      super(props);
      this.state = { 
			activeRow: this.props.row,
			activeCol: this.props.col,  
			activeState: false,
			errorValue: false
		};
		// new Ref for extraction value from input and focus on that
		this.textInput = React.createRef();
   }
	setValue(value){
		this.setState({ value: value });
		this.props.addChange({
			col: this.state.activeCol,
			row: this.state.activeRow,
			value: value
		})
	}
	activeItemTable(e){
		// Опять же задаем вручную константы значений, которые показывают с какого столбца возможно редактирование
		const enableEditAtt 		= 3
		const enableEditScore 	= 3
		const enableEditCh 		= 2

		switch(this.props.report.typeReport){
			case "att":
				// Заглушка пока что, потому что не приходят мета данные, которые бы помогали понимать, что столбец можно радактировать
				// считаем, что editColMin: 3 (col > 3 - можно редактировать)
				if(this.props.col >= enableEditAtt){
					// if this field is empty then we can put uniquely value -> "+"
					if(this.props.value == ""){
						this.setValue("+")
					}
					else{
						this.setValue("")
					}
				}
				return
			case "score":
				if(this.props.col <= 100 && !this.props.repedit.isEdit){
					this.setState({ activeState: true })
					this.props.activate()
				}
				return
			case "ch":
				if(this.props.col >= enableEditCh && !this.props.repedit.isEdit){
					this.setState({ activeState: true })
					this.props.activate()
				}
				return
		}
	}
	pressKey(e){
		if(e.key == "Enter"){
			if(!!e.target.value){
				if(Number.isInteger(+e.target.value)){
					if(+e.target.value > this.props.maxValue || +e.target.value < 0){
						this.setState({ errorValue: true })
						this.onError()
					}
					else{
						this.setState({
							value: +e.target.value,
							activeState: false,
							errorValue: false
						})
						this.props.activate()
						this.props.addChange({
							col: this.state.activeCol,
							row: this.state.activeRow,
							value: +e.target.value
						})
					}
				}
				else{
					this.setState({
						value: e.target.value,
						activeState: false
					})
					this.props.activate()
					this.props.addChange({
						col: this.state.activeCol,
						row: this.state.activeRow,
						value: e.target.value
					})
				}

			}
			else{
				this.setState({ activeState: false })
				this.props.activate()
			}
		}
	}
	exitLabel(){
		this.setState({ activeState: false })
		this.props.activate()
	}
	onError(){
		this.props.showNotification({
			title: `Ошибка`,
			content: "Значение не может больше ее предела или меньше нуля",
			type: "error",
			autohide: true
		})
	}
   render() {
		switch(this.props.typeReport){
			case "att":
				return <AttItem activeItemTable={this.activeItemTable.bind(this)} col={this.props.col} value={this.props.value} />;
			case "score":
				return <ScoreItem 
					activeState={this.state.activeState}
					col={this.props.col}
					value={this.props.value}
					textInput={input => this.textInput = input}
					activeItemTable={this.activeItemTable.bind(this)}
					pressKey={this.pressKey.bind(this)}
					exitLabel={this.exitLabel.bind(this)}
				/>
			case "ch":
				return <ChItem 
					activeState={this.state.activeState}
					col={this.props.col}
					value={this.props.value}
					errorValue={this.state.errorValue}
					textInput={input => this.textInput = input}
					activeItemTable={this.activeItemTable.bind(this)}
					pressKey={this.pressKey.bind(this)}
					exitLabel={this.exitLabel.bind(this)}
					onError={this.onError.bind(this)}
				/>
		}
		
   }
}

const mapStateToProps = state => ({
	report: state.report,
	repedit: state.report.edit,
	typeReport: state.report.typeReport
})
const mapDispatchToProps = dispatch => ({
	activate: () => dispatch(changeStateEdit()),
	addChange: change => dispatch(addChangeToReport(change)),
	showNotification: not => dispatch(showNotification(not))
})

export default connect(mapStateToProps, mapDispatchToProps)(ItemTable)