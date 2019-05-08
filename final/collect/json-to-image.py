import urllib.request as ur
import json
import sys

# for x in range(0, 20):
#     with open ('./doughnut-p' + str(x) + '.json') as data_file:
#         icon_data = json.load(data_file)["icons"]
#         for item in icon_data:
#             ur.urlretrieve(item["preview_url"], "./"+ item["id"] + ".png")

import requests
import shutil

for x in range(0, 22):
    with open ('./jsons/doughnut-p' + str(x) + '.json') as data_file:
        icon_data = json.load(data_file)["icons"]
        for item in icon_data:
            r = requests.get(item["preview_url"], stream=True)
            if r.status_code == 200:
                with open("./"+ item["id"] + ".png", 'wb') as f:
                    r.raw.decode_content = True
                    shutil.copyfileobj(r.raw, f)
