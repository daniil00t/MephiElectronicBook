DEBUG = False
VERBOSE = False

#----------------------/ DATABASE /----------------------------

# CONNECTION
DB_USER = 'server'
DB_PASSWORD = 'server'
DB_HOST = 'localhost'
DB_DATABASE = 'server_db'

# UPDATE
DB_CLEAR = False
DB_FULL_UPDATE = False
DB_CACHE_CLEAR = False

DB_UPDATE_GROUPS = False
DB_UPDATE_TEACHERS = False
DB_UPDATE_SUBJECTS = False
DB_UPDATE_STUDENTS = False
DB_UPDATE_LESSONS = False

DB_DOWNLOAD_GROUPS_LINKERS = False
DB_DOWNLOAD_TEACHERS_LINKERS = False
DB_DOWNLOAD_TEACHERS_SCHEDULES = False
DB_DOWNLOAD_GROUPS_LISTS = False

DB_GROUPS_LIMIT = r"Б20-523"
DB_TEACHERS_LIMIT = 20


# PATHES
DB_CLEAR_SQL = './server/db_clear.sql'
DB_CACHE_FOLDER = './server/cache_parser/'


#----------------------/ REPORTS /-------------------------------

# PATHES
RP_FOLDER = './server/reports/'


#----------------------------------------------------------------------------------
#------------------------------/ OVERWRITTEN /-------------------------------------
#----------------------------------------------------------------------------------
DEBUG = False

DB_CLEAR = True
DB_FULL_UPDATE = True

DB_UPDATE_GROUPS = True
DB_UPDATE_TEACHERS = True
DB_UPDATE_SUBJECTS = True
DB_UPDATE_STUDENTS = True
DB_UPDATE_LESSONS = True











# # DATABASE CACHE
# DB_CLEAR_CACHE = False

# #global
# DB_USE_CACHE = False
# DB_NOT_USE_CACHE = False
# DB_SAVE_CACHE = False
# DB_NOT_SAVE_CACHE = False

# #linkers for groups
# DB_USE_CACHE_LG = True
# DB_SAVE_CACHE_LG = False
# #linkers for teachers
# DB_USE_CACHE_LT = True
# DB_SAVE_CACHE_LT = False
# #shedules for groups
# DB_USE_CACHE_SG = True
# DB_SAVE_CACHE_SG = False
# #shedules for teachers
# DB_USE_CACHE_ST = True
# DB_SAVE_CACHE_ST = False
# #lists of students 
# DB_USE_CACHE_L = True
# DB_SAVE_CACHE_L = False