from Parser import *
import json

DATA_AUTH = {}

# Config file is private and locate in local place
with open('./config.json') as json_file:
	data = json.load(json_file)
	DATA_AUTH = data

# print(
# 	linkers.getLinkersListTeacher(
# 		main_link = "https://home.mephi.ru/ru/people", 
# 		endProccess=7
# 	)
# )


# print(getListLearners([
# 	{'name': 'Б20-101', 'href': 'https://home.mephi.ru/study_groups/11122/schedule'}, 
# 	{'name': 'Б20-102', 'href': 'https://home.mephi.ru/study_groups/11123/schedule'}, 
# 	{'name': 'Б20-103', 'href': 'https://home.mephi.ru/study_groups/11124/schedule'}
# ], {"login": DATA_AUTH["LOGIN"], "password": DATA_AUTH["PASSWORD"]}, debug=True))



# print(getScheduleLearner(data = [
# 	# ...
# 	{
# 		"name": "Б20-514",
# 		"href": "https://home.mephi.ru/study_groups/11161/schedule"	
# 	},
# 	{
# 		"name": "Б20-524",
# 		"href": "https://home.mephi.ru/study_groups/11164/schedule"	
# 	}
# 	# ...
# ], debug=True))

# print(getScheduleTeacher(data = [
# 	# ...
# 	{
# 		"name": "Автушко Вера Павловна",
# 		"href": "	"
# 	},
# 	{
# 		"name": "Стёпин Евгений Викторович",
# 		"href": "https://home.mephi.ru/tutors/18328"
# 	}
# 	# ...
# ], debug=True))