from . import __requests
import bs4 as bs

def __filter(text):
	# в виде исключения
	if "Иностранный язык" in text:
		return "Иностранный язык"
	# Убираем лишние символы из html
	return text.replace("\xa0", " ").replace("\n", "")

def __filterForName(variant):
	name = variant["name"]

	for i in variant.keys():
		if i == "teachers":
			for teacher in variant["teachers"]:
				name = name.replace(teacher, "")
		elif i != "even":
			name = name.replace(variant[i], "")
	return name

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
				variant["name"] = __filterForName(variant)

				lessonsData.append(variant)
		scheduleGroupData.append(lessonsData)

	scheduleGroup["name"] = name
	scheduleGroup["data"] = scheduleGroupData
	return scheduleGroup


def getScheduleLearner(**itemsOfSchedule):
	debug = itemsOfSchedule["debug"]
	data = itemsOfSchedule["data"]

	scheduleGroups = [] # Global schedule for all groups
	
	for item in data:
		print(item['name'])
		scheduleGroups.append(__parseScheduleLearner(__requests.Request(item["href"])["data"], item["name"], debug))

	return scheduleGroups