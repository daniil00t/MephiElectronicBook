import urllib.request
import json
import bs4 as bs

def Request(Link):
	error = False
	try:
		req = urllib.request.Request(Link, headers={'User-Agent': 'Mozilla/5.0'})
		html = urllib.request.urlopen(req).read()
		soup = bs.BeautifulSoup(html, features="html.parser")
	except Exception as e:
		print(e)
		error = True
		soup = bs.BeautifulSoup("<p>error</p>")

	return {"data": soup, "error": error}