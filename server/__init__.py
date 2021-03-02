from flask import Flask
from .db import *

app = Flask(__name__, template_folder="../client/pages", static_folder='../client/')

app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False
with DB() as db:
	db.init()

from .views import *
