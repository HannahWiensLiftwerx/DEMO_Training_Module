import requests
from requests.auth import HTTPBasicAuth
import json

endpoint = "https://liftwerx.lrs.io/xapi/statements?limit=10"
username = "a8a97e06-9ed4-495a-906a-6362f46d0968"
password = "9208a034-99df-43ab-835f-e1ab24b4644f"
params = {
    "verb": "http://adlnet.gov/expapi/verbs/completed"
}

response = requests.get(endpoint, auth=HTTPBasicAuth(username, password), params = params)
#print(response)


data = response.json()
print(data['statements'])
with open("results.json", "w") as out:
    json.dump(data['statements'], out, indent=2)