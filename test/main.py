from flask import Flask, jsonify, render_template, request
app = Flask(__name__)

@app.route('/_add_numbers')
def add_numbers():
	a = request.args.get('a', 0)
	b = request.args.get('b', 0)
	print(a, b)
	print(jsonify(result=a + b))
	return jsonify(result=a + b)

@app.route('/')
def index():
	return render_template('index.html')

app.run(debug=True)