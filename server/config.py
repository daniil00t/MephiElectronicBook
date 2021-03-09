DEBUG = True
VERBOSE = False

#----------------------/ DATABASE /----------------------------

#DATABASE CONNECTION
DB_USER = 'server'
DB_PASSWORD = 'server'
DB_HOST = 'localhost'
DB_DATABASE = 'server_db'


#DATABASE FLAGS AND SETTINGS
DB_CLEAR = False
DB_FULL_UPDATE = False

DB_CLEAR_CACHE = False

#global
DB_USE_CACHE = False
DB_NOT_USE_CACHE = False
DB_SAVE_CACHE = False
DB_NOT_SAVE_CACHE = False

#linkers for groups
DB_USE_CACHE_LG = True
DB_SAVE_CACHE_LG = False
#linkers for teachers
DB_USE_CACHE_LT = True
DB_SAVE_CACHE_LT = False
#shedules for groups
DB_USE_CACHE_SG = True
DB_SAVE_CACHE_SG = False
#shedules for teachers
DB_USE_CACHE_ST = True
DB_SAVE_CACHE_ST = False
#lists of students 
DB_USE_CACHE_L = True
DB_SAVE_CACHE_L = False


DB_GROUPS_LIMIT = r"Б20-5\d3"
DB_TEACHERS_LIMIT = 7


#DATABASE PATHES
DB_CLEAR_SQL = './server/db_clear.sql'
DB_CACHE_FOLDER = './server/cache_parser/'

#----------------------------------------------------------------------------------
#------------------------------/ OVERWRITTEN /-------------------------------------
#----------------------------------------------------------------------------------