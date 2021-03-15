from flask import jsonify, render_template, send_from_directory, request, Response
from server import app
from .db import  *
from .reports import *



@app.route('/__get_teachers')
def __get_teachers():
	with DB() as db:
		result =  db.get_teachers()

	return jsonify({ "data" : result })



@app.route('/__get_schedule')
def __get_schedule():
	# [FEATURE] use teacher_name instead of id
	id = request.args.get('id', type=int)

	with DB() as db:
		result =  db.get_schedule(id)

	return jsonify({ "data" : result })



@app.route('/__get_students')
def __get_students():
	group_name = request.args.get('group', type=str)

	with DB() as db:
		result =  db.get_students(group_name)

	return jsonify({ "data" : result })



@app.route('/__get_report', methods=['POST'])
def __get_report():
	data = request.json
	print_json(data)

	report_data = {
		"teacher_name" 		: data["teacherName"],
		"subject_name" 		: data["subjectName"],
		"subject_duration" 	: data["subjectDuration"],
		"group_name" 		: data["groupName"],
		"report_type" 		: data["reportType"]
	}

	with RM() as rm:
		result = rm.get(report_data)

	return jsonify({ "data" : result })



@app.route('/__set_report', methods=['POST'])
def __set_report():
	data = request.json
	print_json(data)

	report_data = {
		"teacher_name" 		: data["teacherName"],
		"subject_name" 		: data["subjectName"],
		"subject_duration" 	: data["subjectDuration"],
		"group_name" 		: data["groupName"],
		"report_type" 		: data["reportType"]
	}


	report = {
		"teacher_name" 		: data["teacherName"],
		"subject_name" 		: data["subjectName"],
		"subject_duration" 	: data["subjectDuration"],
		"group_name" 		: data["groupName"],
		"report_type" 		: data["reportType"],
		"thead"				: data["thead"],
		"data" 				: data["data"]
	}

	with RM() as rm:
		result = rm.set(report_data, report)


	if result:
		status_code = Response(status=200)
	else:
		status_code = Response(status=500)
	return status_code





# @app.route('/__get_report', methods)
# def hello():
# 	print("[INFO] Got json:\n")
# 	print_json(request.json)

# 	with DB() as db:
# 		result =  db.get_report(
# 			teacher_name = request.json["teacherName"],
# 			subject_name = request.json["subjectName"],
# 			group_name = request.json["groupName"],
#			report_type = request.json["reportType"]
# 		)

# 	print("[INFO] Sending this report:\n")
# 	print_json(result)

# 	return jsonify({ "data" : "Believe me, it's realy report"})