import React from "react"
import { ButtonGroup, ToggleButton } from "react-bootstrap"
import { connect } from "react-redux"
import * as CONFIG from "../../../config.json"
import { 
   changeTypeReport, 
   changeSubject, 
   changeGroup, 
   changeTypeSubject,
   getReport
} from "../../../redux/actions"

const SubjectToGroup = (props) => {
   const subjects = props.schedule.subjectToGroup.reduce((acc, cur) => {
      return [...acc, cur.name]
   }, [])
   var types = []

   if (props.report.subject != ""){
      var indexSubject = subjects.indexOf(props.report.subject)
      var groups = props.schedule.subjectToGroup[indexSubject].groups.reduce((acc, cur) => {
         return [...acc, cur]
      }, [])
   
      
      var type = props.report.typeSubject
      types = props.schedule.subjectToGroup[indexSubject].types
      // if(props.report.typeSubject == "undefined"){
      // }
   }
   else{
      var indexSubject = -1
      var groups = []
   }

   
   console.log("UPDATE")
   props.dispatcher.getReport(props.nameTeacher)
   // console.log("sdfsdfsdf", props.dispather.changeSubject)
   return (
      <div className="subjectToGroup">
         <select className="form-control subjects" onChange={e => props.dispatcher.changeSubject(subjects[+e.target.value])}>
            <option value={-1}>Выберете предмет</option>
            {
               subjects.map((el, index) => 
                  index == indexSubject ?
                  <option selected value={index}>{`${el} ${types.length > 0 ? `[${types}]` : `${type}`}`}</option> :
                  <option value={index}>{`${el} ${types.length > 0 ? `[${types}]` : `${type}`}`}</option>
               )
            }
         </select>
         {
            types.length != 0 ?
               (
                  <select className="form-control types" onChange={e => props.dispatcher.changeTypeSubject(e.target.value)}>
                     <option value={-1}>Тип</option>
                     {
                        types.map((type, index) => <option value={type}>{type}</option>)
                     }
                  </select>
               ):
               (<></>)
         }
         
         <select className="form-control groups" onChange={e => props.dispatcher.changeGroup(e.target.value)}>
            <option value={-1}>Выберите группу</option>
            {
               groups.map((el, index) => 
                  el == props.report.group ?
                  <option selected value={el}>{el}</option> :
                  <option value={el}>{el}</option>
               )
            }
         </select>
      </div>
   )
}
const GroupToSubject = (props) => {
   const groups = props.schedule.groupToSubject.reduce((acc, cur) => {
      return [...acc, cur.group]
   }, [])
   var types = []
   if (props.report.subject != "" && props.report.group != ""){
      var indexGroup = groups.indexOf(props.report.group)
      var subjects = props.schedule.groupToSubject[indexGroup].subjects.reduce((acc, cur) => {
         return [...acc, cur]
      }, [])
   
      if(Array.isArray(props.report.types)){
         const types = props.report.types
      }else{
         const type = props.report.types
      }

      
      var type = props.report.typeSubject
      if(props.report.typeSubject == "undefined"){
         types = props.schedule.groupToSubject[indexGroup].types
      }
   }
   else{
      var indexGroup = -1
      var subjects = []
   }
   

   return (
      <div className="subjectToGroup">
         <select className="form-control subjects">
            {
               groups.map((el, index) => 
                  index == indexGroup ?
                  <option selected value={el}>{el}</option> :
                  <option value={el}>{el}</option>
               )
            }
         </select>
         {
            types.length != 0 ?
               (
                  <select className="form-control types">
                     <option value={-1}>Тип</option>
                     {
                        types.map((type, index) => <option value={type}>{type}</option>)
                     }
                  </select>
               ):
               (<></>)
         }
         <select className="form-control groups"> 
            <option value={-1}>Выберете предмет</option>
            {
               subjects.map((el, index) => 
                  el == props.report.subject ?
                  <option selected value={index}>{`${el} ${types.length > 0 ? `[${types}]` : `${type}`}`}</option> :
                  <option value={index}>{`${el} ${types.length > 0 ? `[${types}]` : `${type}`}`}</option>
               )
            }
         </select>
      </div>
   )
}

class PanelReport extends React.Component{
   constructor(props){
      super(props)
   }

   componentDidMount(){
      console.log("UPDATE")
      this.props.getReport(this.props.nameTeacher)
   }
   render(){
      return( 
         <div className="panelHeadTable">
            <div className="tableWrap">
               {
                  this.props.report.priority == "subjects" ? 
                     (<SubjectToGroup report={this.props.report} schedule={this.props.schedule} dispatcher={this.props} nameTeacher={this.props.nameTeacher}/>) :
                     (<GroupToSubject report={this.props.report} schedule={this.props.schedule}/>)
               }
               <ButtonGroup toggle>
                  {CONFIG.TYPES_REPORTS.map((radio, idx) => (
                     <ToggleButton
                        variant="light"
                        key={idx}
                        type="radio"
                        name="radio"
                        value={radio.alias}
                        checked={this.props.report.typeReport === radio.alias}
                        onChange={(e) => this.props.self.toggleTypeTable(e.currentTarget.value)}
                     > 
                        {radio.name}
                     </ToggleButton>
                  ))}
               </ButtonGroup>
               <button>Save</button>
            </div>
         </div>
      )
   }
}

const mapStateToProps = state => ({
   schedule: state.schedule,
   report: state.report,
   nameTeacher: state.GLOBAL.nameTeacher
})

const mapDispatchToProps = dispatch => ({
   changeSubject: subject => dispatch(changeSubject(subject)),
   changeGroup: group => dispatch(changeGroup(group)),
   changeTypeReport: type => dispatch(changeTypeReport(type)),
   changeTypeSubject: type => dispatch(changeTypeSubject(type)),
   getReport: nameTeacher => dispatch(getReport(nameTeacher))
})

export default connect(mapStateToProps, mapDispatchToProps)(PanelReport)