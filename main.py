import requests
from bs4 import BeautifulSoup
import os
import json
import datetime


url = "https://cafebeerenland.de/aktuelles/pflueckbedingungen/"
data = requests.get(url).text
soup = BeautifulSoup(data, 'html.parser')


def get_status(image):
    switch={
      'http://cafebeerenland.de/wp-content/uploads/2016/02/gut2.gif':'good',
      'http://cafebeerenland.de/wp-content/uploads/2016/02/verkauf.gif':'sale',
      'http://cafebeerenland.de/wp-content/uploads/2016/02/schlecht.gif':'bad',
      'http://cafebeerenland.de/wp-content/uploads/2016/02/geschlossen.gif':'closed'
      }
    return switch.get(image,"Invalid input")


def main():
    result_json_content = {}
    result_json_content['timestamp'] = datetime.datetime.now().strftime('%c')
    result_json_content['pick_conditions'] = []

    for divs in soup.find_all('div', attrs={'class': 'entry-content'}):
      berryland = {}
      heads = divs.find_all('h3')
      for head in heads:
        if head.find('span', attrs={"style": "color: #572381;"}) is not None:
          location = head.find('span').get_text(strip=True)
          # print(head.find('span').get_text(strip=True))
      for tables in divs.find_all('table', attrs={'frame':'above'}):
        berryland[location] = []
        for row in tables.tbody.find_all('tr'):    
            columns = row.find_all('td')
            if(columns != []):
              berryland[location].append(
               {
                "berry" : columns[0].text.strip(),
                "image": columns[1].img.attrs['src'],
                "status": get_status(columns[1].img.attrs['src'])
               }
              )
      if berryland != {}:
        result_json_content['pick_conditions'].append(berryland)

    pick_conditions_filename = 'docs/result.json'

    if os.path.exists(pick_conditions_filename):
      os.remove(pick_conditions_filename)

    with open(pick_conditions_filename, 'a') as pick_conditions_file:
      json.dump(result_json_content, pick_conditions_file)

if __name__ == "__main__":
    main()