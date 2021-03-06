// данный модуль предполагает наличие всех необходимых функций для вд с api
import $ from "jquery";

let sendRequest = (url, data, callback) => {
	return $.getJSON(url, data, callback);
};


let getScheduleTeacher = (id, callbackSuccess, callbackError) => {
	sendRequest("http://localhost:5000/__get_schedule/" + id, {
		code: 200,
		type: "teacher",
		msg: "Hey, back! Give me teacher's schedule please"
	}, callbackSuccess, callbackError);
};

let getListLearners = (callbackSuccess, callbackError) => {
	sendRequest("__getListLearners", {
		code: 200,
		type: "listLearners",
		msg: "Hey, back! Give me list of learners please, main word - please so it will work!"
	}, callbackSuccess, callbackError);
};

let getListTeachers = (callbackSuccess, callbackError) => {
	sendRequest("http://localhost:5000/__get_teachers", {
		code: 200,
		type: "listLearners",
		msg: "Hey, back! Give me list of learners please, main word - please so it will work!"
	}, callbackSuccess, callbackError);
};



export { getScheduleTeacher, getListLearners, getListTeachers };