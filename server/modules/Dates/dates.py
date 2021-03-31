from datetime import datetime, date, timedelta
from dateutil.rrule import *
import re


def parse_duration(duration):
	start = re.search(r"\S{10}(?=[ )])", duration)
	end = re.search(r"(?<= )\S{10}", duration)

	# [FEATURE] set default duration in parser
	result = {}
	if start:
		result["start"] = datetime.strptime(start.group(0), "%d.%m.%Y")
	else:
		result["start"] = datetime.strptime("08.02.2021", "%d.%m.%Y")

	if end:
		result["end"] = datetime.strptime(end.group(0), "%d.%m.%Y")
	else:
		result["end"] = datetime.strptime("31.05.2021", "%d.%m.%Y")

	return result


def parse_time(time):
	start = re.search(r"\S{5}(?= )", time)
	end = re.search(r"(?<= )\S{5}", time)

	# result = {}
	# result["start"] = start.group(0)
	# result["end"] = end.group(0)
	result = time

	return result


def get_dates_times(pattern, duration):
	# [FEATURE] also return current positon (+ 2 weeks)

	#-------/ TEST /------
	# pattern  = [["10:30", "10:00"], ["11:00"], [],        [], [], [],
	# 			["10:00"], [],        ["12:00"], [], [], []]

	# for d in pattern:
	# 	d.sort()

	# duration = "08.02.2021 - 31.05.2021"
	# duration = parse_duration(duration)
	#---------------------

	week_days = [[], []]
	for i, d in enumerate(pattern):
		if len(d) > 0:
			week_days[i // 6].append(i % 6)


	# odd weeks
	dates = list(rrule(freq      = WEEKLY,
					   interval  = 2,
					   dtstart   = duration["start"],
					   until     = duration["end"],
					   byweekday = week_days[0]))
	# even weeks
	dates.extend(rrule(freq      = WEEKLY,
					   interval  = 2,
					   dtstart   = duration["start"] + timedelta(days=7),
					   until     = duration["end"],
					   byweekday = week_days[1]))
	dates.sort()
	# print("[INFO] Dates (len={}):".format(len(dates)))
	# for d in dates:
	# 	print(d)

	count = 0;
	prepared_pattern = [];
	for d in pattern:
		if len(d) > 0:
			count += 1
			prepared_pattern.append(d)

	dates_times = [];
	for i, date in enumerate(dates):
		for t in prepared_pattern[i%count]:
			dates_times.append(str(date)[:10] + " " + t)

	# print ("[INFO] Dates and times (len={}):".format(len(dates_times)))
	# for dt in dates_times:
	# 	print(dt)

	return dates_times


def unix_time_sec(dt, epoch):
	return (dt - epoch).total_seconds()


def calculate_days(wdays, even, start, end, pattern = "%d.%m.%Y"):
	pass


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