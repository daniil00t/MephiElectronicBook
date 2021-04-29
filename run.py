from server import *
from server.config import *

if __name__ == '__main__':
	app.run(host=S_HOST, port=S_PORT, debug=DEBUG)