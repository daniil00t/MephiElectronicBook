import { combineReducers } from 'redux'
import { nameTeacher, logged } from "./global"
import { reports } from "./reports"
import { notifier } from "./notification"



const rootReducer = combineReducers({
   report: reports,
   nameTeacher,
   notification: notifier,
   isLogged: logged
})
 
export default rootReducer