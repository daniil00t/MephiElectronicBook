from server import app
from .db import  *

@app.route('/')
def index():
	with DB() as db:
		pass
	return 'Login page'

@app.route('/users/<int:user_id>')
def user(user_id):
	return "User id: " + str(user_id)

@app.route('/users/<int:user_id>/reports/<int:report_id>')
def report(user_id, report_id):
	return "Report id: " + str(report_id)