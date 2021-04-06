from . import reqs
from urllib.parse import quote
import bs4 as bs
import math
import re

class Linkers:
	'''
		Данный класс предназначен для доставания линков для расписаний студентов, преподавателей 
		и списков путем парсинга через <reqs>
	'''

	def __init__(self):
		pass

	def getName(self, name):
		arr = name.split(" ")
		return f"{arr[0]} {arr[1][0]}.{arr[2][0]}."
	###
	#============================= Functions For Learner ========================#
	###

	def __parseLinkersScheduleLearner(self, soups):
		res = []
		for soup in soups:
			for item in soup.find_all("a", class_="list-group-item"):
				res.append({
					"name": item.text.replace("\n", ""),
					"href": "https://home.mephi.ru" + item.get('href').replace("\n", "")
				})
		return res
	def __parseLinkersSchLerSelection(self, linkers, selection):
		res = []
		if selection == "ALL":
			return linkers
		else:
			for i in linkers:
				if len(re.findall(selection, i["name"])) != 0:
					res.append(i)
			return res

	def getLinkersScheduleLearner(
		self, 
		main_link="https://home.mephi.ru/study_groups?term_id=11",
		selection="ALL"
	):
		# Пример данных - массив словарей:
		# ...
		# "Б20-514" - "https://home.mephi.ru/study_groups/11161/schedule"
		# ...
		soups = []
		orgs = [[0, 1, 2, 3, 4], [0, 1, 2, 3]]
		indexOrg = 1
		for org in orgs:
			for level in org:
				request = reqs.Request(main_link + f"&organization_id={indexOrg}&level={level}")
				if request["error"]:
					print("Error: href incorrect!")
					return {}
				else:
					soup = request["data"]
					soups.append(soup)
			indexOrg += 1
		return self.__parseLinkersSchLerSelection(
			self.__parseLinkersScheduleLearner(soups),
			selection
		)

	###
	#========================== Functions for Teacher ===========================#
	###
	def __parseListTeachers(self, soup, countTeachers, index, stopedIndex):
		links = []
		listOfLinks = soup.find_all("a", class_="list-group-item")
		stoped = False
		for link in listOfLinks:
			links.append({
				"name": link.text,
				"link": "https://home.mephi.ru" + link.get("href")
			})
			print(f"[INFO] Proccess: {round(index / (countTeachers - 1) * 100, 2)}%")
			if index >= stopedIndex:
				stoped = True
				return {
					"links": links,
					"index": index,
					"stoped": stoped
				}
			index += 1
		return {
			"links": links,
			"index": index,
			"stoped": stoped
		}

	def getLinkersListTeacher(self, main_link = "https://home.mephi.ru/tutors?term_id=11", endProccess=100, debug=False):
		result = []
		# const max count teacher for proccess procents
		countTeachers = stopedIndex = 1194
		if debug and endProccess > 0:
			stopedIndex = math.ceil(countTeachers * endProccess / 100)
		info = {
			"crushLinks": 0,
			"accessLinks": 0,
			"errorState": False,
			"errorMsg": ""
		}
		chars = ['А','Б','В','Г','Д','Е','Ё','Ж','З','И','К','Л','М','Н','О','П','Р','С','Т','У','Ф','Х','Ц','Ч','Ш','Щ','Э','Ю','Я']
		# request = reqs.Request(main_link)
		
		if reqs.Request(main_link)["error"]:
			print("Error: href incorrect!")
			info["errorState"] = True
			info["errorMsg"] = "href incorrect"
			return []
		else:
			index = 0
			for char in chars:
				soup = reqs.Request(main_link + f"&char={quote(char)}")['data']
				parsedLinks = self.__parseListTeachers(soup, countTeachers, index, stopedIndex)
				if not parsedLinks["stoped"]:
					result += parsedLinks["links"]
					index = parsedLinks["index"]
				else:
					result += parsedLinks["links"]
					return result
		return result