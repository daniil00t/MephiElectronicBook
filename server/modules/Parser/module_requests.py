import urllib.request
import bs4 as bs

def Request(Link):
	error = False
	try:
		req = urllib.request.Request(Link, headers={'User-Agent': 'Mozilla/5.0'})
		html = urllib.request.urlopen(req).read()
		soup = bs.BeautifulSoup(html, features="html.parser")
	except ValueError as e:
		print(e)
		error = True
		soup = {}

	return {"data": soup, "error": error}
