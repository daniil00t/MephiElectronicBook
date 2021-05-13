import { 
	REPORT_CHANGE_TYPE, 
	REPORT_CHANGE_SUBJECT,
	REPORT_CHANGE_GROUP,
	REPORT_CHANGE_TYPE_SUBJECT,
	REPORT_CHANGE_PRIORITY,
	REPORT_GET_DATA,
	REPORT_SAVE_DATA,
	REPORT_RENDER_DATA,
	REPORT_EDIT_CHANGE_STATE,
	REPORT_EDIT_ADD_CHANGE,
	REPORT_EDIT_TO_BACK,
	REPORT_FULLUPDATE_DATA,

	TEMPLATE_TOGGLE_EDIT,
	TEMPLATE_CHANGE_MAX_THEAD,
	TEMPLATE_ADD_PART,
	TEMPLATE_ADD_STUDENT,
	TEMPLATE_DELETE_ROW,
	REPORT_INDICATE_TOGGLE,
	TEMPLATE_MARK_AS_HEADMAN,
	TEMPLATE_DELETE_PART,
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
export const saveReport = (report, changes) => ({
	type: REPORT_SAVE_DATA,
	payload: {
		report,
		changes
	}
})
export const renderReport = data => ({
	type: REPORT_RENDER_DATA,
	payload: data
})
export const changeStateEdit = () => ({
	type: REPORT_EDIT_CHANGE_STATE
})
export const addChangeToReport = change => ({
	type: REPORT_EDIT_ADD_CHANGE,
	payload: change
})
export const fullUpdate = row => ({
	type: REPORT_FULLUPDATE_DATA,
	payload: row
})


export const backChange = () => ({
	type: REPORT_EDIT_TO_BACK
})
export const toggleIndicate = () => ({
	type: REPORT_INDICATE_TOGGLE
})


/*
* TEMPLATE
*/

export const toggleTemplateEdit = () => ({
	type: TEMPLATE_TOGGLE_EDIT
})

export const changeMaxThead = (col, value) => ({
	type: TEMPLATE_CHANGE_MAX_THEAD,
	payload: {col, value}
})

export const template__addPart = () => ({
	type: TEMPLATE_ADD_PART
})
export const template__deletePart = col => ({
	type: TEMPLATE_DELETE_PART,
	payload: col
})
export const template__addStudent = name => ({
	type: TEMPLATE_ADD_STUDENT,
	payload: name
})
export const template__deleteStudent = row => ({
	type: TEMPLATE_DELETE_ROW,
	payload: row
})
export const template__markAsHeadman = row => ({
	type: TEMPLATE_MARK_AS_HEADMAN,
	payload: row
})