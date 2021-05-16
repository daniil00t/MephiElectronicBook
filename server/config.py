DEBUG 	= False
VERBOSE = False

#----------------------/ SERVER   /----------------------------
S_HOST  = "127.0.0.1"
S_PORT  = 5000

#----------------------/ DATABASE /----------------------------

# CONNECTION
DB_USER 	= 'server'
DB_PASSWORD = 'server'
DB_HOST 	= 'localhost'
DB_DATABASE = 'server_db'

# UPDATE
DB_CLEAR 		= False
DB_FULL_UPDATE 	= False

DB_CACHE_CLEAR 	=  False # warning!

DB_UPDATE_GROUPS 	= False
DB_UPDATE_TEACHERS 	= False
DB_UPDATE_SUBJECTS 	= False
DB_UPDATE_STUDENTS 	= False
DB_UPDATE_LESSONS 	= False

DB_DOWNLOAD_GROUPS_LINKERS 		= False
DB_DOWNLOAD_TEACHERS_LINKERS 	= False
DB_DOWNLOAD_TEACHERS_SCHEDULES 	= False
DB_DOWNLOAD_GROUPS_LISTS 		= False

DB_GROUPS_LIMIT 	= r"\w\d\d-\d\d\d"
DB_TEACHERS_LIMIT 	= 101


# PATHES
DB_CLEAR_SQL 	= './server/db_clear.sql'
DB_CACHE_FOLDER = './server/cache/parser/'


#----------------------/ REPORTS /-------------------------------

# PATHES
RP_REPORTS_FOLDER = './server/data/reports/'

#----------------------------------------------------------------------------------
#------------------------------/ OVERWRITTEN /-------------------------------------
#----------------------------------------------------------------------------------
DEBUG = True
#S_HOST  = "192.168.43.52"


# DEBUG = False

# DB_FULL_UPDATE 	= True
# DB_CLEAR 		= True

# DB_UPDATE_GROUPS 	= True
# DB_UPDATE_TEACHERS 	= True
# DB_UPDATE_SUBJECTS 	= True
# DB_UPDATE_STUDENTS 	= True
# DB_UPDATE_LESSONS 	= True