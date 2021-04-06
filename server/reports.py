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

	#-------------/ READ AND WRITE /-------------------------------------------------------------

	def __write_report(self, report_id, report):
		# [FEATURE] write json as bytes, save space
		path = RP_FOLDER + str(report_id) + '.json'

		with open(path, 'w', encoding='utf-8') as f:
			json.dump(report, f, ensure_ascii=False, indent=4)


	def __read_report(self, report_id):
		path = RP_FOLDER + str(report_id) + '.json'

		if os.path.isfile(path):
			with open(path, 'r') as f:
				report = json.load(f)
			return report
		else:
			print("[INFO] Report {} not found in \"{}\"".format(report_id, path))
			return None


	def __read_templates(self, report_type):
		path = RP_TEMPLATES_FOLDER + "templates" + ".json"
		if os.path.isfile(path):
			with open(path, 'r') as f:
				templates = json.load(f)
		else:
			print("[INFO] Templates not found in \"{}\"".format(path))

		return templates

	#-------------/ CREATE /-------------------------------------------------------------
	
	def __get_dates_times(self, report_data, schedule):
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
		dates_times = dates.get_dates_times(pattern, duration)

		return dates_times


	def __get_thead(self, report_data):
		report_type = report_data["report_type"]
		templates = self.__read_templates(report_type)
		thead_scheme = templates[report_type]

		thead = []
		for h in thead_scheme:
			if h == "dates":
				with DB() as db:
					teacher_id = db.get_teacher_id(report_data["teacher_name"])
					schedule = db.get_schedule(teacher_id)["data"]
				dates_times = self.__get_dates_times(report_data, schedule)
				thead.extend(dates_times)
			else:
				thead.append(h)

		return thead


	def __get_rows(self, report_data, thead):
		with DB() as db:
			students = db.get_students(report_data["group_name"])["data"]

		rows = []
		rows.extend([ [] for i in range(0, len(students))])

		for h in thead:
			if h == "id":
				for i, s in enumerate(students):
					rows[i].append(s["id"])
			elif h == "name":
				for i, s in enumerate(students):
					rows[i].append(s["name"])
			else:
				for i, s in enumerate(students):
					rows[i].append("")

		return rows


	def __create_report(self, report_data):
		thead = self.__get_thead(report_data)
		data = self.__get_rows(report_data, thead)

		front_report_data = self.__convert_report_data(report_data, convert_to="front")
		report = {
			"thead" : thead,
			"data"  : data
		}
		report.update(front_report_data)

		print_json(report)
		return report


	#----------------/ INTERFACE /----------------------------------------------------------------

	def get(self, report_data):
		report_data = self.__convert_report_data(report_data, convert_to="back")

		with DB() as db:
			report_id = db.get_report_id(report_data)

		if report_id:
			report = self.__read_report(report_id)
			if not report:
				report = self.__create_report(report_data)
				self.__write_report(report_id, report)

			return report
		else:
			report = self.__create_report(report_data)

			with DB() as db:
				db.insert_report(report_data)
				report_id = db.get_report_id(report_data) # dont't use SCOPE_IDENTITY (synchronization)

			self.__write_report(report_id, report)

			return report



	def set(self, report):
		report_data = self.__convert_report_data(report, convert_to="back")

		with DB() as db:
			report_id = db.get_report_id(report_data)

		if report_id:
			self.__write_report(report_id, report)
			return True
		else:
			return None




