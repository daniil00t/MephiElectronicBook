import { 
   REPORT_CHANGE_TYPE, 
   REPORT_CHANGE_SUBJECT,
   GLOBAL_CHANGE_NAME, 
   GLOBAL_TOGGLE_LOGGED,
   NOTIF_SHOW,
   NOTIF_CLOSE
} from "../reducers/types"

export const changeTypeReport = (reportType) => {
   return {
      type: REPORT_CHANGE_TYPE,
      payload: reportType
   }
}
export const changeNameTeacher = (name) => {
   return {
      type: GLOBAL_CHANGE_NAME,
      payload: name
   }
}
export const changeStateLogged = () => {
   return {
      type: GLOBAL_TOGGLE_LOGGED,
   }
}

export const showNotification = (payload) => {
   return {
      type: NOTIF_SHOW,
      payload: {
         title: payload.title,
         content: payload.content,
         type: payload.type
      }
   }
}
export const closeNotification = () => {
   return {
      type: NOTIF_CLOSE
   }
}
export const changeSubject = (subject) => {
   return {
      type: REPORT_CHANGE_SUBJECT,
      payload: subject
   }
}