# Parser
#### Данная документация описывает все необходимые функции для модуля Parser. 

---

### Подключение модуля:

```python
from Parser import linkers

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
	

