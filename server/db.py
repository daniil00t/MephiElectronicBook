from .config import *
from .config_auth import *
from .modules import Parser as parser
import mysql.connector as mysql
import re
import json

class DB:
	def __init__(self):
		pass

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

	def __execute(self, cmd):
		# add multiple commands executing
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

	def print_json(self, data):
		print(json.dumps(data, ensure_ascii=False, indent=4))

	def init(self):
		if(DB_CLEAR):
			self.__execute_f(DB_CLEAR_SQL)
		if(DB_TEST):
			self.__execute_f(DB_TEST_SQL)
		if(DB_FULL_UPDATE):
			self.full_update()

	def get_teachers(self):
		cmd = '''SELECT id, name FROM teachers'''
		result = self.__execute(cmd)

		result = [{
			"id" : r[0],
			"name" : r[1]
			} for r in result]
		return result

	def full_update(self):
		self.__execute_f(DB_CLEAR_SQL)

		groups   = []
		teachers = []
		subjects = []

		linkers = parser.linkers.getLinkersScheduleLearner(
			selection=DB_GROUPS)
		shedule = parser.getScheduleLearner(data = linkers, debug=False)
		
		if VERBOSE: self.print_json(shedule)

		#-----------/ Add groups, teachers and subjects /-----#

		for group in shedule:
			groups.append(group["name"])

			for day in group["data"]:
				for lesson in day:
					teachers.extend(lesson["teachers"])
					subjects.append({
						"name" : lesson["name"],
						"duration" : lesson["duration"]
					})

		self.insert_groups(groups)
		self.insert_teachers(teachers)
		self.insert_subjects(subjects)

		#----------/ Add lessons /---------------------------#
		for group in shedule:

			for i, day in enumerate(group["data"]):
				pass

		#----------/ Add students into groups /--------------#
		students = []

		#if pickle.file exists - load it!

		students_list = parser.getListLearners(linkers, {
			"login"    : AUTH_LOGIN,
			"password" : AUTH_PASS
		})

		# for linker, group_list in zip(linkers, students_list):
		# 	for student in group_list:
		# 		students.append({
		# 			"group" : linker["name"],
		# 			"name" : re.match(r"(?<='.')", student),
		# 			"count" : re.match(r"(?='.')", student)
		# 		})

		# if VERBOSE: self.print_json(students)

		if VERBOSE: print("[INFO] Database updated")

	def insert_groups(self, groups):
		args = []
		for g in groups:
			if g == "":
				continue
			args.append("(\"{}\")".format(g))

		cmd   = '''INSERT IGNORE INTO teams (name)''' \
				'''VALUES {}'''.format(",".join(args))
		self.__execute(cmd)


	def insert_teachers(self, teachers):
		args = []
		for t in teachers:
			if t == "":
				continue
			args.append("(\"{}\")".format(t))

		cmd   = '''INSERT IGNORE INTO teachers (name)''' \
				'''VALUES {}'''.format(",".join(args))
		self.__execute(cmd)


	def insert_subjects(self, subjects):
		args = []
		for s in subjects:
			if s["name"] == "":
				continue
			args.append("(\"{}\", \"{}\")".format(s["name"], s["duration"]))

		cmd   = '''INSERT IGNORE INTO subjects (name, duration)''' \
				'''VALUES {}'''.format(",".join(args))
		self.__execute(cmd)

	def insert_students(self, students):
		pass


	def insert_classes(self, classes):
		pass


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
