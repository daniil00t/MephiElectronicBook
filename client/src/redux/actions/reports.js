import { 
   REPORT_CHANGE_TYPE, 
   REPORT_CHANGE_SUBJECT,
   REPORT_CHANGE_GROUP,
   REPORT_CHANGE_TYPE_SUBJECT,
   REPORT_CHANGE_PRIORITY,
   REPORT_GET_DATA, 
   REPORT_RENDER_DATA
   
} from "../reducers/types"

export const changeTypeReport = (reportType) => {
   return {
      type: REPORT_CHANGE_TYPE,
      payload: reportType
   }
}
export const changeSubject = (subject, duration) => {
   return {
      type: REPORT_CHANGE_SUBJECT,
      payload: {
         subject,
         duration
      }
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

export const getReport = (data) => ({
   type: REPORT_GET_DATA,
   payload: data
})
export const renderReport = data => ({
   type: REPORT_RENDER_DATA,
   payload: data
})