from Parser import *
import re
import json

def print_json(data):
	print(json.dumps(data, ensure_ascii=False, indent=2))


# print_json(
# 	linkers.getLinkersListTeacher(endProccess=1, debug=True)
# )

# print_json(getListLearners([
# 	{'name': 'Б20-101', 'href': 'https://home.mephi.ru/study_groups/11122/schedule'}, 
# 	{'name': 'Б20-102', 'href': 'https://home.mephi.ru/study_groups/11123/schedule'}, 
# 	# {'name': 'Б20-103', 'href': 'https://home.mephi.ru/study_groups/11124/schedule'},
# 	{'name': 'Б20-103', 'href': 'https://home.mephi.ru/study_groups/11124/schedule'}
# ], {"login": "sdm129", "password": "е131147675234"}, debug=True))



# print_json(getScheduleTeacher(data = linkers.getLinkersListTeacher(
# 	endProccess=1, debug=True
# ), debug=True))

# print(linkers.getLinkersListTeacher(
# 	main_link = "https://home.mephi.ru/ru/people", 
# 	endProccess=3.90
# ))

# print_json(getScheduleTeacher(data = [
# 	{
# 		"name": "Агамова Оксана Данияловна",
# 		"link": "https://home.mephi.ru/tutors/19241"
# 	}
# ], debug=True))


# print_json(
# 	getScheduleTeacher(data = linkers.getLinkersListTeacher(debug=False),
# 	debug=True)
# )
