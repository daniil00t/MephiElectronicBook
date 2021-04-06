from flask import jsonify, render_template, send_from_directory, request, Response
from server import app
from .db import  *
from .reports import *

# [FEATURE] change all to POST
# [FEATURE] check if report exists

@app.route('/__get_teachers')
def __get_teachers():
	with DB() as db:
		result =  db.get_teachers()

	return jsonify({ "data" : result }) # result is a list



@app.route('/__get_schedule')
def __get_schedule():
	# [FEATURE] use teacher_name instead of id
	id = request.args.get('id', type=int)

	with DB() as db:
		result =  db.get_schedule(id)

	return jsonify(result)



@app.route('/__get_students')
def __get_students():
	group_name = request.args.get('group', type=str)

	with DB() as db:
		result =  db.get_students(group_name)

	return jsonify(result)



@app.route('/__get_report', methods=['POST'])
def __get_report():
	data = request.json

	print("[INFO] Sent from frontend:\n")
	print_json(data)

	# KOSTILY
	#data["typeSubject"] = "Лек"

	with RM() as rm:
		result = rm.get(data)

	print("[INFO] Sent from backend:\n")
	print_json(result)

	if result:
		return jsonify(result)
	else:
		status_code = Response(status=500)
		return status_code



@app.route('/__set_report', methods=['POST'])
def __set_report():
	data = request.json
	print_json(data)

	# KOSTILY
	# data["typeSubject"] = "Лек"

	with RM() as rm:
		result = rm.set(data)

	if result:
		status_code = Response(status=200)
	else:
		status_code = Response(status=500)
	return status_code