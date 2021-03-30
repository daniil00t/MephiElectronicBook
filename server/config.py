DEBUG 	= False
VERBOSE = False

#----------------------/ DATABASE /----------------------------

# CONNECTION
DB_USER 	= 'server'
DB_PASSWORD = 'server'
DB_HOST 	= 'localhost'
DB_DATABASE = 'server_db'

# UPDATE
DB_CLEAR 		= False
DB_FULL_UPDATE 	= False
DB_CACHE_CLEAR 	= False

DB_UPDATE_GROUPS 	= False
DB_UPDATE_TEACHERS 	= False
DB_UPDATE_SUBJECTS 	= False
DB_UPDATE_STUDENTS 	= False
DB_UPDATE_LESSONS 	= False

DB_DOWNLOAD_GROUPS_LINKERS 		= False
DB_DOWNLOAD_TEACHERS_LINKERS 	= False
DB_DOWNLOAD_TEACHERS_SCHEDULES 	= False
DB_DOWNLOAD_GROUPS_LISTS 		= False

DB_GROUPS_LIMIT 	= r"Б20-523"
DB_TEACHERS_LIMIT 	= 20


# PATHES
DB_CLEAR_SQL 	= './server/db_clear.sql'
DB_CACHE_FOLDER = './server/cache/parser/'


#----------------------/ REPORTS /-------------------------------

# PATHES
RP_FOLDER = './server/data/reports/'


#----------------------------------------------------------------------------------
#------------------------------/ OVERWRITTEN /-------------------------------------
#----------------------------------------------------------------------------------
DEBUG = True

# DB_CLEAR = True
# DB_FULL_UPDATE = True

# DB_UPDATE_GROUPS = True
# DB_UPDATE_TEACHERS = True
# DB_UPDATE_SUBJECTS = True
# DB_UPDATE_STUDENTS = True
# DB_UPDATE_LESSONS = True

# DB_DOWNLOAD_GROUPS_LINKERS 		= True
# DB_DOWNLOAD_TEACHERS_LINKERS 	= True
# DB_DOWNLOAD_TEACHERS_SCHEDULES 	= True
# DB_DOWNLOAD_GROUPS_LISTS 		= True

# DB_GROUPS_LIMIT 	= r"\w\d\d-\d\d\d"
# DB_TEACHERS_LIMIT 	= 20