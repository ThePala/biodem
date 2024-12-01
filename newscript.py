import requests
import json

# API endpoint
url = "https://api.inaturalist.org/v1/observations?project_id=green-audit-christ-deemed-to-be-university-bangalore&per_page=100"

# Fetch data
response = requests.get(url)
data = response.json()

# Extract species details
species_list = []
for result in data['results']:
    if result['taxon'] and result['taxon'].get('rank') == 'species':
        taxon = result['taxon']
        # Initialize taxonomic hierarchy
        taxonomy = {
            "kingdom": "Unknown",
            "phylum": "Unknown",
            "class": "Unknown",
            "order": "Unknown",
            "family": "Unknown",
            "genus": "Unknown",
        }
        # Populate taxonomy from ancestors if available
        if 'ancestors' in taxon:
            for ancestor in taxon['ancestors']:
                if ancestor['rank'] in taxonomy:
                    taxonomy[ancestor['rank']] = ancestor['name']
        
        # Create species entry
        species = {
            "common_name": taxon.get('preferred_common_name', 'Unknown'),
            "scientific_name": taxon['name'],
            "image_url": taxon.get('default_photo', {}).get('medium_url', ''),
            "url": f"https://www.inaturalist.org/observations/{result['id']}",
            **taxonomy,  # Merge taxonomy into the species dictionary
        }
        species_list.append(species)

# Save to a JSON file
with open("species.json", "w") as f:
    json.dump(species_list, f, indent=4)

print("Data saved to species.json")
