# Script by @antoinebollengier and  https://github.com/SimonIT/spotifylyrics
import os
import platform
import re
from urllib import request, parse
import sys
import argparse
import requests
import unidecode  # to remove accents
from bs4 import BeautifulSoup

def megalobiz(artist, songname):

    search_url = "https://www.megalobiz.com/search/all?%s" % parse.urlencode({
        "qry": f"{artist} {songname}",
        "display": "more"
    })
    search_results = requests.get(search_url)
    soup = BeautifulSoup(search_results.text, 'html.parser')
    if soup.find(id="list_entity_container") == None:
        print('LYRICS NOT FOUND')
        exit()
    result_links = soup.find(id="list_entity_container").find_all("a", class_="entity_name")
    if len(result_links) == 0:
        print('LYRICS NOT FOUND')
        exit()
    
    #print(len(result_links))
    for result_link in result_links:
        lower_title = result_link.get_text().lower()
        entire_string = lower_title + ' - ' + artist.lower()
        #Ratio = fuzz.ratio(entire_string.lower(),lower_title.lower())
        #if Ratio > 85:
        if artist.lower() in lower_title and songname.lower() in lower_title: 
            url = f"https://www.megalobiz.com{result_link['href']}"
            possible_text = requests.get(url)
            soup = BeautifulSoup(possible_text.text, 'html.parser')

            lrc = soup.find("div", class_="lyrics_details").span.get_text()
            filename_lrc = artist + ' - ' + songname + '.lrc'
            f = open(filename_lrc, "w")
            f.write(lrc)
            print(lrc)
            f.close()
            ok = 1
            os_platform = platform.system()
            if os_platform == 'Linux':
                os_final = 'Linux'
                os.system('mkdir -p lyrics')
                os.system("mv '" + filename_lrc + "' 'lyrics/" + b_artist + ' - ' + b_title + '.lrc'+"'")
            elif os_platform == 'Windows':
                os_final = 'Windows'
                os.system('mkdir -p lyrics')
                os.system("move '" + filename_lrc + "' 'lyrics/" + b_artist + ' - ' + b_title + '.lrc'+"'")
            elif os_platform == 'Darwin':
                os_final = 'MacOS'
                os.system('mkdir -p lyrics')
                os.system("mv '" + filename_lrc + "' 'lyrics/" + b_artist + ' - ' + b_title + '.lrc'+"'")
            else:
                os_final = 'Dunno'
                os.system('mkdir -p lyrics')
                os.system("mv '" + filename_lrc + "' 'lyrics/" + b_artist + ' - ' + b_title + '.lrc'+"'")                
            print("lyrics/" + b_artist + ' - ' + b_title + '.lrc')
            exit()
    print('LYRICS NOT FOUND')




b_artist = sys.argv[3]
b_title = sys.argv[2]
megalobiz(sys.argv[1], sys.argv[2])
