from flask import Flask
from .db import *

app = Flask(__name__, template_folder="../client/templates", static_folder="../client/static")

from .views import *
