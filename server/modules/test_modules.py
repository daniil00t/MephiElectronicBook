from Parser import *
from Dates import *
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

# print(dates.get_dates_update(
# 	[1, 0, 1, 0, 0, 1],
# 	"22.03.2021",
# 	"17.04.2021",
# 	# pattern = "%d.%m.%Y",
# 	# count_days = 4
# ))


# # test dates
# print(dates.get_dates([], "(28.02.2021 - 10.05.2021)"))
# print(dates.get_dates([], "(28.02.2021 10.05.2021)"))
# print(dates.get_dates([], "()"))
# print(dates.get_dates([], "ALL_SEMESTER"))
# print(dates.get_dates([], "(28.02.2021)")) 
# print(dates.get_dates([], ""))

get_dates(None, None)