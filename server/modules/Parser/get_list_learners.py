from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import bs4 as bs
chromeOptions = Options()
chromeOptions.headless = True

def Filter(text):
	return text.replace("\n", "")

def parseList(html):
	res = []
	soup = bs.BeautifulSoup(html, features="html.parser")
	for i in soup.find_all("div", class_="list-group-item"):
		res.append({
			"id": int(Filter(i.text).split(".")[0]),
			"name": Filter(i.text).split(".")[1]
		})
	return res

# Inputs:
# links = [{name: "Б20-514", href: <link>}, ...]
# user_data = {"login": <login>, "password": <password>}
# debug = False | True

# Output: 
# getListLearners(...) -> [["1. Ф.И.О.", ...], [...], ...]

def getListLearners(links, user_data, debug = False):
	# create browser
	br = webdriver.Chrome(options=chromeOptions)
	br.get(links[0]["href"][:-9])

	# put username
	user=br.find_element_by_css_selector("#username")
	user.clear()
	user.send_keys(user_data["login"]) # Fill the email box by given username or email id

	# put password
	pasd=br.find_element_by_css_selector("#password")
	pasd.clear()
	pasd.send_keys(user_data["password"]) # Fill the password filled by given password
	
	# find button and click on it
	btn=br.find_element_by_css_selector(".btn")
	btn.click() # Auto click the button

	groups = []
	proccess = 0
	if len(links) != 0:
		for i in links:
			proccess += 1
			print(f"Proccess: {proccess / len(links) * 100}%")
			br.get(i['href'][:-9])
			groups.append({
				"name": i['name'],
				"data": parseList(br.page_source)
			})
	elif len(links) == 0 and debug:
		print("Array of links is empty! Please enter array with non-empty data.")
	return groups