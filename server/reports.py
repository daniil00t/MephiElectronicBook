from server.config import *
from .db import *
from .modules import Dates as dates
import os
import json

# [FEATURE] check type of lesson too!!!
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
				"teacher_name" 		: report_data["nameTeacher"],
				"subject_name" 		: report_data["nameSubject"],
				"subject_duration" 	: report_data["durationSubject"],
				"subject_type" 	    : report_data["typeSubject"],
				"group_name" 		: report_data["nameGroup"],
				"report_type" 		: report_data["typeReport"]
			}
			return new_report_data

		elif convert_to == "front":
			new_report_data = {
				"nameTeacher"		: report_data["teacher_name"],
				"nameSubject"		: report_data["subject_name"],
				"durationSubject" 	: report_data["subject_duration"],
				"typeSubject" 	    : report_data["subject_type"],
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
		#[FEATURE] what if pattern is empty?
		pattern  = [[], [], [], [], [], [],
					[], [], [], [], [], []]

		for day in schedule:
			for lesson in day:
				#[FEATURE] add type
				if  (lesson["name"] == report_data["subject_name"]) and \
					(lesson["duration"] == report_data["subject_duration"]) and \
					(lesson["type"] == report_data["subject_type"]) and \
					(report_data["group_name"] in lesson["groups"]):
						
						time = dates.parse_time(lesson["time"])
						even = lesson["even"]
						wday = lesson["wday"]

						if even == 0:
							pattern[wday].append(time)
							pattern[6 + wday].append(time)
						else:
							pattern[6*(even - 1) + wday].append(time)

		for d in pattern:
			d.sort()

		duration = dates.parse_duration(report_data["subject_duration"])

		dates_list = dates.get_dates_times(pattern, duration)


		# 2) create empty report
		# [FEATURE] change thead considering report type (add percent)
		thead = ["id", "name"]
		thead.extend(dates_list)

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
			self.__write(report_id, report)
			return True
		else:
			return None




