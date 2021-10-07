import os
import re
from urllib import request, parse
import sys
import argparse
import requests
import unidecode  # to remove accents
from bs4 import BeautifulSoup
from fuzzywuzzy import fuzz
import shutil, time
found = []
not_found = []
# Print iterations progress
def printProgressBar (iteration, total, shell_output, state = '', prefix = '', suffix = '', decimals = 1, length = 100, fill = '█', printEnd = "\r", autosize = True):
    """
    Call in a loop to create terminal progress bar
    @params:
        iteration   - Required  : current iteration (Int)
        total       - Required  : total iterations (Int)
        prefix      - Optional  : prefix string (Str)
        suffix      - Optional  : suffix string (Str)
        decimals    - Optional  : positive number of decimals in percent complete (Int)
        length      - Optional  : character length of bar (Int)
        fill        - Optional  : bar fill character (Str)
        autosize    - Optional  : automatically resize the length of the progress bar to the terminal window (Bool)
    """
    percent = ("{0:." + str(decimals) + "f}").format(100 * (iteration / float(total)))
    styling = '%s |%s| %s%% %s -> %s' % (prefix, fill, percent, suffix, shell_output)
    if autosize:
        cols, _ = shutil.get_terminal_size(fallback = (length, 1))
        length = cols - len(styling)
    filledLength = int(length * iteration // total)
    bar = fill * filledLength + '-' * (length - filledLength)
    print('\r%s' % styling.replace(fill, bar), end = '\r')
    # Print New Line on Complete

def megalobiz(artist, songname, original_singer, total, number):
    service_name = "Megalobiz"
    shell_output = original_singer + ' - ' + songname
    printProgressBar(int(number), int(total),shell_output,  prefix = 'Progress:', length = 50)
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
        #print('\r('+number + '/' + total + ', '+percentage+'%) LYRICS NOT FOUND')
        state = '(Not Found)'
        printProgressBar(int(number), int(total),shell_output,  prefix = 'Progress:', length = 50)
        shell_output = ''
        not_found.append(original_singer + ' - ' + songname)
        return
    result_links = soup.find(id="list_entity_container").find_all("a", class_="entity_name")
    if len(result_links) == 0:
        #print('\r('+number + '/' + total + ', '+percentage+'%) LYRICS NOT FOUND')
        printProgressBar(int(number), int(total),shell_output, prefix = 'Progress:', length = 50)
        shell_output = ''
        not_found.append(original_singer + ' - ' + songname)
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
            state = '(Found)'
            printProgressBar(int(number), int(total), shell_output,  prefix = 'Progress:', length = 50)
            #print('\r('+number + '/' + total + ', '+percentage+'%) LYRICS FOUNDS FOR : ' + songname + ' by ' + artist)
            time.sleep(0.5)
            os.system('mkdir -p lyrics')
            os.system("mv '" + filename_lrc + "' 'lyrics/" + original_singer + ' - ' + songname + '.lrc'+"'")
            lrc = ''
            possible_text = ''
            result_links = ''
            shell_output = ''
            found.append(original_singer + ' - ' + songname)
            return
        #print(artist.lower() + ' is not in ' + lower_title+'\n')
        #print('LYRICS NOT FOUND\n')
        state = '(Not Found)'
        printProgressBar(int(number), int(total),shell_output,  prefix = 'Progress:', length = 50)
        shell_output = ''
        not_found.append(original_singer + ' - ' + songname)
        #print('\r('+number + '/' + total + ', '+percentage+'%) LYRICS NOT FOUND')


import json

def main():

    # create a simple JSON array
    jsonString = ''''''
    # change the JSON string into a JSON object
    jsonObject = json.loads(jsonString)

    # print the keys and values
    dataArray=jsonObject
    length = len(dataArray)
    print('Starting...')
    shell_output = 'Starting...'
    printProgressBar(0, length, shell_output, prefix = 'Progress:', length = 50)
    for i in range(len(dataArray)):
            title = dataArray[i]['name']
            singer = dataArray[i]['singer']
            original_singer = dataArray[i]['original_singer']
            megalobiz(singer, title, original_singer, str(len(dataArray)), str(i + 1))
    if len(found) == 0:
        print('\nNo lyrics founds...')
    else:
        print('\nLyrics founds for :')
        for e in found:
            print(e)
if __name__ == '__main__':
    main()

