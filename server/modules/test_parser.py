from Parser import *
import re


# print(
# 	linkers.getLinkersListTeacher(
# 		main_link = "https://home.mephi.ru/ru/people", 
# 		endProccess=5
# 	)
# )


print(getListLearners([
	{'name': 'Б20-101', 'href': 'https://home.mephi.ru/study_groups/11122/schedule'}, 
	{'name': 'Б20-102', 'href': 'https://home.mephi.ru/study_groups/11123/schedule'}, 
	# {'name': 'Б20-103', 'href': 'https://home.mephi.ru/study_groups/11124/schedule'},
	{'name': 'Б20-103', 'href': 'https://home.mephi.ru/study_groups/11124/schedule'}
], {"login": "sdm009", "password": "P101119767688"}, debug=True))



# print(getScheduleLearner(data = [
# 	# ...
# 	{
# 		"name": "Б20-514",
# 		"href": "https://home.mephi.ru/study_groups/11051/schedule"	
# 	}
# 	# ...
# ], debug=True))

# print(linkers.getLinkersListTeacher(
# 	main_link = "https://home.mephi.ru/ru/people", 
# 	endProccess=3.90
# ))


# print(getScheduleTeacher(data = linkers.getLinkersListTeacher(
# 	main_link = "https://home.mephi.ru/ru/people", 
# 	endProccess=4
# ), debug=True))


def cutName(name):
	reg = re.compile(r"([А-ЯA-Z][a-zа-я]+)([А-ЯA-Z]?\W)")
	# reg.finditer("Физическая оптикаЗанятие будет проходить очно не ранее апреля 2021г. в ауд. Т-208")[1].group()

	j=0
	for i in reg.finditer(name):
		# print(i.start(), i.group(), j)
		if j == 1:
			return name[:i.start()]
		j+=1

print(cutName("Физическая оптикаЗанятие будет проходить очно не ранее апреля 2021г. в ауд. Т-208"))
