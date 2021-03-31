import { 
   REPORT_CHANGE_TYPE,
   REPORT_CHANGE_SUBJECT,
   REPORT_CHANGE_GROUP,
   REPORT_CHANGE_TYPE_SUBJECT,
   REPORT_CHANGE_PRIORITY,
   REPORT_GET_DATA
} from "./types"

import { getReport } from "../../api"

var isValidGetRequest = (state, payload) => {
   console.log(state)
   let access = false;
   if(   typeof payload 	               !== "undefined" && payload 	               != "" &&
         typeof state.group 			      !== "undefined" && state.group			      != "" &&
         typeof state.subject 		      !== "undefined" && state.subject		         != "" &&
         typeof state.duration 	         !== "undefined" && state.duration 	         != "" &&
         typeof state.typeReport 	      !== "undefined" && state.typeReport 	      != "" &&
         typeof state.typeSubject 	      !== "undefined" && state.typeSubject	      != "" 
   ){
      access = true;
   }
   return access;
}
var getRequestWithAccess = (state, payload, accessCB, errorCB) => {
   if(isValidGetRequest(state, payload)){
      getReport({
         nameTeacher: payload,
         nameSubject: state.subject,
         nameGroup: state.group,
         typeReport: state.typeReport,
         typeSubject: state.typeSubject,
         durationSubject: state.duration
      }, accessCB, errorCB)
   }
}

export const reports = (state = {
   subject: "",
   group: "",
   typeSubject: "Лек",
   typeReport: "att",
   priority: "subjects",
   duration: "ALL_SEMESTER",
   data: {}
}, action) => {

   switch(action.type){
      case REPORT_CHANGE_TYPE:
         return {
            ...state,
            typeReport: action.payload
         }
      case REPORT_CHANGE_SUBJECT:
         return{
            ...state,
            subject: action.payload,
            group: ""
         }
      case REPORT_CHANGE_TYPE_SUBJECT:
            return {
               ...state,
               typeSubject: action.payload
            }
      case REPORT_CHANGE_GROUP: 
            return{
               ...state,
               group: action.payload
            }
      case REPORT_GET_DATA:
         {
            getRequestWithAccess(state, action.payload, data => {
               return {
                  ...state,
                  data: data
               }
            }, error => {
               console.error(error)
               return state
            })
            return state
         };break;
      case REPORT_CHANGE_PRIORITY:
         return{
            ...state,
            priority: action.payload
         }
      default: 
         return state
   }
}