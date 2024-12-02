document.addEventListener("DOMContentLoaded", () => {
    const organismDetails = document.getElementById("organismDetails");

    // Get organism identifier from URL
    const params = new URLSearchParams(window.location.search);
    const scientificName = params.get('id');

    if (!scientificName) {
        organismDetails.innerHTML = '<p>Error: No organism specified.</p>';
        return;
    }

    // Fetch observation and species data from iNaturalist API
    const fetchObservation = fetch(`https://api.inaturalist.org/v1/observations?q=${encodeURIComponent(scientificName)}`);
    const fetchSpecies = fetch(`https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(scientificName)}`);

    Promise.all([fetchObservation, fetchSpecies])
        .then(async ([obsResponse, speciesResponse]) => {
            const observationData = await obsResponse.json();
            const speciesData = await speciesResponse.json();

            if (!observationData.results.length || !speciesData.results.length) {
                organismDetails.innerHTML = '<p>No data found for this organism.</p>';
                return;
            }

            const observation = observationData.results[0];
            const species = speciesData.results[0];

            organismDetails.innerHTML = `
                <h2>${species.preferred_common_name || 'Unknown Name'} (${species.name})</h2>
                <img src="${observation.photos[0]?.url || 'placeholder.jpg'}" alt="${species.name}">
                <p><strong>Kingdom:</strong> ${species.ancestry.split('/')[1] || 'Unknown'}</p>
                <p><strong>Phylum:</strong> ${species.ancestry.split('/')[2] || 'Unknown'}</p>
                <p><strong>Class:</strong> ${species.ancestry.split('/')[3] || 'Unknown'}</p>
                <p><strong>Order:</strong> ${species.ancestry.split('/')[4] || 'Unknown'}</p>
                <p><strong>Family:</strong> ${species.family || 'Unknown'}</p>
                <p><strong>Genus:</strong> ${species.genus || 'Unknown'}</p>
                <p><strong>Species:</strong> ${species.name}</p>
                <p><a href="${observation.uri}" target="_blank">View Observation</a></p>
            `;
        })
        .catch(error => {
            console.error('Error fetching organism data:', error);
            organismDetails.innerHTML = '<p>Error fetching data. Please try again later.</p>';
        });
});
