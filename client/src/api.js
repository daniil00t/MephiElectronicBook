// данный модуль предполагает наличие всех необходимых функций для вд с api
import axios from 'axios';
import * as CONFIG from "./config.json";

const sendRequestGET = (url, data, callbackSuccess, callbackError) => {
	axios.get(url, { params: data })
		.then(res => callbackSuccess(res))
		.catch(error => callbackError(error.response))
};
const sendRequestPOST = (url, data, callbackSuccess, callbackError) => {
	console.log(data, url);
	axios.post(url, data)
		.then(res => {
			callbackSuccess(res.data)
		})
		.catch(error => {
			callbackError(error.response)
		});
};

const getScheduleTeacher = (id, callbackSuccess, callbackError) => {
	sendRequestGET(CONFIG.HOST + CONFIG.URLS_API.urlScheduleTeacher, {
		id: id,
		code: 200,
		type: "teacher",
		msg: "Hey, back! Give me teacher's schedule please"
	}, callbackSuccess, callbackError);
};

const getListLearners = (callbackSuccess, callbackError) => {
	sendRequestGET(CONFIG.HOST + CONFIG.URLS_API.urlListLearners, {
		code: 200,
		type: "listLearners",
		msg: "Hey, back! Give me list of learners please, main word - please so it will work!"
	}, callbackSuccess, callbackError);
};

const getListTeachers = (callbackSuccess, callbackError) => {
	console.log(CONFIG.HOST + CONFIG.URLS_API.urlListTeachers);
	sendRequestGET(CONFIG.HOST + CONFIG.URLS_API.urlListTeachers, {
		code: 200
	}, callbackSuccess, callbackError);
};

const getReport = (data, callbackSuccess, callbackError) => {
	let _data = Object.assign({}, data, {
		code: 200,
		msg: "This is your request! enjoy!"
	});
	sendRequestPOST(CONFIG.HOST + CONFIG.URLS_API.urlGetReport, _data, callbackSuccess, callbackError);
};

const setReport = (data, callbackSuccess, callbackError) => {
	sendRequestPOST(CONFIG.HOST + CONFIG.URLS_API.urlSendReport, Object.assign({}, data, {
		code: 200,
		msg: "This is your request! enjoy!"
	}), callbackSuccess, callbackError);
};


export { getScheduleTeacher, getListLearners, getListTeachers, getReport, setReport };