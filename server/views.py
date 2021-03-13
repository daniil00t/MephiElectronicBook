from flask import jsonify, render_template, send_from_directory, request
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



@app.route('/__get_report')
def __get_report():
	report_data = {
		"teacher_name" 		: request.args.get('teacherName', type=str),
		"subject_name" 		: request.args.get('subjectName', type=str),
		"subject_duration" 	: request.args.get('subjectDuration', type=str),
		"group_name" 		: request.args.get('groupName', type=str),
		"report_type" 		: request.args.get('reportType', type=str),
		"meta" 				: str(request.args.get('meta'))
	}

	rm = RM()
	result = rm.get(report_data)

	return jsonify({ "data" : result})



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