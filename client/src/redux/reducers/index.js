import { combineReducers } from 'redux'
import { GLOBAL } from "./global"
import { app } from "./app"
import { reports } from "./reports"
import { scheduler } from "./schedule"



const rootReducer = combineReducers({
	GLOBAL,
	app: app,
	report: reports,
	schedule: scheduler
})
 
export default rootReducer