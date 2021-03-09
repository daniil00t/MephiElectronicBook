from Parser import *
import re
import json

def print_json(data):
	print(json.dumps(data, ensure_ascii=False, indent=2))


# print(
# 	linkers.getLinkersListTeacher(
# 		main_link = "https://home.mephi.ru/ru/people", 
# 		endProccess=5
# 	)
# )



# print_json(getScheduleTeacher(data = linkers.getLinkersListTeacher(
# 	main_link = "https://home.mephi.ru/ru/people", 
# 	endProccess=3.8
# ), debug=True))

# print(linkers.getLinkersListTeacher(
# 	main_link = "https://home.mephi.ru/ru/people", 
# 	endProccess=3.90
# ))


print_json(getScheduleTeacher(data = [
	{
		"name": "",
		"link": "https://home.mephi.ru/tutors/18416"
	}

], debug=True))
