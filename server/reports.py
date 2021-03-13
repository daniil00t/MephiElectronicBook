from server.config import *
from .db import *
import os
import json

class RM():
	def __create(self, report_data):
		# [FEATURE] create empty report correctly using group list and date module
		return  {
			"group"	: "Б20-101",
			"name"	: "Физика",
			"thead"	: ["id", "name", "хороший", "плохой", "злой", "итого"],
			"meta"	: {
				"content": 123
			},
			"data"	: [
				[1, "Иван Отличников", True, False, True, False],
				[2, "Владимир Хорошев",  True, True, True, True, ],
				[3, "Дмитрий Пересдачников", True, False, True, False]
			]
		}



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
		path = RP_FOLDER + str(report_id) + '.json'

		with open(path, 'w', encoding='utf-8') as f:
			json.dump(report, f, ensure_ascii=False, indent=4)



	def get(self, report_data):
		with DB() as db:
			report_id = db.get_report_id(report_data)
			if report_id:
				# [FEATURE] here it's better to check if the file exists
				report = self.__read(report_id)
				if not report:
					report = self.__create(report_data)
					self.__write(report_id, report)


				return report
			else:
				report = self.__create(report_data)

				with DB() as db:
					db.insert_report(report_data)
					report_id = db.get_report_id(report_data)

				self.__write(report_id, report)

				return(report)



	def set(self, report_data, report):
		with DB() as db:
			report_id = db.get_report_id(report_data)
		self.__write(report_id, report)




