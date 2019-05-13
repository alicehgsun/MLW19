import requests
import json
from requests_oauthlib import OAuth1

term = "doughnut"

for x in range(0, 22):
    auth = OAuth1("1d6cea836bd14236a738db46ae3a04e8", "d67c77d4234e4953b8b38cf07fbbb18b")
    endpoint = "https://api.thenounproject.com/icons/" + term + "?page=" + str(x)
    response = requests.get(endpoint, auth=auth)

    with open('./jsons/' + term + '-p' + str(x) + '.json', 'w') as results_file:
        json.dump(response.json(), results_file)
