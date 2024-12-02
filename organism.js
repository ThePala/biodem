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

            // Extract observation ID from the URL field using regex
            const observationIdMatch = organism.url.match(/observations\/(\d+)/);
            const observationId = observationIdMatch ? observationIdMatch[1] : null;

            // Display organism details
            organismDetails.innerHTML = `
                <h2>${organism.common_name || 'Unknown Name'} (${organism.scientific_name})</h2>
                <img src="${organism.image_url}" alt="${organism.common_name}" class="main-image">
                <p><strong>Kingdom:</strong> ${organism.kingdom}</p>
                <p><strong>Phylum:</strong> ${organism.phylum}</p>
                <p><strong>Class:</strong> ${organism.class}</p>
                <p><strong>Order:</strong> ${organism.order}</p>
                <p><strong>Family:</strong> ${organism.family}</p>
                <p><strong>Genus:</strong> ${organism.genus}</p>
            `;

            if (!observationId) {
                organismDetails.innerHTML += '<p>No observation ID could be extracted from the URL.</p>';
                return;
            }

            // Fetch observation details from iNaturalist API
            fetch(`https://api.inaturalist.org/v1/observations/${observationId}`)
                .then(response => response.json())
                .then(observationData => {
                    const observation = observationData.results[0];

                    if (!observation) {
                        organismDetails.innerHTML += `
                            <p>No observations available from iNaturalist.</p>
                        `;
                        return;
                    }

                    // Safely handle observed date or fallback to created_at_details.date
                    const observedDate = observation.observed_on_details?.date ||
                        observation.created_at_details?.date ||
                        'Unknown';

                    // Include additional images from observation_photos and photos
                    const additionalImages = observation.observation_photos
                    .map(photo => {
                        // Replace 'square' with 'original' in the URL
                        const originalImageUrl = photo.photo.url.replace('square', 'original');
                        return `<img src="${originalImageUrl}" alt="Observation Image" class="additional-image">`;
                    })
                    .join('');

                    organismDetails.innerHTML += `
                        <hr>
                        <h3>Observation Details</h3>
                        <p><strong>Observed By:</strong> ${observation.user?.name || 'Unknown'}</p>
                        <p><strong>Date Observed:</strong> ${observedDate}</p>
                        <p><strong>Location:</strong> ${observation.place_guess || 'Unknown'}</p>
                        <p><a href="${observation.uri}" target="_blank">View Full Observation</a></p>
                        <h4>Additional Images</h4>
                        ${additionalImages || '<p>No additional images available.</p>'}
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
