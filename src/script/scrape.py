"""
    www.etsy.com scraping products from given url.

"""
from math import prod
from os import X_OK, error, name
from sys import argv
import requests 
from bs4 import BeautifulSoup
import time
import json
from lxml.html import fromstring

start_time = time.time()

links = list()
name = list()
image = list()
price = list()
 

def get_name(response): 

    global name
    product_name = ""

    try:
        soup = BeautifulSoup(response.text, "lxml")
        
        divs = soup.find_all("div", class_="wt-mb-xs-2") 
        # print(divs)
        temp_list = list()
        for div in divs:
            
            h1s = div.find_all_next("h1",class_=True)
            
            for h1 in h1s:
                temp_list.append(h1.text.strip())
                
        product_name = temp_list[0]
        product_name = product_name.strip()
        #print("productname : "+ product_name)
        name.append(product_name)

    except ConnectionError as e:
        print(e)
        name.append("")
    
def get_image(response): 

    global image
    
    image_link = ""

    try:
        soup = BeautifulSoup(response.text, "lxml")
        
        imgs = soup.find_all("img", src=True) 
        # print(divs)
        for img in imgs:
           
            try: 
                index = img["data-index"]
                # print(index)
            except:
                continue

            index = str(index)
            compare = str('0')

            if compare == index:
                image_link = str(img["src"])
                   
        image_link = image_link.strip()
        #print("image link : "+ image_link)
        image.append(image_link)

    except ConnectionError as e:
        print(e)
        image.append("")

def get_price(response): 

    global price
    price_name = ""

    try:
        soup = BeautifulSoup(response.text, "lxml")
   
        divs = soup.find_all("div", class_="wt-mb-xs-3") 
        # print(divs)
        for div in divs:
            
            ps = div.find_all_next("p", class_=True)
            for p in ps:

                #print(p["class"],p.text)
                class_name = str(p["class"])
                compare = str(['wt-text-title-03', 'wt-mr-xs-2'])

                if compare == class_name:
                    price_name = str(p.text)
                    break
                   
        price_name = price_name.strip()
        #print("price name : "+ price_name)
        price.append(price_name)

    except ConnectionError as e:
        print(e)
        price_name.append("")

def to_dict():

    global price 

    data = []

    for i in range(0,len(price)):
        data.append({       "_id" : i,
                          "name" : name[i],
                          "image" : image[i],
                          "price" : price[i] })

    return json.dumps(data)

if __name__ == "__main__":

    url = argv[1]
    
    #print(argv[1])

    try:
        headers = {'Upgrade-Insecure-Requests': '1', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36'}

        session = requests.Session()
        session.headers.update(headers)

        response = session.get(url , timeout=1.5)

        

    except ConnectionError as e:
        print(e)

    get_name(response)
    get_image(response)
    get_price(response) 
        
    data = to_dict()
    print(json.dumps(data))
    json_object = json.dumps(data, indent = 4)
    
    
    # Writing to result.json
    with open("result.json", "w") as outfile:
        outfile.write(json_object)
    
