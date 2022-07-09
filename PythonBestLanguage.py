import random
import time
import requests
from bs4 import BeautifulSoup as BS
from selenium import webdriver


names = ["Александр", "Ян", "Сергей", "Владислав", "Илья", "Алексей", "Татьяна", "Татьяна", "Полина", "Лидия"]
options = webdriver.ChromeOptions()
options.add_argument("user-agent= Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                     "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36")




def parse_url(name):
    url = "https://yandex.ru/lab/postcard?name=" + name
    driver = webdriver.Chrome(executable_path="D:\\Library\\Projects PyCharm\\parse mail.ru\\chromedriver.exe",
                              options=options)
    driver.get(url=url)
    time.sleep(0.5)
    src = driver.page_source
    # req = requests.get(url)
    html = BS(src, 'html.parser')
    text = html.select(".container > p")
    print(text[0].text)
    return text[0].text


def generate_random_name():
    random_number = random.randrange(0, 9)
    generated_name = names[random_number]
    return generated_name


def generate_congrats():
    new_name = generate_random_name()
    congratulation = parse_url(new_name)
    return congratulation









