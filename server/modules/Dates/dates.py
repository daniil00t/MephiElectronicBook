from datetime import datetime, date, timedelta

def __parse_duration(duration_str):
	return duration_str

def __parse_time(time_str):
	return time_str

def get_dates(pattern, duration):
	print(__parse_duration("24/7"))
	print(__parse_time(pattern[0]["time"]))
	return ["надцатое мартобря"]


def unix_time_sec(dt, epoch):
	return (dt - epoch).total_seconds()

'''
*
* @param {list} wday - list which exist items 0/1 describing day of week [0, 0, 1, 1, 0, 1]; Sunday is weekend
* @param {str} start
* @param {str} end
* @add-param {str} pattern - pattern for date lib
* @add-param {int} count_days - count days in reterned result. Default value = -1, based on this result will exist ALL dates in period [date_start, date_end]
*
* @return {list} result [date_start, "10.04.2021", "12.04.2021", "16.04.2021", "18.04.2021", ..., {date_end}?]
*
'''
def get_dates_update(wdays, start, end, pattern = "%d.%m.%Y", count_days = -1):

	date_start = datetime.strptime(start, pattern)
	date_end = datetime.strptime(end, pattern)

	epoch = datetime.utcfromtimestamp(0)
	
	# print(secs1, secs2)
	flag = True
	week = 0
	result = []
	iter_wday = date_start.isoweekday() - 1
	while flag:
		while iter_wday < len(wdays):
			now_day = date_start + timedelta(days = (iter_wday - (date_start.isoweekday() - 1)) * wdays[iter_wday], weeks = week)

			end_in_secs = unix_time_sec(date_end, epoch)
			item_in_secs = unix_time_sec(now_day, epoch)

			if count_days != -1 and len(result) + 1 > count_days:
				return result

			if item_in_secs > end_in_secs:
				flag = False
				break

			if wdays[iter_wday] != 0:
				result.append(now_day.strftime(pattern))
			iter_wday += 1
		iter_wday = 0
		week += 1
	return result 