import requests
from bs4 import BeautifulSoup
import os
import json
import datetime


url = "https://cafebeerenland.de/pflueckbedingungen-2/"
data = requests.get(url).text
soup = BeautifulSoup(data, 'html.parser')

datablocks = {'Wolkersdorf': '5048a4e',
            'Rueckersdorf': '935d18e',
            'Fuerth Sued': 'ed507ec'
            }

def get_status(status):
    switch={
      'http://cafebeerenland.de/wp-content/uploads/2016/02/gut2.gif':'good',
      'http://cafebeerenland.de/wp-content/uploads/2016/02/verkauf.gif':'sale',
      'http://cafebeerenland.de/wp-content/uploads/2016/02/schlecht.gif':'bad',
      '❌':'closed'
      }
    return switch.get(status,"Invalid input")


def main():
    result_json_content = {}
    result_json_content['timestamp'] = datetime.datetime.now().strftime('%c')
    result_json_content['pick_conditions'] = []
    
    for k,v in datablocks.items():
      berryland = {}
      print("-- "+k+" ---")
      for blocks in soup.find_all('div', attrs={'data-block-id': v}):
        berryland[k] = []
        # print(blocks)
        for block in blocks.find_all('p', attrs={'class': 'stk-block-text__text'}):
          # print(block)
          lines = str(block)[52:-4].split("<br/>")
          for line in lines:
            if len(line) > 0:
              status = line[0]
              berry = line[2:]
              berryland[k].append(
               {
                "berry" : berry,
                "status": get_status(status)
               }
              )
              print(status, berry)
        if berryland != {}:
          result_json_content['pick_conditions'].append(berryland)

    pick_conditions_filename = 'docs/result.json'

    if os.path.exists(pick_conditions_filename):
      os.remove(pick_conditions_filename)

    with open(pick_conditions_filename, 'a') as pick_conditions_file:
      json.dump(result_json_content, pick_conditions_file)

if __name__ == "__main__":
    main()