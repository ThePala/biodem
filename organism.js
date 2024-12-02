document.addEventListener("DOMContentLoaded", () => {
    const organismDetails = document.getElementById("organismDetails");

    // Get organism identifier from URL
    const params = new URLSearchParams(window.location.search);
    const scientificName = params.get('id');

    if (!scientificName) {
        organismDetails.innerHTML = '<p>Error: No organism specified.</p>';
        return;
    }

    // Load the organism's details from the JSON file
    fetch('enriched_species.json')
        .then(response => response.json())
        .then(data => {
            const organism = data.find(item => item.scientific_name === scientificName);

            if (!organism) {
                organismDetails.innerHTML = '<p>Error: Organism not found in the database.</p>';
                return;
            }

            // Fetch observation details from iNaturalist
            fetch(`https://api.inaturalist.org/v1/observations/${organism.observation_id}`)
            .then(response => response.json())
            .then(observationData => {
                const observation = observationData.results[0];
        
                if (!observation) {
                    organismDetails.innerHTML += `
                        <p>No observations available from iNaturalist.</p>
                    `;
                    return;
                }
        
                // Display observation details
                organismDetails.innerHTML += `
                    <hr>
                    <h3>Observation Details</h3>
                    <p><strong>Observed By:</strong> ${observation.user?.name || 'Unknown'}</p>
                    <p><strong>Date Observed:</strong> ${new Date(observation.observed_on).toLocaleDateString() || 'Unknown'}</p>
                    <p><strong>Location:</strong> ${observation.place_guess || 'Unknown'}</p>
                    <p><a href="${observation.uri}" target="_blank">View Full Observation</a></p>
                `;
            })
            .catch(error => {
                console.error('Error fetching observation data:', error);
                organismDetails.innerHTML += '<p>Error fetching observation data. Please try again later.</p>';
            });
        
        })
        .catch(error => {
            console.error('Error fetching organism data:', error);
            organismDetails.innerHTML = '<p>Error loading organism data. Please try again later.</p>';
        });
});
