from . import reqs
from urllib.parse import quote
import bs4 as bs
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

	def __parseLinkersScheduleLearner(self, soup):
		res = []
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
		request = reqs.Request(main_link)
		if request["error"]:
			print("Error: href incorrect!")
			return {}
		else:
			soup = request["data"] 
		return self.__parseLinkersSchLerSelection(
			self.__parseLinkersScheduleLearner(soup), 
			selection
		)

	###
	#========================== Functions for Teacher ===========================#
	###

	def __parseLinkersListTeacher(self, soup):
		res = []
		for item in soup.find_all("a", class_="list-group-item-user-public"):
			res.append({
				"name": item.find("h4", class_="media-heading").text.replace("\n", ""),
				"href": "https://home.mephi.ru" + item.get('href').replace("\n", "")
			})
		return res


	# def __filterLinkersTeacher(self, obj):
	# 	enableTypesTeachers = ['профессор', 'доцент', "инженер", "преподаватель", "заведующий"]
	def __printInfo(self, info):
		if info["errorState"]:
			print(f"[ERROR] {info['errorMsg']}")
		else:
			print(f"[INFO] Parsed {info['accessLinks']} links")
			print(f"[INFO] hasn't parsed {info['crushLinks']} links")
	def getLinkersListTeacher(self, main_link = "https://home.mephi.ru/ru/people", endProccess=100, debug=False):
		''' Пример output - массив словарей:
		 ...
		 {
		 	"name": "Фролов Игорь Владимирович",
		 	"href": "https://home.mephi.ru/tutors/18353",
		 	"link": "https://home.mephi.ru/ru/users/14697/public"
		 }
		 ...
		'''

		result = []
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
			iteratorZ0 = 0
			for i in chars:
				# print(f"{main_link}?char={quote(i)}")
				countPages = len(reqs.Request(f"{main_link}?char={quote(i)}")["data"].find_all("li", class_="page"))

				if countPages > 4:
					countPages = len(reqs.Request(f"{main_link}?char={quote(i)}&page=5")["data"].find_all("li", class_="page"))
				if countPages == 0:
					countPages = 1

				iteratorZ0 += 1
				iteratorZ1 = 0
				for j in range(countPages):
					request = reqs.Request(f"{main_link}?char={quote(i)}&page={j+1}")
					iteratorZ2 = 0
					Teachers = self.__parseLinkersListTeacher(request["data"])
					for k in Teachers:
						proccessAsProcents = round((iteratorZ0/len(chars) + iteratorZ1 / (countPages) / len(chars) + iteratorZ2 / len(Teachers) / (countPages) / len(chars)) * 100, 2)
						print(f"proccess: {proccessAsProcents}%")
						###
							#==================================== Testing module ====================================#
						###
						if proccessAsProcents >= endProccess and debug:
							self.__printInfo(info)
							return result 
						###
							#================================== Testing module End ==================================#
						###	
						try:
							link = reqs.Request(k['href'])["data"].find("a", class_="btn btn-primary btn-block hidden-print").get("href")
							if link != "":
								result.append({
									# "name": self.getName(k["name"]),
									"name": k["name"],
									"href": k["href"],
									"link": "https://home.mephi.ru" + link
								})
								info["accessLinks"] += 1
						except Exception as e:
							print("Видимо, чел не преподает:(")
							info["crushLinks"] += 1
						iteratorZ2 += 1
					iteratorZ1+=1
		self.__printInfo(info)
		return result
