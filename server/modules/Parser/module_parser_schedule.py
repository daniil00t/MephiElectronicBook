import Parser.module_requests
import bs4 as bs

def __Filter(text):
	# в виде исключения
	if "Иностранный язык" in text:
		return "Иностранный язык"

	# Убираем лишние символы из html
	return text.replace("\xa0", " ").replace("\n", "")


def parseSchedule(**itemsOfSchedule):
	# print(itemsOfSchedule)
	if(len(itemsOfSchedule['data']) == 1):
		itemOfSchedule = itemsOfSchedule["data"][0]
		
		###
		#============================ Parsing one item ============================#
		###
		soup = Parser.module_requests.Request(itemOfSchedule["href"])['data']
		data = []
		days = soup.find_all("div", class_="list-group")

		# Data from html:
		for day in days:
			lessons = day.find_all("div", class_="list-group-item")
			day = []
			for lesson in lessons:
				item = {}
				# particle for even and odd weeks
				if len(lesson.find_all("div", class_="lesson-lessons")) > 1:
					pass
				else:
					try:
						time = __Filter(lesson.find("div", class_="lesson-time").text)
						even = lesson.find("span", class_="lesson-square").get("class")[1][-1]
						_type = __Filter(lesson.find("div", class_="label-lesson").text)
						teacher = __Filter(", ".join(list((
							k.find("a", class_="text-nowrap").text for k in lesson.find_all("span", class_="text-nowrap")
						))))
						place = __Filter(lesson.find("div", class_="pull-right").text)
						name = __Filter(lesson.text)
						name = name.replace(time, "").replace(teacher, "").replace(place, "").replace(_type, "")
						
						day.append({
							"name": name,
							"type": _type,
							"time": time,
							"teacher": teacher,
							"even": even,
							"place": place
						})
					except Exception as e:
						if itemsOfSchedule["debug"]:
							print(e)
						pass
			data.append(day)
		###
		#================== End Block Of Parsing One Item =========================#
		###

		print(f"{itemOfSchedule['name']} processed")
		return data
	elif len(itemsOfSchedule['data']) > 1:
		res = []
		for i in itemsOfSchedule['data']:
			res += parseSchedule(data = [i], debug=itemsOfSchedule['debug'])
		return res
	else:
		return []

