from flask import Flask
from flask_cors import CORS
from .db import *

app = Flask(__name__, template_folder="../client/pages", static_folder='../client/')

# for Access-Control-Allow-Origin instead app.config['Access-Control-Allow-Origin'] = "*"
CORS(app)
# for normal get json
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False
app.config['JSON_AS_ASCII'] = False

with DB() as db:
	db.init()

from .views import *
