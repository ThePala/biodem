document.addEventListener("DOMContentLoaded", () => {
    let organisms = [];
    const organismGrid = document.getElementById("organismGrid");
    const searchBar = document.getElementById("searchBar");
    const filterDropdown = document.getElementById("filterDropdown");
    const loadAllButton = document.getElementById("loadAllButton");

    // Load JSON data
    fetch('enriched_species.json')
        .then(response => response.json())
        .then(data => {
            organisms = data;
            displayAllOrganisms(); // Show all organisms on page load
        })
        .catch(error => console.error('Error fetching observations:', error));

    // Display all organisms
    function displayAllOrganisms() {
        organismGrid.innerHTML = ''; // Clear existing content
        organisms.forEach(organism => {
            const card = createOrganismCard(organism);
            organismGrid.appendChild(card);
        });
    }

    // Create organism card
    function createOrganismCard(organism) {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <img src="${organism.image_url}" alt="${organism.common_name}">
            <div class="card-content">
                <h3>${organism.common_name}</h3>
                <p><em>${organism.scientific_name}</em></p>
                <p>${organism.family} - ${organism.genus}</p>
                <a href="${organism.url}" target="_blank">More Info</a>
            </div>
        `;
    
        // Redirect to organism page on click
        card.addEventListener("click", () => {
            window.location.href = `organism.html?id=${encodeURIComponent(organism.scientific_name)}`;
        });
    
        return card;
    }

    // Handle search functionality
    searchBar.addEventListener("input", () => {
        const query = searchBar.value.toLowerCase();
        const filter = filterDropdown.value;

        const filtered = organisms.filter(organism => {
            if (filter === 'all') {
                // Match against all fields
                return Object.values(organism).some(value =>
                    value.toString().toLowerCase().includes(query)
                );
            } else {
                // Match against specific field
                return organism[filter] && organism[filter].toLowerCase().includes(query);
            }
        });

        organismGrid.innerHTML = '';
        if (filtered.length > 0) {
            filtered.forEach(organism => {
                const card = createOrganismCard(organism);
                organismGrid.appendChild(card);
            });
        } else {
            organismGrid.innerHTML = '<p>No organisms found</p>';
        }

        loadAllButton.style.display = 'block'; // Show "Load All" button after filtering
    });

    // Handle "Load All" button
    loadAllButton.addEventListener("click", () => {
        searchBar.value = ''; // Clear search bar
        filterDropdown.value = 'all'; // Reset filter
        displayAllOrganisms(); // Restore all organisms
        loadAllButton.style.display = 'none'; // Hide "Load All" button
    });
});
