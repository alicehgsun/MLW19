import requests
import json
from requests_oauthlib import OAuth1


for x in range(0, 22):
    auth = OAuth1("1d6cea836bd14236a738db46ae3a04e8", "d6468ddcf793486b8d6ea7a768a90d82")
    # endpoint = "https://api.thenounproject.com/icons/doughnut?page=2"
    endpoint = "https://api.thenounproject.com/icons/doughnut?page=" + str(x)

    response = requests.get(endpoint, auth=auth)
    # print (response.content)



    with open('./jsons/doughnut-p' + str(x) + '.json', 'w') as results_file:
        json.dump(response.json(), results_file)
