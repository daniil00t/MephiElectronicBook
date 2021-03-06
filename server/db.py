from .config import *
from .config_auth import *
from .modules import Parser as parser

import mysql.connector as mysql

import os
import re
import json
import pickle
import glob

def print_json(data):
	print(json.dumps(data, ensure_ascii=False, indent=4))


class DB:
	def __init__(self):
		self.__make_parser_cacheable()


	def __enter__(self):
		self.connection = mysql.connect(
			user     = DB_USER,
			password = DB_PASSWORD,
			host     = DB_HOST,
			database = DB_DATABASE
		)
		self.connection.autocommit = False
		self.cursor = self.connection.cursor()

		return self


	def __exit__(self, exc_type, exc_val, exc_tb):
		self.connection.commit()
		self.cursor.close()
		self.connection.close()

		return type is None


	#-------------------/ EXECUTION /--------------------

	def __execute(self, cmd):
		# [FEATURE] add multiple commands executing
		self.cursor.execute(cmd)
		return self.cursor.fetchall()


	def __execute_f(self, filename):
		if VERBOSE: print("\n[INFO] Executing SQL script file: {}".format(filename))

		cmd = ""
		with open(filename) as f:
			for line in f.readlines():
				if re.match(r'--', line):
					continue

				cmd += line
				if re.search(r';$', line):
					if VERBOSE: print("\n[INFO] Executing SQL statement:\n{}".format(cmd))
					self.__execute(cmd)
					cmd = ""


	#-------------------/ CACHE /--------------------

	def __make_cacheable(self, filename, use, save, func):
		def wrapper(*args, **kwargs):
			path = DB_CACHE_FOLDER + filename + '.pkl'

			cache_used = False

			if (DB_USE_CACHE or use) and os.path.isfile(path):
				with open(path, 'rb') as f:
					result = pickle.load(f)
				cache_used = True

				print("[INFO] Using cached {}.".format(filename))
			else:
				result = func(*args, **kwargs)

			if (DB_SAVE_CACHE or save) and not cache_used:
				with open(path, 'wb') as f:
					pickle.dump(result, f)

				print("[INFO] {} cached.".format(filename))

			return result

		return wrapper

	def __make_parser_cacheable(self):
		parser.linkers.getLinkersScheduleLearner = self.__make_cacheable(
			"groups_linkers", DB_USE_CACHE_LG, DB_SAVE_CACHE_LG,
			parser.linkers.getLinkersScheduleLearner)

		parser.linkers.getLinkersListTeacher = self.__make_cacheable(
			"teachers_linkers", DB_USE_CACHE_LT, DB_SAVE_CACHE_LT,
			parser.linkers.getLinkersListTeacher)

		parser.getScheduleLearner = self.__make_cacheable(
			"groups_shedules", DB_USE_CACHE_SG, DB_SAVE_CACHE_SG,
			parser.getScheduleLearner)

		parser.getScheduleTeacher = self.__make_cacheable(
			"teachers_shedules", DB_USE_CACHE_ST, DB_SAVE_CACHE_ST,
			parser.getScheduleTeacher)

		parser.getListLearners = self.__make_cacheable(
			"students_list", DB_USE_CACHE_L, DB_SAVE_CACHE_L,
			parser.getListLearners)

	def __clear_cache(self):
		files = glob.glob(DB_CACHE_FOLDER + "*")
		for f in files:
		    #os.remove(f)
		    print("{} will be deleted next time :)".format(f))


	#-------------------/ INSERTION /--------------------


	def insert_groups(self, groups):
		args = []
		for g in groups:
			if g == "":
				continue
			args.append('''(\"{}\")'''.format(g))

		if args == []:
			return

		cmd   = '''INSERT IGNORE INTO teams (name)''' \
				'''VALUES {}'''.format(",".join(args))
		self.__execute(cmd)


	def insert_teachers(self, teachers):
		args = []
		for t in teachers:
			if t == "":
				continue
			args.append('''(\"{}\")'''.format(t))

		if args == []:
			return

		cmd   = '''INSERT IGNORE INTO teachers (name)''' \
				'''VALUES {}'''.format(",".join(args))
		self.__execute(cmd)


	def insert_subjects(self, subjects):
		args = []
		for s in subjects:
			if s["name"] == "":
				continue
			args.append('''(\"{}\", \"{}\")'''.format(s["name"], s["duration"]))

		if args == []:
			return

		cmd   = '''INSERT IGNORE INTO subjects (name, duration)''' \
				'''VALUES {}'''.format(",".join(args))

		self.__execute(cmd)


	def insert_students(self, students):
		# [FEATURE] make this query more efficiency by using "SELECT id ..." once for each group
		args = []
		for s in students:
			if s["name"] == "":
				continue
			args.append('''((SELECT id FROM teams WHERE name = \"{}\"), \"{}\", {})'''.format(
					s["group"], s["name"], s["count"]))

		if args == []:
			return

		cmd   = '''INSERT IGNORE INTO students (team_id, name, count)''' \
				'''VALUES {}'''.format(",".join(args))
		self.__execute(cmd)


	def insert_lessons(self, lessons):
		# [FEATURE] use table "classes_groups", because there are many-to-many relationships
		# [FEATURE] make this query more efficiency


		# 1) insert lessons
		args = []
		for l in lessons:
			if l["subject"] == "":
				continue
			args.append(
				'''((SELECT id FROM teachers WHERE name = \"{}\"),''' \
				'''(SELECT id FROM subjects WHERE name = \"{}\"),''' \
				'''{}, \"{}\", {},''' \
				'''\"{}\", \"{}\")'''.format(
					l["teacher"],
					l["subject"],
					l["wday"], l["time"], l["even"],
					l["type"], l["place"]
				)
			)

		if args == []:
			return

		cmd   = '''INSERT IGNORE INTO lessons''' \
				'''(teacher_id, subject_id, wday, clock, even, type, place)''' \
				'''VALUES {}'''.format(",".join(args))
		self.__execute(cmd)


		# 2) insert lessons_teams
		args = []
		for l in lessons:
			if l["subject"] == "":
				continue
			for group in l["groups"]:
				args.append(
					'''((SELECT id FROM teams WHERE name = \"{}\"),''' \
					'''(SELECT id FROM lessons WHERE ''' \
					'''teacher_id = (SELECT id FROM teachers WHERE name = \"{}\") AND ''' \
					'''subject_id = (SELECT id FROM subjects WHERE name = \"{}\") AND ''' \
					'''wday = {} AND clock = \"{}\" AND even = {} AND ''' \
					'''type = \"{}\" AND place = \"{}\"))'''.format(
						group,
						l["teacher"],
						l["subject"],
						l["wday"], l["time"], l["even"],
						l["type"], l["place"]
					)
				)

		if args == []:
			return

		cmd   = '''INSERT IGNORE INTO lessons_teams (team_id, lesson_id)''' \
				'''VALUES {}'''.format(",".join(args))
		self.__execute(cmd)

	#-------------------/ UPDATE /--------------------


	def update_groups(self):
		# [FEATURE] add all groups, otherwise there will be errors
		groups_linkers = parser.linkers.getLinkersScheduleLearner(selection=DB_GROUPS_LIMIT)

		groups   = []
		for group in groups_linkers:
			groups.append(group["name"])

		self.insert_groups(groups)


	def update_teachers(self):
		teachers_linkers = parser.linkers.getLinkersListTeacher(endProccess=DB_TEACHERS_LIMIT)

		teachers = []
		for tl in teachers_linkers:
			teachers.append(tl["name"])

		self.insert_teachers(teachers)

		
	def update_subjects(self):
		teachers_linkers = parser.linkers.getLinkersListTeacher(endProccess=DB_TEACHERS_LIMIT)
		teachers_shedules = parser.getScheduleTeacher(data = teachers_linkers, debug=False)

		subjects = []
		for teacher in teachers_shedules:
			for day in teacher["data"]:
				for lesson in day:
					subjects.append({
						"name" : lesson["name"],
						"duration" : lesson["duration"]
					})

		self.insert_subjects(subjects)


	def update_students(self):
		groups_linkers = parser.linkers.getLinkersScheduleLearner(selection=DB_GROUPS_LIMIT)
		students_list = parser.getListLearners(groups_linkers, {
			"login"    : AUTH_LOGIN,
			"password" : AUTH_PASS
		})

		students = []
		for group in students_list:
			for student in group["data"]:
				students.append({
					"group" : group["name"],
					"name"  : student["name"],
					"count" : student["id"]
				})

		self.insert_students(students)
		

	def update_lessons(self):
		teachers_linkers = parser.linkers.getLinkersListTeacher(endProccess=DB_TEACHERS_LIMIT)
		teachers_shedules = parser.getScheduleTeacher(data = teachers_linkers, debug=False)
		
		lessons = []
		for teacher in teachers_shedules:
			for day in teacher["data"]:
				for lesson in day:
					lessons.append({ # don't use lesson directly
						"teacher" : teacher["name"],
						"subject" : lesson["name"],
						"wday"    : lesson["wday"],
						"time"    : lesson["time"],
						"even"    : lesson["even"],
						"type"    : lesson["type"],
						"place"   : lesson["place"],
						"groups"  : lesson["groups"]
					})

		self.insert_lessons(lessons)


	#-------------------/ GET /--------------------

	def get_teachers(self):
		cmd = '''SELECT id, name FROM teachers'''
		result = self.__execute(cmd)

		teachers = [{
			"id" : r[0],
			"name" : r[1]
		} for r in result]

		return result


	def get_shedule(self, teacher_id):
		# 1) get teacher_name
		cmd = '''SELECT name FROM teachers WHERE id = {}'''.format(teacher_id)		
		teacher_name = self.__execute(cmd)[0][0]

		shedule = [{
			"name" : teacher_name,
			"data" : [
				[],
				[],
				[],
				[],
				[],
				[]
			]
		}]

		# 2) get lessons and groups
		cmd   = '''SELECT lessons.id, subjects.name, subjects.duration, ''' \
				'''lessons.wday, lessons.clock, lessons.even, ''' \
				'''lessons.type, lessons.place ''' \
				'''FROM lessons ''' \
				'''INNER JOIN teachers ON lessons.teacher_id = teachers.id ''' \
				'''INNER JOIN subjects ON lessons.subject_id = subjects.id ''' \
				'''WHERE lessons.teacher_id = {} ''' \
				'''ORDER BY lessons.wday ASC '''.format(teacher_id)
		lessons = self.__execute(cmd)

		for l in lessons:
			l_dict = {
				"name"     : l[1],
				"duration" : l[2],
				"wday"     : l[3],
				"time"     : l[4],
				"even"     : l[5],
				"type"     : l[6],
				"place"    : l[7],
				"groups"   : []
			}

			l_id = l[0]

			cmd   = '''SELECT name FROM teams ''' \
					'''WHERE id IN ''' \
					'''(SELECT team_id FROM lessons_teams ''' \
					'''WHERE lesson_id = {})'''.format(l_id)
			groups = self.__execute(cmd)

			if len(groups) != 0:
				l_dict["groups"] = groups[0]

			shedule[0]["data"][l_dict["wday"]].append(l_dict)

		print_json(shedule)
		return(shedule)


	#-------------------/ MANAGE /--------------------

	def full_update(self):
		if DB_CLEAR:
			self.__execute_f(DB_CLEAR_SQL)
		if DB_CLEAR_CACHE:
			self.__clear_cache()

		self.update_groups()
		self.update_teachers()
		self.update_subjects()
		self.update_students()
		self.update_lessons()


	def init(self):
		if(DB_FULL_UPDATE):
			self.full_update()

#----------------------------------------/ OLD full_update() /---------------------------------------------
	# def full_update(self):
		# self.__execute_f(DB_CLEAR_SQL)

		# the order matters

		#------------------------------------------------------------------------------------
		#---------------------------/ ADD GROUPS, TEACHERS, SUBJECTS /-----------------------
		#------------------------------------------------------------------------------------

		# groups   = []
		# teachers = []
		# subjects = []

		# groups_linkers = parser.linkers.getLinkersScheduleLearner(selection=DB_GROUPS_LIMIT)
		# groups_shedules = parser.getScheduleLearner(data = groups_linkers, debug=False)

		# for group in groups_shedules:
		# 	groups.append(group["name"])

		# 	for day in group["data"]:
		# 		for lesson in day:
		# 			teachers.extend(lesson["teachers"])
		# 			subjects.append({
		# 				"name" : lesson["name"],
		# 				"duration" : lesson["duration"]
		# 			})
		
		# teachers_linkers = parser.linkers.getLinkersListTeacher(endProccess=DB_TEACHERS_LIMIT)

		# for tl in teachers_linkers:
		# 	teachers.append(tl["name"])


		# self.insert_groups(groups)
		# self.insert_teachers(teachers)
		# self.insert_subjects(subjects)


		#------------------------------------------------------------------------------------
		#--------------------------------/ ADD CLASSES /-------------------------------------
		#------------------------------------------------------------------------------------

		# [FEATURE] Do not use 'enumerate', use lesson["wday"]

		# teachers_shedules = parser.getScheduleTeacher(data = teachers_linkers, debug=False)
		
		# for teacher in teachers_shedules:
		# 	for day in teacher["data"]:
		# 		for lesson in day:
					

		# lessons = []

		# for group in groups_shedules:
		# 	for day in group["data"]:
		# 		for lesson in day:
		# 			for teacher in lesson["teachers"]:
		# 				lessons.append({
		# 					"teacher" : teacher,
		# 					"subject" : lesson["name"],
		# 					"wday"    : lesson["wday"],
		# 					"time"    : lesson["time"],
		# 					"type"    : lesson["type"],
		# 					"place"   : lesson["place"],
		# 					"even"    : lesson["even"],
		# 					"group"   : group["name"]
		# 				})

		#self.insert_classes_with_groups(lessons)

		#------------------------------------------------------------------------------------
		#--------------------------------/ ADD STUDENTS /------------------------------------
		#------------------------------------------------------------------------------------

		# students = []

		# students_list = parser.getListLearners(groups_linkers, {
		# 	"login"    : AUTH_LOGIN,
		# 	"password" : AUTH_PASS
		# })

		# for group in students_list:
		# 	for student in group["data"]:
		# 		students.append({
		# 			"group" : group["name"],
		# 			"name"  : student["name"],
		# 			"count" : student["id"]
		# 		})

		# self.insert_students(students)

#------------------------------------------------------------------------------------------------------





	# INSERT INTO bar (description, foo_id) VALUES
 #    ( 'testing',     SELECT id from foo WHERE type='blue' ),
 #    ( 'another row', SELECT id from foo WHERE type='red'  );

	# def __execute(self, commands, data=[]):
	# 	self.__open()

	# 	for c in commands:
	# 		result = self.cursor.execute(c)
	# 		print(result.fetchall())

	# 	self.connection.commit()
		# self.__close()

		# self.cursor.execute(tuple, args)

		# if commit == True:
		#     connection.commit()
		# else:
		#     if single == True:
		#         return cursor.fetchone()
		#     else:
		#         return cursor.fetchall()


	# def __execute_f(self, filename):
	# 	with open(filename) as f:
	# 		commands = re.split(';[\s+]', f.read())

	# 		self.__open()
	# 		for c in commands:
	# 			self.cursor.execute(c)

	# 		self.cursor.execute('''INSERT INTO teachers (teacher_name) VALUES ("Shvedenko")''')

	# 		self.connection.commit()
	# 		self.__close()

#-----------/ executing sql file / ---


# ----------/ DB CLASS /--------------

# def get_bad_words():
#     sql = ("SELECT word FROM word_blacklist")
#     results = execute(sql)
#     return results

# def get_moderation_method():
#     sql = ("SELECT var_value FROM settings "
#     "WHERE var_key = %(key)s")
#     results = execute(sql, True, {'key':'moderation_method'})
#     return results[0]

# def current_events():
#     sql = ("SELECT count(id) FROM events WHERE event_date >= DATE_SUB(NOW(), INTERVAL 2 hour) AND event_date <= DATE_ADD(NOW(), INTERVAL 5 hour)")
#     results = execute(sql, True)
#     return results[0]

# def insert_social_post(channel, filter_type, post_id, validate, user_name, user_id, user_profile_picture, text, post_date, image_url, state):
#     try:
#         san_user_name = html_parser.unescape(user_name.encode('utf-8').strip()).decode("utf8").encode('ascii','ignore')
#     except:
#         san_user_name = html_parser.unescape(user_name.strip())
#     try:
#         san_text = html_parser.unescape(text.encode('utf-8').strip()).decode("utf8").encode('ascii','ignore')
#     except:
#         san_text = html_parser.unescape(text.strip())

#     insert_post = ("INSERT IGNORE INTO social_posts "
#         "(channel, filter_type, post_id, validate, user_name, user_id, user_profile_picture, text, post_date, image_url, state)"
#         "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
#     execute(insert_post, False, [channel, filter_type, str(post_id), validate,
#         san_user_name.strip(), user_id, user_profile_picture, san_text.strip(), post_date, image_url, state], True)

# def delete_posts(ids):
#     fmt = ','.join(['%s'] * len(ids))
#     cursor.execute("DELETE FROM `social_posts` WHERE id IN (%s)" % fmt,
#                     tuple(ids))
#     connection.commit()

# def update_campaigns(campaigns):
#     sql = ("UPDATE social_campaigns "
#         "SET last_updated = NOW()"
#         "WHERE id IN ("+(','.join(str(c) for c in campaigns))+")")
#     execute(sql, False, None, True)

# def execute(tuple, single = False, args = {}, commit = False):
#     cursor.execute(tuple, args)

#     if commit == True:
#         connection.commit()
#     else:
#         if single == True:
#             return cursor.fetchone()
#         else:
#             return cursor.fetchall()

# def close():
#     connection.close()
