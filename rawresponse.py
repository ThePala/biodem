import requests
import json

# API endpoint
url = "https://api.inaturalist.org/v1/observations?project_id=green-audit-christ-deemed-to-be-university-bangalore&per_page=100"

# Fetch data
response = requests.get(url)
data = response.json()

# Print the first observation for inspection
print(json.dumps(data['results'][0], indent=4))
