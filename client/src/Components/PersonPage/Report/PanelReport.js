import { ButtonGroup, ToggleButton } from "react-bootstrap"
import { connect } from "react-redux"
import * as CONFIG from "../../../config.json"
import { changeTypeReport, changeSubject, changeGroup, changeTypeSubject } from "../../../redux/actions"

const PanelReport = (props) => {
   let groups 	= [];
   let types 	= [];
   let names = props.compactSchedule.reduce((acc, cur) => {
      return [...acc, cur.name];
   }, []);

   let TYPES = props.compactSchedule.reduce((acc, cur) => {
      return [...acc, cur.types];
   }, []);

   console.log(props)

   let indexName;
   ~names.indexOf(props.self.state.nameSubject) ? 
      indexName = names.indexOf(props.self.state.nameSubject):
      indexName = names.indexOf(props.self.props.report.subject);

   if(props.self.state.nameSubject != "" ){
      groups = props.compactSchedule[indexName].groups;
      types = props.compactSchedule[indexName].types;
   }

   return (
      <div className="panelHeadTable">
         <div className="tableWrap">
            <select onChange={e => props.self.changeSubject(e)} className="form-control subjects">
               <option value={-1}>Choose subject</option>
               {
                  names.map((el, index) => 
                     index == indexName ?
                     <option selected value={index}>{`${el} [${TYPES[index]}]`}</option> :
                     <option value={index}>{`${el} [${TYPES[index]}]`}</option>
                  )
               }
            </select>
            <select onChange={e => props.self.changeType(e)} className="form-control types">
               <option value={undefined}>Choose type</option>
               {
                  types.map((type, index) => <option value={type}>{type}</option>)
               }
            </select>
            <select onChange={e => props.self.changeGroup(e)} className="form-control groups">
               <option value={-1}>Choose group</option>
               {
                  groups.map((el, index) => 
                     index == props.self.nameGroup ?
                     <option selected value={el}>{el}</option> :
                     <option value={el}>{el}</option>
                  )
               }
            </select>
            <ButtonGroup toggle>
               {CONFIG.TYPES_REPORTS.map((radio, idx) => (
                  <ToggleButton
                     variant="light"
                     key={idx}
                     type="radio"
                     name="radio"
                     value={radio.alias}
                     checked={props.self.props.report.typeReport === radio.alias}
                     onChange={(e) => props.self.toggleTypeTable(e.currentTarget.value)}
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

const mapStateToProps = state => ({
   subject: state.report.subject,
   group: state.report.group,
   typeReport: state.report.typeReport,
   typeSubject: state.report.typeReport
})

const mapDispatchToProps = dispatch => ({
   changeSubject: subject => dispatch(changeSubject(subject)),
   changeGroup: group => dispatch(changeGroup(group)),
   changeTypeReport: type => dispatch(changeTypeReport(type)),
   changeTypeSubject: type => dispatch(changeTypeSubject(type)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PanelReport)