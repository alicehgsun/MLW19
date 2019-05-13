import json
import requests
import shutil

term = "doughnut"

for x in range(0, 22):
    with open ('./jsons/' + term + '-p' + str(x) + '.json') as data_file:
        icon_data = json.load(data_file)["icons"]
        for item in icon_data:
            r = requests.get(item["preview_url"], stream=True)
            if r.status_code == 200:
                with open("./"+ item["id"] + ".png", 'wb') as f:
                    r.raw.decode_content = True
                    shutil.copyfileobj(r.raw, f)
