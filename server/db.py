from .config import *

import mysql.connector as mysql
import re

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
		print("\n[INFO] Executing SQL script file: {}".format(filename))

		cmd = ""
		with open(filename) as f:
			for line in f.readlines():
				if re.match(r'--', line):
					continue

				cmd += line
				if re.search(r';$', line):
					print("\n[INFO] Executing SQL statement:\n{}".format(cmd))
					self.__execute(cmd)
					cmd = ""

	def init(self):
		if(DB_CLEAR):
			self.__execute_f(DB_CLEAR_SQL)
		if(DB_TEST):
			self.__execute_f(DB_TEST_SQL)

	def get_teachers(self):
		cmd = '''SELECT id, name FROM teachers'''
		result = self.__execute(cmd)

		print(result)
		result = [{
			"id" : r[0],
			"name" : r[1]
			} for r in result]
		return result

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
