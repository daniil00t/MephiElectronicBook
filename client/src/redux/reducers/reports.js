import { 
   REPORT_CHANGE_TYPE,
   REPORT_CHANGE_SUBJECT,
   REPORT_CHANGE_GROUP,
   REPORT_CHANGE_TYPE_SUBJECT,
   REPORT_CHANGE_PRIORITY,
   REPORT_GET_DATA,
	REPORT_RENDER_DATA
} from "./types"

import { renderReport, getReport as actionGetReport, showNotification } from "../actions"

import { getReport } from "../../api"

var isValidGetRequest = (req) => {
   let access = false;
   if(   typeof req.nameTeacher 	            !== "undefined" && req.nameTeacher 	            != "" &&
         typeof req.group 			            !== "undefined" && req.group			            != "" &&
         typeof req.subject 		            !== "undefined" && req.subject		            != "" &&
         typeof req.duration 	               !== "undefined" && req.duration 	               != "" &&
         typeof req.typeReport 	            !== "undefined" && req.typeReport 	            != "" &&
         typeof req.typeSubject 	            !== "undefined" && (req.typeSubject	            != "undefined" || req.typeSubject != "-1")
   ){
      access = true;
   }
	console.log("It's not valid")
   return access;
}
var getRequestWithAccess = (req, accessCB, errorCB) => {
   if(isValidGetRequest(req)){
      getReport({
         nameTeacher:      req.nameTeacher,
         nameSubject:      req.subject,
         nameGroup:        req.group,
         typeReport:       req.typeReport,
         typeSubject: 		req.typeSubject,
         durationSubject: 	req.duration
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
   data: {
      data: [],
      thead: []
   }
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
            subject: action.payload.subject,
            duration: action.payload.duration,
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
		case REPORT_CHANGE_PRIORITY:
			return{
				...state,
				priority: action.payload
			}
      case REPORT_GET_DATA:
			getRequestWithAccess({...state, nameTeacher: action.payload}, (data)=>{
				action.asyncDispatch(renderReport(data))
			}, (error)=>{
            action.asyncDispatch(renderReport({data: [], thead:[]}))
            action.asyncDispatch(showNotification({
               title: "Ошибка вышла",
               content: "Не удалось загрузить ведомость",
               type: "error"
            }))
         })
			return state
		case REPORT_RENDER_DATA:
			console.log(action.payload)
			return {
				...state,
				data: action.payload
			}
      default: 
         return state
   }
}