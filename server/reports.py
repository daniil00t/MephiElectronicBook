from server.config import *
from .db import *
import os
import json

class RM():
	def __init__(self):
		pass

	def __enter__(self):
		return self

	def __exit__(self, exc_type, exc_val, exc_tb):
		return type is None

	def __create(self, report_data):
		with DB() as db:
			teacher_id = db.get_teacher_id(report_data["teacher_name"])
			schedule = db.get_schedule(teacher_id)["data"]
			students = db.get_students(report_data["group_name"])

		# [FEATURE] maybe use list of days?
		# pattern = []
		# duration = ""
		# for day in schedule:
		# 	for lesson in day:
		# 		if  (lesson["name"] == report_data["subject_name"]) and \
		# 			(lesson["duration"] == report_data["subject_duration"]) and \
		# 			(report_data["group_name"] in lesson["groups"]):

		# 				duration = dates.parse_duration(lesson["duration"])
		# 				time = dates.parse_time(lesson["time"])

		# 				pattern.append({
		# 					"time" : time,
		# 					"even" : lesson["even"],
		# 					"wday" : lesson["wday"]
		# 				})

		# dates_list = dates.get_dates(pattern, duration)

		# # [FEATURE] create empty report correctly using group list and date module
		# return  {		
		# 	"thead" : dates_list
		# }

		return {"data" : "empty"}

	def __read(self, report_id):
		path = RP_FOLDER + str(report_id) + '.json'

		if os.path.isfile(path):
			with open(path, 'r') as f:
				report = json.load(f)
			return report
		else:
			print("[INFO] Report {} not found".format(report_id))
			return None



	def __write(self, report_id, report):
		# [FEATURE] write json as bytes, save space
		path = RP_FOLDER + str(report_id) + '.json'

		with open(path, 'w', encoding='utf-8') as f:
			json.dump(report, f, ensure_ascii=False, indent=4)



	def get(self, report_data):
		with DB() as db:
			report_id = db.get_report_id(report_data)

		if report_id:
			report = self.__read(report_id)
			if not report:
				report = self.__create(report_data)
				self.__write(report_id, report)

			return report
		else:
			report = self.__create(report_data)

			with DB() as db:
				db.insert_report(report_data)
				report_id = db.get_report_id(report_data) # dont't use SCOPE_IDENTITY (synchronization)

			self.__write(report_id, report)

			return report



	def set(self, report_data, report):
		with DB() as db:
			report_id = db.get_report_id(report_data)

		if report_id:
			print_json(report)
			self.__write(report_id, report)
			return True
		else:
			return None




