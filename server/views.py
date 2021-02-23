from flask import jsonify, render_template
from server import app
from .db import  *

@app.route('/')
def index():
	return render_template("auth.html")


@app.route('/__get_teachers')
def __get_teachers():
	with DB() as db:
		result =  db.get_teachers()

	return jsonify({ "data" : result })

	# return jsonify({ "data" : [
	# 	{
	# 		"id" : 1,
	# 		"name" : "Фролов Игорь Владимирович"
	# 	}
	# ]})

@app.route('/users/<int:user_id>')
def user(user_id):
	return "User id: " + str(user_id)

@app.route('/users/<int:user_id>/reports/<int:report_id>')
def report(user_id, report_id):
	return "Report id: " + str(report_id)