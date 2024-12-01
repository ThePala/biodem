import pandas as pd
import json
import requests

# iNaturalist API endpoint
inat_url = "https://api.inaturalist.org/v1/observations?project_id=green-audit-christ-deemed-to-be-university-bangalore&per_page=100"

# Fetch data from iNaturalist API
response = requests.get(inat_url)
if response.status_code == 200:
    inat_data = response.json()
    species_data = []
    
    # Extract species details from API response
    for result in inat_data['results']:
        if result['taxon'] and result['taxon']['rank'] == 'species':  # Only include species-rank taxa
            species = {
                "common_name": result['taxon'].get('preferred_common_name', 'Unknown'),
                "scientific_name": result['taxon']['name'],
                "image_url": result['taxon'].get('default_photo', {}).get('medium_url', ''),
                "url": f"https://www.inaturalist.org/observations/{result['id']}"
            }
            species_data.append(species)
else:
    print("Failed to fetch data from iNaturalist API")
    exit()

# Load the taxonomic classification CSV file
taxonomy_df = pd.read_csv("compresstocsv.csv")

# Standardize the column names in the CSV for matching
taxonomy_df.columns = [col.lower() for col in taxonomy_df.columns]

# Enrich species data with taxonomic information based on genus
enriched_species_data = []
for species in species_data:
    # Extract genus from the scientific name (part before the first space)
    scientific_name = species.get("scientific_name", "").lower()
    genus_name = scientific_name.split(" ")[0] if " " in scientific_name else scientific_name
    
    # Match the genus with the taxonomy CSV
    match = taxonomy_df[taxonomy_df['genus'].str.lower() == genus_name]
    
    if not match.empty:
        match_row = match.iloc[0]  # Use the first match
        species["kingdom"] = match_row.get("kingdom", "Unknown")
        species["phylum"] = match_row.get("phylum", "Unknown")
        species["class"] = match_row.get("class", "Unknown")
        species["order"] = match_row.get("order", "Unknown")
        species["family"] = match_row.get("family", "Unknown")
        species["genus"] = match_row.get("genus", "Unknown")
    else:
        # If no match is found, set as Unknown
        species["kingdom"] = "Unknown"
        species["phylum"] = "Unknown"
        species["class"] = "Unknown"
        species["order"] = "Unknown"
        species["family"] = "Unknown"
        species["genus"] = "Unknown"
    
    # Add to the enriched species data
    enriched_species_data.append(species)

# Save the enriched data to a JSON file
with open("enriched_species.json", "w") as f:
    json.dump(enriched_species_data, f, indent=4)

print("Enriched species data saved to enriched_species.json")
