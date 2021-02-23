from server import *

if __name__ == '__main__':
	with DB() as db: # it is executed twice only if debug=True
		db.init()
	app.run(debug=True)