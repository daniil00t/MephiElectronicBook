import bs4 as bs
from Parser.module_requests import *
import re

# Global Vars
Group = "Б20-514"
Link = ""
Names_arr = []
Links_arr = []
Error = False


#init for start
def init(NamesLink, LinksLink):
	global Names_arr
	global Links_arr
	global Link

	Names = open("./data/" + NamesLink, encoding="utf-8").read()
	Links = open("./data/" + LinksLink, encoding="utf-8").read()
	Names_arr = Names.split("\n")
	Links_arr = Links.split("\n")
	if Group in Names_arr:
		Link = Links_arr[Names_arr.index(Group)]
		Error = False
	else:
		Error = True
	print(Group, " - ", Link)
	return Error


# 
def Filter(text):
	# в виде исключения
	if "Иностранный язык" in text:
		return "Иностранный язык"
	return text.replace("\xa0", " ").replace("\n", "")

def Parse(soup):
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
				time = Filter(lesson.find("div", class_="lesson-time").text)
				_type = Filter(lesson.find("div", class_="label-lesson").text)
				teacher = Filter(", ".join(list((k.find("a", class_="text-nowrap").text for k in lesson.find_all("span", class_="text-nowrap")))))
				place = Filter(lesson.find("div", class_="pull-right").text)
				name = Filter(lesson.text)
				name = name.replace(time, "").replace(teacher, "").replace(place, "").replace(_type, "")


			item["name"] = name
			item["type"] = _type
			item["time"] = time
			item["teacher"] = teacher
			item["place"] = place
			day.append(item)
		data.append(day)
	# open("./answers.txt", "a+").write(str(ans[0].text.split(" ")[1]) + "\n")
	return data


if __name__ == "__main__":
	if not init("Names.txt", "Links.txt"):
		soup = Request(Link)
		print(Parse(soup))
	else:
		print("Error! Please check your enter data")