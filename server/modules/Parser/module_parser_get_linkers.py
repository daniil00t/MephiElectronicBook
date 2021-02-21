import Parser.module_requests
from urllib.parse import quote
import bs4 as bs
import time

class Linkers:
	'''
		Данный класс предназначен для доставания линков для расписаний студентов, преподавателей 
		и списков путем парсинга через <module_requests>
	'''

	def __init__(self):
		pass

	def __parseLinkersScheduleLearner(self, soup):
		res = []
		for item in soup.find_all("a", class_="list-group-item"):
			res.append({
				"name": item.text.replace("\n", ""),
				"href": "https://home.mephi.ru" + item.get('href').replace("\n", "")
			})
		return res
	def __parseLinkersListTeacher(self, soup):
		res = []
		for item in soup.find_all("a", class_="list-group-item-user-public"):
			res.append({
				"name": item.find("h4", class_="media-heading").text.replace("\n", ""),
				"href": "https://home.mephi.ru" + item.get('href').replace("\n", "")
			})
		return res

	def getLinkersScheduleLearner(self, main_link = "https://home.mephi.ru/study_groups?term_id=11"):
		# Пример данных - массив словарей {name: link}:
		# ...
		# "Б20-514" - "https://home.mephi.ru/study_groups/11161/schedule"
		# ...
		request = Parser.module_requests.Request(main_link)
		if request["error"]:
			print("Error: href incorrect!")
			return {}
		else:
			soup = request["data"] 
		return self.__parseLinkersScheduleLearner(soup)

	def getLinkersScheduleTeacher(self):
		return {}

	def getLinkersListLearner(self):
		return {}

	# def __filterLinkersTeacher(self, obj):
	# 	enableTypesTeachers = ['профессор', 'доцент', "инженер", "преподаватель", "заведующий"]

	def getLinkersListTeacher(self, main_link = "https://home.mephi.ru/ru/people"):
		# Пример данных - массив словарей {name: value}:
		# ...
		# "id": "18353" - additional
		# "name": "Фролов Игорь Владимирович"
		# "href": "https://home.mephi.ru/tutors/18353"
		# ...
		res = []
		chars = ['А','Б','В','Г','Д','Е','Ё','Ж','З','И','К','Л','М','Н','О','П','Р','С','Т','У','Ф','Х','Ц','Ч','Ш','Щ','Э','Ю','Я']
		request = Parser.module_requests.Request(main_link)
		
		if request["error"]:
			print("Error: href incorrect!")
			return {}
		else:
			iteratorZ0 = 0
			for i in chars:
				countPages = len(Parser.module_requests.Request(f"{main_link}?char={quote(i)}")["data"].find_all("li", class_="page"))
				if countPages > 4:
					countPages = len(Parser.module_requests.Request(f"{main_link}?char={quote(i)}&page=5")["data"].find_all("li", class_="page"))

				_res = []
				iteratorZ0 += 1
				iteratorZ1 = 0
				for j in range(countPages):
					
					request = Parser.module_requests.Request(f"{main_link}?char={quote(i)}&page={j+1}")
					iteratorZ2 = 0
					Teachers = self.__parseLinkersListTeacher(request["data"])
					for k in Teachers:
						print(f"proccess: {round((iteratorZ0/(len(chars)-1) + iteratorZ1 / (countPages-1) / (len(chars)-1) + iteratorZ2 / (len(Teachers) - 1) / (countPages-1) / (len(chars)-1)) * 100, 2)}%")
						try:
							link = Parser.module_requests.Request(k['href'])["data"].find("a", class_="btn btn-primary btn-block hidden-print").get("href")
							if link != "":
								_res.append({
									"name": k["name"],
									"href": k["href"],
									"link": "https://home.mephi.ru" + link
								})
						except Exception as e:
							print("Видимо, чел не преподает:(")
						iteratorZ2 += 1
					iteratorZ1+=1
				print(_res) # Промежуточные данные
				res += _res

				
		return res
