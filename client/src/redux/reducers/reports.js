import { 
	REPORT_CHANGE_TYPE,
	REPORT_CHANGE_SUBJECT,
	REPORT_CHANGE_GROUP,
	REPORT_CHANGE_TYPE_SUBJECT,
	REPORT_CHANGE_PRIORITY,

	REPORT_GET_DATA,
	REPORT_RENDER_DATA,
	REPORT_SAVE_DATA,
	
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
	TEMPLATE_MARK_AS_HEADMAN
} from "./types"

import { renderReport, showNotification, fullUpdate } from "../actions"
import compileAndMake from "../../Components/PersonPage/Report/compile"

import { getReport, setReport } from "../../api"

function* filler(count, defaultValue){
	for (let i = 0; i < count; i++) {
		yield defaultValue
	}
}

var isValidGetRequest = (req) => {
	let access = false;
	if(   typeof req.nameTeacher 	!== "undefined" && req.nameTeacher 	 !== "" && !!req.nameTeacher &&
			typeof req.group 			!== "undefined" && req.group			 !== "" && !!req.group &&
			typeof req.subject 		!== "undefined" && req.subject		 !== "" && !!req.subject &&
			typeof req.duration 	   !== "undefined" && req.duration 	    !== "" && !!req.duration &&
			typeof req.typeReport 	!== "undefined" && req.typeReport 	 !== "" && !!req.typeReport &&
			typeof req.typeSubject 	!== "undefined" && (req.typeSubject	 !== "undefined" && req.typeSubject !== "-1")
	){
		access = true;
	}
	return access;
}
var getRequestWithAccess = (req, accessCB, errorCB, noRequest) => {
	if(isValidGetRequest(req)){
		getReport({
			nameTeacher:      req.nameTeacher,
			nameSubject:      req.subject,
			nameGroup:        req.group,
			typeReport:       req.typeReport,
			typeSubject: 		req.typeSubject,
			durationSubject: 	req.duration
		}, accessCB, errorCB)
	}else{
		noRequest()
	}
}

export const reports = (
	state = {
		subject: "",
		group: "",
		typeSubject: "undefined",
		typeReport: "att",
		priority: "subjects",
		duration: "ALL_SEMESTER",
		template: {
			isEdit: false,
			data: [],
			lastColIndex: 3
		},
		data: {
			thead: [],
			meta: {
				curCol: 0,
				countParts: 2,
				startParts: 2
			},
			xlsx: {
				data: [],
				columns: []
			}
		},
		edit: {
			changes: [],
			isEdit: false,
			active: {
				row: -1,
				col: -1
			},
			indicate: false
		}
	}, action) => {

	switch(action.type){
		case REPORT_CHANGE_TYPE:
			return {
				...state,
				typeReport: action.payload,
				// clear fields
				data: {xlsx: {data: [], columns: []}, thead: [], meta: {curCol: 0}},
				edit: {
					changes: [],
					isEdit: false,
					active: {
						row: -1,
						col: -1
					}
				}
		}

		case REPORT_CHANGE_SUBJECT:
			return{
				...state,
				subject: action.payload.subject,
				duration: action.payload.duration,
				// group: ""
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
			getRequestWithAccess({...state, nameTeacher: action.payload}, (data) => {
				// action.asyncDispatch(renderReport({data: [], thead:[]}))
				action.asyncDispatch(renderReport(data))
			}, error => {
				action.asyncDispatch(renderReport({xlsx: {data: [], columns: []}}))
				action.asyncDispatch(showNotification({
					title: "Ошибка вышла",
					content: "Не удалось загрузить ведомость",
					type: "error"
				}))
			}, () => {
				action.asyncDispatch(showNotification({
					title: "Недостаточно данных",
					content: "Вы ввели недостаточно количество данных для определения ведомости",
					type: "warning",
					autohide: true
				}))
			})
			return state
		
		case REPORT_RENDER_DATA:
			return {
				...state,
				data: action.payload
		}

		case REPORT_SAVE_DATA:
			let table = state.data.xlsx.data
			action.payload.changes.map(change => {
				if(!!change.allCol){
					for (let i = 0; i < table.length; i++)
						table[i][change.col] = change.value
				}
				else{
					table[change.row][change.col] = change.value
				}
				return change
			})
			setReport({
				...state.data.report_data,
				...state.data,
				xlsx: {
					...state.data.xlsx,
					data: table
				}
			}, success => {
				action.asyncDispatch(showNotification({
					title: `Вел дан!`,
					content: "Ведомость сохранена",
					type: "success",
					autohide: true
				}))
			}, error => {
				action.asyncDispatch(showNotification({
					title: `Ошибка вышла`,
					content: "Не удалось сохранить ведомость",
					type: "error"
				}))
			})
			return {
				...state,
				edit: {
					...state.edit,
					changes: []
				}
		}

		// edit report and sending it on server
		case REPORT_EDIT_CHANGE_STATE:
			return {
				...state,
				edit: {
					// isEdit: action.payload
					...state.edit,
					isEdit: !state.edit.isEdit
				}
		}

		case REPORT_EDIT_ADD_CHANGE:
			const changes = state.edit.changes
			let indexCol = -1
			changes.map((item, index) => {
				if(item.col === action.payload.col && !!item.allCol) indexCol = index
				return item
			})
			if(~indexCol && !changes[indexCol].allCol)
				changes[indexCol].value = !!changes[indexCol].value? "": "+"
			else
				changes.push(action.payload)
			if(!!action.payload.allCol){
				for (let row = 0; row < state.data.xlsx.data.length; row++) {
					action.asyncDispatch(fullUpdate(row))
				}
			}
			else action.asyncDispatch(fullUpdate(action.payload.row))
			return{
				...state,
				edit: {
					...state.edit,
					changes: changes
				}
		}

		case REPORT_EDIT_TO_BACK:
			if(state.edit.changes.length !== 0){
				if(!!state.edit.changes[state.edit.changes.length - 1].allCol){
					for (let row = 0; row < state.data.xlsx.data.length; row++) {
						action.asyncDispatch(fullUpdate(row))
					}
				}
				else action.asyncDispatch(fullUpdate(state.edit.changes[state.edit.changes.length - 1].row))
			}

			return {
				...state,
				edit: {
					...state.edit,
					changes: state.edit.changes.slice(0, state.edit.changes.length-1)
				}
		}

		case REPORT_FULLUPDATE_DATA:
			const thead = state.data.thead
			const curCol = state.data.meta.curCol
			const concatChanges = (row, col) => {
				if(state.edit.changes.length > 0){
					for (let i = state.edit.changes.length - 1; i >= 0; i--) {
						let item = state.edit.changes[i]
						if(!!item.allCol && item.col === col) return item.value // for all col
						if(item.row === row && item.col === col) return item.value
					}
				}
				return state.data.xlsx.data[row][col]
			}
			// without optimise

			// let _table = []
			// state.data.xlsx.data.map((row, Irow) => {
			// 	_table[Irow] = []
			// 	row.map((col, Icol) => _table[Irow].push(concatChanges(Irow, Icol)))
			// })

			// thead.map((th, Icol) => {
			// 	if(!!th.formula){
			// 		_table.map((row, Irow) => {
			// 			_table[Irow][Icol] = compileAndMake(th.formula, curCol)(_table, Irow)
			// 			console.log(_table, Irow, Icol, compileAndMake(th.formula, curCol)(_table, Irow))
			// 		})
			// 	}
			// })

			// with optimise
			let _table = [].concat(state.data.xlsx.data)
			state.data.xlsx.data[action.payload].map((col, Icol) => _table[action.payload][Icol] = concatChanges(action.payload, Icol))
			
			thead.map((th, Icol) => {
				if(!!th.formula){
					_table[action.payload][Icol] = compileAndMake(th.formula, curCol)(_table, action.payload)
				}
				return th
			})
			
			state.data.xlsx.data[action.payload].map((col, Icol) => _table[action.payload][Icol] = state.data.xlsx.data[action.payload][Icol])

			return {
				...state,
				data: {
					...state.data,
					xlsx: {
						...state.data.xlsx,
						data: _table
					}
				}
		}

		case REPORT_INDICATE_TOGGLE:
			return {
				...state,
				edit: {
					...state.edit,
					indicate: !state.edit.indicate
				}
		}

		// TEMPLATE
		case TEMPLATE_TOGGLE_EDIT:
			return {
				...state,
				template: {
					...state.template,
					isEdit: !state.template.isEdit
				}
		}
		case TEMPLATE_CHANGE_MAX_THEAD:
			// var thead = state.data.thead
			{
				let thead = state.data.thead
				thead[action.payload.col] = {...thead[action.payload.col], max: action.payload.value}
				return {
					...state,
					data: {
						...state.data,

						thead
					}
				}
		}
			
		case TEMPLATE_ADD_PART: {
			const countParts = state.data.meta.countParts
			const _table = state.data.xlsx.data
			const _thead = state.data.thead
			const _columns = state.data.xlsx.columns
			const _meta = state.data.meta

			const indexColPart = state.data.meta.startParts + countParts
			for (let row = 0; row < _table.length; row++)
				_table[row].splice(indexColPart, 0, "")
			_columns.splice(indexColPart, 0, `Раздел ${countParts + 1}`)
			_thead.splice(indexColPart, 0, {
				enable: true,
				max: 0,
				name: `Раздел ${countParts + 1}`,
				type: "number",
				keyName: "part"
			})
			_meta.countParts = countParts + 1
			return {
				...state,
				data: {
					...state.data,
					thead: _thead,
					meta: _meta,
					xlsx: {
						...state.data.xlsx,
						data: _table,
						columns: _columns
					}
				}
			}
		}
			
		case TEMPLATE_ADD_STUDENT:
			return {
				...state,
				data: {
					...state.data,
					xlsx: {
						...state.data.xlsx,
						data: [
							...state.data.xlsx.data,
							[state.data.xlsx.data.length+1, action.payload, ...filler(state.data.xlsx.data[0].length-2, "")]
						]
					}
				}
		}

		case TEMPLATE_DELETE_ROW:
			let __table = state.data.xlsx.data
			__table = __table.filter((item, index) => index !== action.payload)
			console.log(action.payload)
			for (let i = action.payload; i < __table.length; i++) {
				__table[i][0] = +__table[i][0] - 1
			}
			return {
				...state,
				data: {
					...state.data,
					xlsx: {
						...state.data.xlsx,
						data: __table
					}
				}
		}

		case TEMPLATE_MARK_AS_HEADMAN:
			return {
				...state,
				data: {
					...state.data,
					meta: {
						...state.data.meta,
						headmanRow: action.payload
					}
				}
		}
		default: 
			return state
	}
}