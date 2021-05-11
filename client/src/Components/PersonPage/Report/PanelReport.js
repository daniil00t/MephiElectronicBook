import React from "react"
import { ButtonGroup, ToggleButton, Button } from "react-bootstrap"
import { connect } from "react-redux"
import * as CONFIG from "../../../config.json"
import { 
   changeTypeReport, 
   changeSubject, 
   changeGroup, 
   changeTypeSubject,
   getReport,
   saveReport,
   toggleTemplateEdit,
   toggleIndicate
} from "../../../redux/actions"

const SubjectToGroup = (props) => {
   const subjects = props.schedule.subjectToGroup.reduce((acc, cur) => {
      return [...acc, cur.name]
   }, [])
   var types = props.schedule.subjectToGroup.reduce((acc, cur) => {
      return [...acc, cur.types]
   }, [])
   var typesRender = []

   if (props.report.subject !== ""){
      var indexSubject = subjects.indexOf(props.report.subject)
      var groups = props.schedule.subjectToGroup[indexSubject].groups
      typesRender = types[indexSubject]
   }
   else{
      indexSubject = -1
      groups = []
   }
   return (
      <div className="subjectToGroup">
         <select className="form-control subjects" onChange={e => props.dispatcher.changeSubject(subjects[+e.target.value], props.schedule.subjectToGroup[+e.target.value].durations[0])}>
            <option value="">Выберете предмет</option>
            {
               subjects.map((el, index) => 
                  index === indexSubject ?
                  <option selected value={index}>{`${el} [${types[index] === "NONE_TYPE"? "Доп": types[index]}]`}</option> :
                  <option value={index}>{`${el} [${types[index] === "NONE_TYPE"? "Доп": types[index]}]`}</option>
               )
            }
         </select>
         {
            typesRender.length !== 0 ?
               (
                  <select className="form-control types" onChange={e => props.dispatcher.changeTypeSubject(e.target.value)}>
                     <option value="">Тип</option>
                     {
                        typesRender.map((type, index) => 
                           type === props.report.typeSubject ? 
                              (<option selected value={type}>{type === "NONE_TYPE"? "Доп": type}</option>):
                              (<option value={type}>{type === "NONE_TYPE"? "Доп": type}</option>)
                        )
                     }
                  </select>
               ):
               (<></>)
         }
         
         <select className="form-control groups" onChange={e => props.dispatcher.changeGroup(e.target.value)}>
            <option value="">Выберите группу</option>
            {
               groups.map((el, index) => 
                  el === props.report.group ?
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
   var types = props.schedule.groupToSubject.reduce((acc, cur) => {
      return [...acc, cur.types]
   }, [])

   var typesRender = []

   if (props.report.group !== ""){
      var indexGroup = groups.indexOf(props.report.group)
      var subjects = props.schedule.groupToSubject[indexGroup].subjects
      
      typesRender = types[indexGroup]
   }
   else{
      indexGroup = -1
      subjects = []
   }

   return (
      <div className="subjectToGroup">
         <select className="form-control subjects" onChange={e => props.dispatcher.changeGroup(e.target.value)}>
         <option value={undefined}>Выберите группу</option>
            {
               groups.map((el, index) => 
                  index === indexGroup ?
                  <option selected value={el}>{el}</option> :
                  <option value={el}>{el}</option>
               )
            }
         </select>
         {
            typesRender.length !== 0 ?
               (
                  <select className="form-control types" onChange={e => props.dispatcher.changeTypeSubject(e.target.value)}>
                     <option value={undefined}>Тип</option>
                     {
                        typesRender.map((type, index) => 
                           type === props.report.typeSubject ? 
                              (<option selected value={type}>{type === "NONE_TYPE"? "Доп": type}</option>):
                              (<option value={type}>{type === "NONE_TYPE"? "Доп": type}</option>)
                        )
                     }
                  </select>
               ):
               (<></>)
         }
         <select className="form-control groups" onChange={e => props.dispatcher.changeSubject(subjects[+e.target.value], props.schedule.subjectToGroup[+e.target.value].durations[0])}> 
            <option value={undefined}>Выберете предмет</option>
            {
               subjects.map((el, index) => 
                  index === indexGroup ?
                  <option selected value={index}>{`${el} [${types[index] === "NONE_TYPE"? "Доп": types[index]}]`}</option> :
                  <option value={index}>{`${el} [${types[index] === "NONE_TYPE"? "Доп": types[index]}]`}</option>
               )   
            }
         </select>
      </div>
   )
}

class PanelReport extends React.Component{
   // eslint-disable-next-line no-useless-constructor
   constructor(props){
      super(props)
   }
   loadReport(e){
      this.props.getReport(this.props.nameTeacher)
   }
   render(){
      return( 
         <div className="panelHeadTable">
            <div className="tableWrap">
               {
                  this.props.report.priority === "subjects" ? 
                     (<SubjectToGroup 
                        report={this.props.report} 
                        schedule={this.props.schedule} 
                        dispatcher={this.props} 
                        nameTeacher={this.props.nameTeacher}
                     />):
                     (<GroupToSubject 
                        report={this.props.report} 
                        schedule={this.props.schedule}
                        dispatcher={this.props} 
                        nameTeacher={this.props.nameTeacher}
                        />)
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
                        onChange={(e) => this.props.changeTypeReport(e.currentTarget.value)}
                     > 
                        {radio.name}
                     </ToggleButton>
                  ))}
               </ButtonGroup>
               <label className="switch" title="Переключить индикацию">
                  <input type="checkbox" checked={this.props.report.edit.indicate} onChange={e => this.props.toggleIndicate()}/>
                  <span className="slider round toggleIndicate"></span>
               </label>

               
               <label className="switch" title="Редактирование">
                  <input type="checkbox" checked={this.props.template.isEdit} onChange={e => this.props.toggleTemplateEdit()}/>
                  <span className="slider round toggleEdit"></span>
               </label>
               
               
              
               <Button className="reportButton loadReport" onClick={e => this.loadReport(e)}>Load</Button>
               <Button className="reportButton saveReport" onClick={e => this.props.saveReport(this.props.report.data, this.props.report.edit.changes)}>Save</Button>
            </div>
         </div>
      )
   }
}

const mapStateToProps = state => ({
   schedule: state.schedule,
   report: state.report,
   nameTeacher: state.GLOBAL.nameTeacher,
   template: state.report.template
})

const mapDispatchToProps = dispatch => ({
   changeSubject: (subject, duration) => dispatch(changeSubject(subject, duration)),
   changeGroup: group => dispatch(changeGroup(group)),
   changeTypeReport: type => dispatch(changeTypeReport(type)),
   changeTypeSubject: type => dispatch(changeTypeSubject(type)),
   getReport: nameTeacher => dispatch(getReport(nameTeacher)),
   saveReport: (report, changes) => dispatch(saveReport(report, changes)),
   toggleIndicate: () => dispatch(toggleIndicate()),
   // template
   toggleTemplateEdit: () => dispatch(toggleTemplateEdit())
})

export default connect(mapStateToProps, mapDispatchToProps)(PanelReport)