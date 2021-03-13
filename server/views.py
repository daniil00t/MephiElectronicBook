from flask import jsonify, render_template, send_from_directory, request
from server import app
from .db import  *



@app.route('/__get_teachers')
def __get_teachers():
	result = []
	with DB() as db:
		result =  db.get_teachers()

	return jsonify({ "data" : result })



@app.route('/__get_schedule')
def __get_schedule():
	id = int(request.args.get('id'))

	with DB() as db:
		result =  db.get_schedule(id)

	print_json(result)

	return jsonify({ "data" : result })



@app.route('/__get_students')
def __get_students():
	group_name = request.args.get('group', type=str)

	with DB() as db:
		result =  db.get_students(group_name)

	return jsonify({ "data" : result })



# @app.route('/__get_report')
# def hello():
# 	print("[INFO] Got json:\n")
# 	print_json(request.json)

# 	with DB() as db:
# 		result =  db.get_report(
# 			teacher_name = request.json["teacherName"],
# 			subject_name = request.json["subjectName"],
# 			group_name = request.json["groupName"],
# 		)

# 	print("[INFO] Sending this report:\n")
# 	print_json(result)

# 	return jsonify({ "data" : "Believe me, it's realy report"})



# @app.route('/__get_report', methods)
# def hello():
# 	print("[INFO] Got json:\n")
# 	print_json(request.json)

# 	with DB() as db:
# 		result =  db.get_report(
# 			teacher_name = request.json["teacherName"],
# 			subject_name = request.json["subjectName"],
# 			group_name = request.json["groupName"],
# 		)

# 	print("[INFO] Sending this report:\n")
# 	print_json(result)

# 	return jsonify({ "data" : "Believe me, it's realy report"})