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
			value: this.props.value || "" 
		};
		this.textInput = React.createRef();
   }
	activeItemTable(e){
		if(!this.props.repedit.isEdit){
			this.setState({
				activeState: true
			});
			this.props.activate()
			
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
			this.setState({
				value: e.target.value,
				activeState: false
			});
			this.props.activate()
			this.props.addChange({
				col: this.state.activeCol,
				row: this.state.activeRow,
				value: e.target.value
			})
			let nowState = this.updateObject(this.state, {
				value: e.target.value
			})
		}
	}
	exitLabel(){
		this.setState({
			activeState: false
		})
		this.props.activate()
	}
   render() {
		if(!this.state.activeState){
			return (<td onClick={this.activeItemTable.bind(this)}><span className="item-data">{this.state.value}</span></td>);
		}else{
			return (<td><input ref={this.textInput} onKeyDown={this.pressKey.bind(this)} type="text" defaultValue={this.state.value} className="item-data"/><button onClick={this.exitLabel.bind(this)}>X</button></td>);
		}
   }
}

const mapStateToProps = state => ({
	repedit: state.report.edit
})
const mapDispatchToProps = dispatch => ({
	activate: () => dispatch(changeStateEdit()),
	addChange: change => dispatch(addChangeToReport(change))
})

export default connect(mapStateToProps, mapDispatchToProps)(ItemTable)