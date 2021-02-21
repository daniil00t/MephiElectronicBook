import Parser.module_requests
import bs4 as bs

def Filter(text):
	# в виде исключения
	if "Иностранный язык" in text:
		return "Иностранный язык"
	return text.replace("\xa0", " ").replace("\n", "")


def parseSchedule(itemOfSchedule):
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
					time = Filter(lesson.find("div", class_="lesson-time").text)
					even = lesson.find("span", class_="lesson-square").get("class")[1][-1]
					_type = Filter(lesson.find("div", class_="label-lesson").text)
					teacher = Filter(", ".join(list((
						k.find("a", class_="text-nowrap").text for k in lesson.find_all("span", class_="text-nowrap")
					))))
					place = Filter(lesson.find("div", class_="pull-right").text)
					name = Filter(lesson.text)
					name = name.replace(time, "").replace(teacher, "").replace(place, "").replace(_type, "")
					day.append({
						"name": name,
						"type": _type,
						"time": time,
						"teacher": teacher,
						"place": place
					})
				except Exception as e:
					print(e)
				


		data.append(day)
	return data

