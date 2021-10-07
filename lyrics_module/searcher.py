import os
import re
from urllib import request, parse
import sys
import argparse
import requests
import unidecode  # to remove accents
from bs4 import BeautifulSoup
from fuzzywuzzy import fuzz

def megalobiz(artist, songname, original_singer, total, number):
    service_name = "Megalobiz"
    total = int(total)
    number = int(number)
    percentage = str(round(number/total * 100))
    total = str(total)
    number = str(number)
    search_url = "https://www.megalobiz.com/search/all?%s" % parse.urlencode({
        "qry": f"{artist} {songname}",
        "display": "more"
    })
    #print(search_url)
    search_results = requests.get(search_url)
    soup = BeautifulSoup(search_results.text, 'html.parser')
    if soup.find(id="list_entity_container") == None:
        print('('+number + '/' + total + ', '+percentage+'%) LYRICS NOT FOUND')
        return
    result_links = soup.find(id="list_entity_container").find_all("a", class_="entity_name")
    if len(result_links) == 0:
        print('('+number + '/' + total + ', '+percentage+'%) LYRICS NOT FOUND')
        return
    
    #print(len(result_links))
    for result_link in result_links:
        lower_title = result_link.get_text().lower()
        entire_string = lower_title + ' - ' + artist.lower()
        #Ratio = fuzz.ratio(entire_string.lower(),lower_title.lower())
        #if Ratio > 95:
        if artist.lower() in lower_title and songname.lower() in lower_title:
            url = f"https://www.megalobiz.com{result_link['href']}"
            possible_text = requests.get(url)
            soup = BeautifulSoup(possible_text.text, 'html.parser')

            lrc = soup.find("div", class_="lyrics_details").span.get_text()
            filename_lrc = artist + ' - ' + songname + '.lrc'
            f = open(filename_lrc, "w")
            f.write(lrc)
            #print(lrc)
            f.close()
            #print(filename_lrc)
            print('('+number + '/' + total + ', '+percentage+'%) LYRICS FOUNDS FOR : ' + songname + ' by ' + artist)
            os.system('mkdir -p lyrics')
            os.system("mv '" + filename_lrc + "' 'lyrics/" + original_singer + ' - ' + songname + '.lrc'+"'")
            lrc = ''
            possible_text = ''
            result_links = ''
            return
        #print(artist.lower() + ' is not in ' + lower_title+'\n')
        #print('LYRICS NOT FOUND\n')
    print('('+number + '/' + total + ', '+percentage+'%) LYRICS NOT FOUND')


import json

def main():

    # create a simple JSON array
    jsonString = '''''' # Paste here your clipboard
    # change the JSON string into a JSON object
    jsonObject = json.loads(jsonString)

    # print the keys and values
    dataArray=jsonObject
    for i in range(len(dataArray)):
            title = dataArray[i]['name']
            singer = dataArray[i]['singer']
            original_singer = dataArray[i]['original_singer']
            megalobiz(singer, title, original_singer, str(len(dataArray)), str(i + 1))

if __name__ == '__main__':
    main()

