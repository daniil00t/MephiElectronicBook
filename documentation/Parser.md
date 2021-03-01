# Parser
### Данная документация описывает все необходимые функции для модуля Parser. 

---

### Подключение модуля:

```python
from Parser import *

###
#============================ Здесь пишем код ================================#
###

# linkers - дубликат класса Linkers, который выполняет все необходимые 
# 	функции для получения ссылок
```

--- 

#### Функции получения ссылок со страниц: **https://home.mephi.ru/people** и **https://home.mephi.ru/tutors/id**


##### 1. **getLinkersListTeacher()** - функция нужная для парсинга списка преподавателей и проверки их на условие существования ссылки на расписания

```python
	linkers.getLinkersListTeacher(
		main_link = "https://home.mephi.ru/ru/people", 
		endProccess=100
	)
```

 - Input: 
	- `main_link (string)` - базовый адрес для старницы, где находятся списки 
		ссылок преподавателей на их расписание, по умолчанию: 
		https://home.mephi.ru/ru/people
	- `endProccess (double)` - аргумент для дебагинга функции: является 
		ограничением выдачи данных до определенного процента proccess; по умолчанию
		равно 100%
- Output:
	- array of dicts:
	```json
	[
		...
		{
			"name": "Фролов Игорь Владимирович",
			"href": "https://home.mephi.ru/tutors/18353",
			"link": "https://home.mephi.ru/ru/users/14697/public"
		}
		...
	]
	```


##### 2. **getLinkersScheduleLearner()** - функция нужна для парсинга списка групп и вывод их ссылок на расписание

```python
	linkers.getLinkersScheduleLearner(
		main_link="https://home.mephi.ru/study_groups?term_id=11",
		selection="ALL"
	)
```

 - Input: 
	- `main_link (string)` - базовый адрес для старницы, где находятся списки 
		групп и ссылки на их расписание, по умолчанию: 
		https://home.mephi.ru/study_groups?term_id=11
	- `selection (re string)` - опционально-специальная выборка групп по их названию;
		по умолчанию `selection="ALL"`;
		Пример: `selection=r"Б\d0-5"` - выводит список групп с института ИИКС
- Output:
	- array of dicts:
	```json
	[
		...
		{
			"name": "Б17-В01", 
			"href": "https://home.mephi.ru/study_groups/11040/schedule"
		}
		...
	]
	```
	
##### 3. **getListLearners()** - функция нужна для парсинга списка студентов какой-то отдельной группы и вывод их контента

```python
	from Parser import getListLearners

	linkers.getLinkersScheduleLearner(
		main_link="https://home.mephi.ru/study_groups?term_id=11",
		selection="ALL"
	)
```

 - Input: 
	- `main_link (string)` - базовый адрес для старницы, где находятся списки 
		групп и ссылки на их расписание, по умолчанию: 
		https://home.mephi.ru/study_groups?term_id=11
	- `selection (re string)` - опционально-специальная выборка групп по их названию;
		по умолчанию `selection="ALL"`;
		Пример: `selection=r"Б\d0-5"` - выводит список групп с института ИИКС
- Output:
	- array of dicts:
	```json
	[
		...
		{
			"name": "Б17-В01", 
			"href": "https://home.mephi.ru/study_groups/11040/schedule"
		}
		...
	]
	```

----- 

### Функция парсинга и получения данных расписаний студента и преподавателя: **https://home.mephi.ru/study_groups/<id>/schedule** и **https://home.mephi.ru/tutors/<id>**

#### 1. **getScheduleLearner()** - функция нужна для парсинга расписания студентов

```python
from Parser import *

print(getScheduleLearner(data = [
	# ...
	{
		"name": "Б20-514",
		"href": "https://home.mephi.ru/study_groups/11161/schedule"	
	},
	{
		"name": "Б20-524",
		"href": "https://home.mephi.ru/study_groups/11164/schedule"	
	},
	{
		"name": "Б20-525",
		"href": "https://home.mephi.ru/study_groups/11164/schedule"	
	},
	# ...
], debug=False))
```

 - Input: 
	- `data (array of dicts)` - данные, то есть список групп, для которых мы получаем расписание в виде Output
	- `debug (boolean)` - опционально-специальный аргумент для дебагинга функции, в частности вывод ошибок от модуля Parser.module_requests и bs4
- Output:
	- array of dicts where each data is array of arrays of dicts:
	```json
	[ //groups
		{
			"name": "Б20-514",
			"data": 
				[//days
					[ //lessons
						{ //lesson
							"time": "12:44 — 14:21", 
							"name": "Математический анализ", 
							"teacher": ["Фролов Н.П."], 
							"even": 0,
							"type": "Пр", 
							"duration": "(08.02.2021 — 22.03.2021)",
							"place": "К-307"
						}
					]
				]
		},
		{
			"name": "Б20-515",
			"data": 
				[//days
					[ //lessons
						{ //lesson
							"time": "12:44 — 14:21", 
							"name": "Математический анализ", 
							"teacher": ["Фролов Н.П."], 
							"even": 0,
							"type": "Пр", 
							"duration": "(08.02.2021 — 22.03.2021)",
							"place": "К-307"
						}
					]
				]
		}
	]
	```

#### 2. **getScheduleTeacher()** - функция нужна для парсинга расписания преподавателя

```python
from Parser import *

print(getScheduleTeacher(data = [
	# ...
	{
 		"name": "Фролов Игорь Владимирович",
 		"href": "https://home.mephi.ru/tutors/18353"
 	}
	# ...
], debug=False))
```

 - Input: 
	- `data (array of dicts)` - данные, то есть список преподавателя, для которых мы получаем расписание в виде Output
	- `debug (boolean)` - опционально-специальный аргумент для дебагинга функции, в частности вывод ошибок от модуля module->requests и bs4
- Output:
	- array of dicts where each data is array of arrays of dicts:
	```json
	[ //teachers
		{
			"name": "Фролов Игорь Владимирович",
			"data": 
				[//days
					[ //lessons
						{ //lesson
							"time": "12:45 — 14:20", 
							"name": "Математический анализ", 
							"groups": [ "Б20-205", "Б20-215", "Б20-503", "Б20-504"],
							"even": 1,
							"type": "Пр",
							"duration": "(08.02.2021 — 22.03.2021)",
							"place": "К-307"
						}
					]
				]
		},
		{
			"name": "Гусев Алексей Игоревич",
			"data": 
				[//days
					[ //lessons
						{ //lesson
							"time": "08:30 — 10:05", 
							"name": "Дискретная математика (комбинаторика)", 
							"groups": [ "Б20-205", "Б20-215", "Б20-503", "Б20-504"],
							"even": 1,
							"type": "Пр",
							"duration": "(08.02.2021 — 22.03.2021)",
							"place": "ДОТ"
						}
					]
				]
		}
	]
	```