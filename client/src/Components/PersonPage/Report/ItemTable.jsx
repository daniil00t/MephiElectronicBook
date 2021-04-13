import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addChangeToReport, changeStateEdit } from '../../../redux/actions';

class ItemTable extends Component {
   constructor(props) {
      super(props);
      this.state = { 
			activeRow: this.props.row,
			activeCol: this.props.col,  
			activeState: false,
			value: this.props.value
		};
		this.textInput = React.createRef();
   }
	activeItemTable(e){
		if(this.props.col > 3){
			if(this.props.typeReport != "att"){
				if(!this.props.repedit.isEdit){
					this.setState({
						activeState: true
					});
					this.props.activate()
				}
			}
			else{
				if(this.state.value == "+" || this.state.value == "-"){
					this.setState({
						value: this.state.value == "-" ? "+" : "-",
					});
					this.props.addChange({
						col: this.state.activeCol,
						row: this.state.activeRow,
						value: this.state.value == "-" ? "+" : "-"
					})
				}else{
					this.setState({
						value: "+",
					});
					this.props.addChange({
						col: this.state.activeCol,
						row: this.state.activeRow,
						value: "+"
					})
				}
			}
		}
	}
	componentDidMount(){
		if(this.state.activeState){
			this.textInput.current.focus()
		}
	}
	updateObject(baseObject, appendObject){
		return Object.assign({}, baseObject, appendObject);
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
				this.setState({
					activeState: false
				})
				this.props.activate()
			}
			
		}
	}
	exitLabel(){
		this.setState({
			activeState: false
		})
		this.props.activate()
	}
   render() {
		switch(this.props.typeReport){
			case "att":
				return (<td className="main" style={this.props.col == 3 ? {width: "320px", display: "block", height: "100%"} : {width: "40px", textAlign: "center", cursor: "pointer"}} onClick={this.activeItemTable.bind(this)}><span className="item-data" style={this.props.col > 3 ? (this.state.value == "+"? {color: "green"} : {color: "red"}) : {}}>{this.state.value}</span></td>);
			case "score":
				if(!this.state.activeState){
					return (<td  className={this.props.col > 3? "main time" : "main"} style={this.props.col == 3 ? {width: "320px", display: "block", height: "100%"} : {width: "50px"}} onClick={this.activeItemTable.bind(this)}><span>{this.state.value}</span></td>);
				}else{
					return (<td className="main" style={{width: "50px", padding: 0, color: "red"}}><input autoFocus ref={input => this.textInput = input} type="number" onKeyDown={this.pressKey.bind(this)} defaultValue={this.state.value} className="item-data"/><button onClick={this.exitLabel.bind(this)}>X</button></td>);
				}
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