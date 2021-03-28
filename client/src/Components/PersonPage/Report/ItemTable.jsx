import React, { Component } from 'react';

export default class ItemTable extends Component {
   constructor(props) {
      super(props);
      this.state = { 
			activeRow: this.props.row || -1,
			activeCol: this.props.col || -1,  
			activeState: false,
			value: this.props.value || "" 
		};
		this.emmiter = this.props.emmiter;
   }
	activeItemTable(e){
		console.log(this);
		this.setState({
			activeState: true
		});
	}
	updateObject(baseObject, appendObject){
		return Object.assign({}, baseObject, appendObject);
	}
	pressKey(e){
		if(e.key == "Enter"){
			this.setState({
				value: e.target.value,
				activeState: false
			});
			let nowState = this.updateObject(this.state, {
				value: e.target.value
			})
			this.emmiter.emit("changeReport", {type: "bool", state: true, col: nowState.activeCol, row: nowState.activeRow, value: nowState.value});
			console.log({col: this.state.activeCol, row: this.state.activeRow, value: this.state.value});
		}
	}
	exitLabel(){
		this.setState({
			activeState: false
		})
	}
   render() {
		if(!this.state.activeState){
			return (<td onClick={this.activeItemTable.bind(this)}><span className="item-data">{this.state.value}</span></td>);
		}else{
			return (<td><input onKeyDown={this.pressKey.bind(this)} type="text" defaultValue={this.state.value} className="item-data"/><button onClick={this.exitLabel.bind(this)}>X</button></td>);
		}
   }
}