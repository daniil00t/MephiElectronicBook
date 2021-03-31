import { 
   REPORT_CHANGE_TYPE, 
   REPORT_CHANGE_SUBJECT,
   REPORT_CHANGE_GROUP,
   REPORT_CHANGE_TYPE_SUBJECT,
   REPORT_CHANGE_PRIORITY,
   REPORT_GET_DATA
   
} from "../reducers/types"

export const changeTypeReport = (reportType) => {
   return {
      type: REPORT_CHANGE_TYPE,
      payload: reportType
   }
}
export const changeSubject = subject => {
   return {
      type: REPORT_CHANGE_SUBJECT,
      payload: subject
   }
}
export const changeGroup = group => ({
   type: REPORT_CHANGE_GROUP,
   payload: group
})
export const changeTypeSubject = group => ({
   type: REPORT_CHANGE_TYPE_SUBJECT,
   payload: group
})
export const changePriority = subOrGr => ({
   type: REPORT_CHANGE_PRIORITY,
   payload: subOrGr
})

export const getReport = (nameTeacher) => ({
   type: REPORT_GET_DATA,
   payload: nameTeacher
})