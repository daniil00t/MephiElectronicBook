from . import reqs
import bs4 as bs
import re

wday = [
	"Понедельник",
	"Вторник",
	"Среда",
	"Четверг",
	"Пятница",
	"Суббота"
]

def __filter(text):
	# в виде исключения
	# if "Иностранный язык" in text:
	# 	return "Иностранный язык"
	# Убираем лишние символы из html
	return text.replace("\xa0", " ").replace("\n", "").replace("\"", "").replace(",", "")

def __filterForNameLearner(variant):
	name = variant["name"]

	for i in variant.keys():
		if i == "teachers":
			for teacher in variant["teachers"]:
				name = name.replace(teacher, "")
		elif i != "even":
			name = name.replace(variant[i], "")
	return cutName(name)

def __triedDuration(soup, debug):
	try:
		return __filter(soup.find("span", class_="lesson-dates").text)
	except Exception as e:
		return "ALL_SEMESTER"
		if debug:
			print(e)

def __triedType(soup, debug):
	try:
		return __filter(soup.find("div", class_="label-lesson").text)
	except Exception as e:
		return "NONE_TYPE"
		if debug:
			print(e)


###
#================================= For Learner ================================#
###

def __parseScheduleLearner(soup, name, debug):
	scheduleGroup = {} # result this function
	
	scheduleGroupData = []
	# start parse
	daysSoup = soup.find_all("div", class_="list-group")
	for daySoup in daysSoup:
		lessonsSoup = daySoup.find_all("div", class_="list-group-item")
		lessonsData = []
		for lesson in lessonsSoup:
			commonTime = __filter(lesson.find("div", class_="lesson-time").text)
			variantsSoup = lesson.find_all("div", class_="lesson")
			for variantSoup in variantsSoup:
				variant = {}
				variant["time"] = commonTime
				variant["even"] = int(variantSoup.find("span", class_="lesson-square").get("class")[1][-1])
				variant["type"] = __triedType(variantSoup, debug)
				variant["duration"] = __triedDuration(variantSoup, debug)
				variant["place"] = __filter(variantSoup.find("div", class_="pull-right").text)
				
				# parse teachers
				variant["teachers"] = []
				teachersSoup = variantSoup.find_all("span", class_="text-nowrap")
				

				for i in teachersSoup:
					variant["teachers"].append(__filter(i.text))
				
				# parse name
				variant["name"] = __filter(variantSoup.text)
				variant["name"] = __filterForNameLearner(variant)

				lessonsData.append(variant)
		scheduleGroupData.append(lessonsData)

	scheduleGroup["name"] = name
	scheduleGroup["data"] = scheduleGroupData
	return scheduleGroup


def getScheduleLearner(**itemsOfSchedule):
	debug = itemsOfSchedule["debug"]
	data = itemsOfSchedule["data"]
	# data = 
	# 	[
	# 		# ...
	# 		{
	# 			"name": "Б20-514",
	# 			"href": "https://home.mephi.ru/study_groups/11161/schedule"	
	# 		},
	# 		{
	# 			"name": "Б20-524",
	# 			"href": "https://home.mephi.ru/study_groups/11164/schedule"	
	# 		}
	# 		# ...
	# 	]
	# 
	# debug = True | False

	scheduleGroups = [] # Global schedule for all groups
	
	for item in data:
		print(item['name'])
		scheduleGroups.append(__parseScheduleLearner(reqs.Request(item["href"])["data"], item["name"], debug))

	return scheduleGroups





###
#================================= For Teacher ================================#
###



def __filterForNameTeacher(variantSoup):
	# name = ""
	# try:
	# 	_str = re.search(r"</div>(.*)<i", __filter(str(variantSoup))).group(0)
	# 	# _str = re.sub('<[^>]*>', '', _str)
	# 	arr_span = bs.BeautifulSoup(_str, features="html.parser").find_all("span")
	# 	arr_div = bs.BeautifulSoup(_str, features="html.parser").find_all("div")
		
	# 	# print(__filter(str(variantSoup)))
	# 	print(_str)
	# 	variant["name"] = _str
	# except Exception as e:
	# 	print(e)
	# 	variant["name"] = "Не определено"
	for cnt in variantSoup.contents:
		if not (("<" in str(cnt)) or (">" in str(cnt))) and len(__filter(cnt)) != 0:
			return __filter(cnt)
		# try:
		# 	print(re.findall(r"$\s*?([A-ZА-ЯЁ].*?\.)", __filter(cnt)))
		# except Exception as e:
		# 	print(e)
	# for i in variantSoup.find_all("label-lesson"):
	# 	print(i.next_sibling)
	
	
	# for i in variant.keys():
	# 	if i == "groups":
	# 		for group in variant["groups"]:
	# 			name = name.replace(group, "")
	# 	elif i != "even":
	# 		name = name.replace(variant[i], "").replace(",", "").replace("\"", "")

	# Избавляемся от ненужных фиговин(спасибо разрабам сайта)
	# Нужно взять и написать регулярку, основываясь на том, что название предмета - это
	# Сначала заглавная буква, а потом последующие до [заглавных, скобок, запятых, ;, и прочих]
	# в общем всех, которые не маленькие английские или русские буквы

	# Не знаю.. совсем не уверен в работоспособности следующего кода, но суть понятна
	# re.findall(r"([А-ЯA-Z][a-zа-я]+)([А-ЯA-Z]?\c)").groups[0]
	# return name


def __parseScheduleTeacher(soup, name, debug):
	scheduleGroup = {} # result this function
	
	scheduleGroupData = []
	# start parse
	daysSoup = soup.find_all("div", class_="list-group")
	wDaySoup = soup.find_all("h3", class_="lesson-wday")
	dayCounter = 0
	for daySoup in daysSoup:
		currentWDay = wday.index(__filter(wDaySoup[dayCounter].text))
		lessonsSoup = daySoup.find_all("div", class_="list-group-item")
		lessonsData = []
		for lesson in lessonsSoup:
			commonTime = __filter(lesson.find("div", class_="lesson-time").text)
			variantsSoup = lesson.find_all("div", class_="lesson")
			for variantSoup in variantsSoup:
				variant = {}
				variant["time"] = commonTime
				variant["even"] = int(variantSoup.find("span", class_="lesson-square").get("class")[1][-1])
				variant["type"] = __triedType(variantSoup, debug)
				variant["duration"] = __triedDuration(variantSoup, debug)
				variant["place"] = __filter(variantSoup.find("div", class_="pull-right").text)
				# parse groups
				variant["groups"] = []
				groupsSoup = variantSoup.find_all("a", class_="text-nowrap")
				for i in groupsSoup:
					if i.get("href").split("/")[-1] == "schedule":
						variant["groups"].append(__filter(i.text))
				variant["name"] = __filterForNameTeacher(variantSoup)
				variant["wday"] = currentWDay

				lessonsData.append(variant)
		scheduleGroupData.append(lessonsData)
		dayCounter += 1

	scheduleGroup["name"] = name
	scheduleGroup["data"] = scheduleGroupData
	return scheduleGroup


def getScheduleTeacher(**itemsOfSchedule):
	debug = itemsOfSchedule["debug"]
	data = itemsOfSchedule["data"]
	scheduleGroups = [] # Global schedule for all groups
	
	for item in data:
		print(item['name'])
		scheduleGroups.append(__parseScheduleTeacher(reqs.Request(item["link"])["data"], item["name"], debug))

	return scheduleGroups