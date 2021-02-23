# Parser
### Данная документация описывает все необходимые функции для модуля Parser. 

---

### Подключение модуля:

```python
from Parser import linkers
from Parser import parseSchedule

###
#============================ Здесь пишем код ================================#
###

# linkers - дубликат класса Linkers, который выполняет все необходимые 
# 	функции для получения ссылок
```

--- 

#### Функции получения ссылок со страниц: **https://home.mephi.ru/people** и **https://home.mephi.ru/tutors/id**


##### 1. **getLinkersListTeacher()**

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




##### 2. **getLinkersScheduleLearner()**

```python
	linkers.getLinkersScheduleLearner(
		self, 
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

### Функция парсинга и получения данных расписаний студента и преподавателя: **https://home.mephi.ru/study_groups/id/schedule** и **https://home.mephi.ru/tutors/id**

#### **getLinkersScheduleLearner()**

```python
from Parser import parseSchedule

print(parseSchedule(data = [
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
	- array of arrays of dicts:
	```json
	[
		...
		[
			...
			{
				"name": "Математический анализ", 
				"type": "Пр", 
				"time": "12:45 — 14:20", 
				"teacher": "Фролов Н.П.", 
				"place": "К-307"
			}, 
			{
				"name": "Программирование (алгоритмы и структуры данных)", 
				"type": "Лаб", 
				"time": "14:30 — 17:00", 
				"teacher": "Барыкин Л.Р.", 
				"place": "ДОТ"
			}
			...
		],
		[
			...
			{
				"name": "История", 
				"type": "Пр", 
				"time": "12:45 — 14:20", 
				"teacher": "Мякинина Н.П.", 
				"place": "ДОТ"}, 
			{
				"name": "Программирование (алгоритмы и структуры данных)", 
				"type": "Лаб", 
				"time": "14:30 — 17:00", 
				"teacher": "Барыкин Л.Р.", 
				"place": "ДОТ"
			}
			...
		]
		...
	]
	```