import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addChangeToReport, changeStateEdit } from '../../../redux/actions';

const AttItem = (props) => {
	return(
		<td 
			className="main" 
			style={props.col == 2 ? 
				{width: "320px", display: "block", height: "100%"}: 
				{width: "40px", textAlign: "center", cursor: "pointer"}
			} 
			onClick={props.activeItemTable}
		>
			<span 
				className="item-data" 
				style={props.col > 2 ? (props.value == "+"? {color: "green"} : {color: "red"}) : {}}
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
			style={props.col == 2 ? 
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
					type="number" 
					onKeyDown={props.pressKey} 
					defaultValue={props.value} 
					className="item-data"
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
			value: this.props.value
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
					if(this.state.value == ""){
						this.setValue("+")
					}
					else{
						this.setValue("")
					}
				}
				return
			case "score":
				if(this.props.col >= enableEditScore && !this.props.repedit.isEdit){
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
   render() {
		switch(this.props.typeReport){
			case "att":
				return <AttItem activeItemTable={this.activeItemTable.bind(this)} col={this.props.col} value={this.state.value} />;
			case "score":
				return <ScoreItem 
					activeState={this.state.activeState}
					col={this.props.col}
					value={this.state.value}
					activeItemTable={this.activeItemTable.bind(this)}
					textInput={input => this.textInput = input}
					pressKey={this.pressKey.bind(this)}
					exitLabel={this.exitLabel.bind(this)}
				/>
			case "ch":
				if(!this.state.activeState){
					return (<td  className={this.props.col > 1? "main time" : "main"} style={this.props.col == 1 ? {width: "320px", display: "block", height: "100%"} : {width: "50px"}} onClick={this.activeItemTable.bind(this)}><span>{this.state.value}</span></td>);
				}else{
					return (<td className="main" style={{width: "50px", padding: 0, color: "red"}}><input autoFocus ref={input => this.textInput = input} type="number" onKeyDown={this.pressKey.bind(this)} defaultValue={this.state.value} className="item-data"/><button onClick={this.exitLabel.bind(this)}>X</button></td>);
				}
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
	addChange: change => dispatch(addChangeToReport(change))
})

export default connect(mapStateToProps, mapDispatchToProps)(ItemTable)