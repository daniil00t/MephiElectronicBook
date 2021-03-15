from server.config import *
from .db import *
from .modules import Dates as dates
import os
import json

# [FEATURE] add
class RM():
	def __init__(self):
		pass


	def __enter__(self):
		return self


	def __exit__(self, exc_type, exc_val, exc_tb):
		return type is None


	def __convert_report_data(self, report_data, convert_to):
		if convert_to == "back":
			new_report_data = {
				"teacher_name" 		: report_data["teacherName"],
				"subject_name" 		: report_data["subjectName"],
				"subject_duration" 	: report_data["subjectDuration"],
				"group_name" 		: report_data["groupName"],
				"report_type" 		: report_data["reportType"]
			}
			return new_report_data

		elif convert_to == "front":
			new_report_data = {
				"nameTeacher"		: report_data["teacher_name"],
				"nameSubject"		: report_data["subject_name"],
				"durationSubject" 	: report_data["subject_duration"],
				"nameGroup" 		: report_data["group_name"],
				"typeReport"		: report_data["report_type"]
			}
			return new_report_data

		else:
			return None



	def __create(self, report_data):
		with DB() as db:
			teacher_id = db.get_teacher_id(report_data["teacher_name"])
			schedule = db.get_schedule(teacher_id)["data"]
			students = db.get_students(report_data["group_name"])["data"]


		# 1) get dates
		#[FEATURE] maybe use list of days?
		pattern = []
		duration = ""
		for day in schedule:
			for lesson in day:
				if  (lesson["name"] == report_data["subject_name"]) and \
					(lesson["duration"] == report_data["subject_duration"]) and \
					(report_data["group_name"] in lesson["groups"]):

						duration = lesson["duration"]

						pattern.append({
							"time" : lesson["time"],
							"even" : lesson["even"],
							"wday" : lesson["wday"]
						})

		dates_list = dates.get_dates(pattern, duration)


		# 2) create empty report
		thead = ["id", "name"]
		thead.extend(dates_list)

		print_json(students)
		data = []
		for s in students:
			row = [s["id"], s["name"]]
			row.extend([ "" for i in range(0, len(dates_list))])
			data.append(row)

		front_report_data = self.__convert_report_data(report_data, convert_to="front")
		report = {
			"thead" : thead,
			"data"  : data
		}
		report.update(front_report_data)

		print_json(report)
		return report



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
		report_data = self.__convert_report_data(report_data, convert_to="back")

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



	def set(self, report):
		report_data = self.__convert_report_data(report, convert_to="back")

		with DB() as db:
			report_id = db.get_report_id(report_data)

		if report_id:
			print_json(report)
			self.__write(report_id, report)
			return True
		else:
			return None




