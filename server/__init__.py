from flask import Flask
from .db import *

app = Flask(__name__, template_folder="../client/pages", static_url_path='')

from .views import *
