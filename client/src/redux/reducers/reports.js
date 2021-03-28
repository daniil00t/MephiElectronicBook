import { 
   REPORT_CHANGE_TYPE,
   REPORT_CHANGE_SUBJECT,
   REPORT_CHANGE_GROUP,
   REPORT_CHANGE_TYPE_SUBJECT
} from "./types"
export const reports = (state = {
   subject: "",
   group: "",
   typeSubject: "",
   typeReport: ""
}, action) => {
   switch(action.type){
      case REPORT_CHANGE_TYPE:
         return {
            ...state,
            typeReport: action.payload
         }
      case REPORT_CHANGE_SUBJECT:
         return {
            ...state,
            subject: action.payload
         }
      case REPORT_CHANGE_TYPE_SUBJECT:
         return {
            ...state,
            typeSubject: action.payload
         }
      case REPORT_CHANGE_GROUP: 
         return {
            ...state,
            group: action.payload
         }
      default: 
         return state
   }
}