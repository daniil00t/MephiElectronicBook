from flask import jsonify, render_template, send_from_directory
from server import app
from .db import  *

@app.route('/')
def index():
	return render_template("auth.html")


# Static files
@app.route('/static/<path:path>')
def send_static(path):
	print(path)
	# print(path)
	return send_from_directory(app.static_folder, path)



@app.route('/__get_teachers')
def __get_teachers():
	with DB() as db:
		result =  db.get_teachers()
	return jsonify({ "data" : result })

@app.route('/__get_shedule/<int:id>')
def __get_shedule(id):
	with DB() as db:
		result =  db.get_shedule(id)
	return jsonify({ "data" : result })

@app.route('/users/<int:user_id>')
def user(user_id):
	return "User id: " + str(user_id)

@app.route('/users/<int:user_id>/reports/<int:report_id>')
def report(user_id, report_id):
	return "Report id: " + str(report_id)
