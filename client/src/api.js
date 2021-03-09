// данный модуль предполагает наличие всех необходимых функций для вд с api
import $ from "jquery";
import * as CONFIG from "./config.json";

let sendRequest = (url, data, callbackSuccess, callbackError) => {
	return $.getJSON(url, data, callbackSuccess, callbackError);
};

const getScheduleTeacher = (id, callbackSuccess, callbackError) => {
	sendRequest(CONFIG.HOST + CONFIG.URLS_API.urlScheduleTeacher + id, {
		code: 200,
		type: "teacher",
		msg: "Hey, back! Give me teacher's schedule please"
	}, callbackSuccess, callbackError);
};

let getListLearners = (callbackSuccess, callbackError) => {
	sendRequest(CONFIG.HOST + CONFIG.URLS_API.urlListLearners, {
		code: 200,
		type: "listLearners",
		msg: "Hey, back! Give me list of learners please, main word - please so it will work!"
	}, callbackSuccess, callbackError);
};

let getListTeachers = (callbackSuccess, callbackError) => {
	sendRequest(CONFIG.HOST + CONFIG.URLS_API.urlListTeachers, {
		code: 200,
		type: "listLearners",
		msg: "Hey, back! Give me list of learners please, main word - please so it will work!"
	}, callbackSuccess, callbackError);
};


export { getScheduleTeacher, getListLearners, getListTeachers };