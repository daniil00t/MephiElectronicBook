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
		result =  db.get_shedule(id)

	return jsonify({ "data" : result })



@app.route('/__get_students')
def __get_students():
	group_name = request.args.get('group', type=str)

	with DB() as db:
		result =  db.get_students(group_name)

	return jsonify({ "data" : result })
