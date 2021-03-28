import React, { Component } from 'react'
import { Toast } from "react-bootstrap"
import { connect } from "react-redux"
import { closeNotification } from "../../redux/actions"

class Notification extends Component {
   constructor(props){
      super(props);
      this.state = {
         visible: props.visible
      };
   }
   handleClose(){
      this.props.closeNotification()
      this.setState({
         visible: false
      })
   }
   switcherType(type){
      switch(this.props.type) {
         case "warning": 
            return {
               backgroundColor: "yellow",
            }
         case "error":
            return {
               backgroundColor: "red",
               color: "white"
            }
         default:
            return {}
      }
   }

   render() {
      return ( 
         <div
            style={{
               position: 'fixed',
               bottom: "70px",
               right: "20px"
            }}
            >
            <Toast 
               show={this.props.visible} 
               onClose={this.handleClose.bind(this)} 
               // style={this.state.visible ? {display: "block"} : {display: "none"}}
               animation={true}
               delay={300}
               style={this.switcherType(this.props.type)}
               // autohide={true}
            >
               <Toast.Header>
               <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
               <strong className="mr-auto">{this.props.title}</strong>
               <small>{this.props.time}</small>
               </Toast.Header>
               <Toast.Body>{this.props.description}</Toast.Body>
            </Toast>
         </div>
       );
   }
}
 
const mapDispatchToProps = dispatch => ({
   closeNotification: () => dispatch(closeNotification())
})
export default connect(null, mapDispatchToProps)(Notification);