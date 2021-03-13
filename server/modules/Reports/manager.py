from server.config import *
import os
import json

def get_report(report_id):
	path = RP_FOLDER + report_id + '.json'

	if os.isfile(path):
		with open(path, 'r') as f:
			report = json.load(f)

		return report
	else:
		print("[INFO] Report {} not found".format(report_id))
		return 1

def save_report(report_id, report):
	path = RP_FOLDER + report_id + '.json'

	with open(path, 'w') as f:
		json.dump(report, f)




