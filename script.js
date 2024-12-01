// API URL for fetching observations
const apiUrl = 'https://api.inaturalist.org/v1/observations?project_id=green-audit-christ-deemed-to-be-university-bangalore';

// Fetch observations from the API
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const observations = data.results;

        // Filter species-level observations
        const speciesObservations = observations.filter(obs => obs.taxon && obs.taxon.rank === "species");

        // Get the container to display observations
        const container = document.getElementById('observations-container');
        container.innerHTML = ''; // Clear loading text

        if (speciesObservations.length === 0) {
            container.innerHTML = '<p>No species-level observations found.</p>';
            return;
        }

        // Add each observation to the container
        speciesObservations.forEach(obs => {
            const speciesName = obs.taxon.preferred_common_name || obs.taxon.name || "Unknown Species";
            const scientificName = obs.taxon.name || "No scientific name available";
            const observedBy = obs.user.login || "Anonymous";
            const photoUrl = obs.taxon.default_photo ? obs.taxon.default_photo.medium_url : '';

            const observationDiv = document.createElement('div');
            observationDiv.classList.add('observation');

            observationDiv.innerHTML = `
                <img src="${photoUrl}" alt="${speciesName}" />
                <div>
                    <h3>${speciesName}</h3>
                    <p><strong>Scientific Name:</strong> ${scientificName}</p>
                    <p><strong>Observed By:</strong> ${observedBy}</p>
                </div>
            `;

            container.appendChild(observationDiv);
        });
    })
    .catch(error => {
        console.error('Error fetching observations:', error);
        document.getElementById('observations-container').innerHTML = '<p>Failed to load observations.</p>';
    });