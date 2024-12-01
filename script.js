let organisms = [];
let displayedCount = 0;
const batchSize = 30;

const organismGrid = document.getElementById("organismGrid");
const searchBar = document.getElementById("searchBar");
const loadMoreButton = document.getElementById("loadMore");

// Load JSON data
fetch('enriched_species.json')
    .then(response => response.json())
    .then(data => {
        organisms = data;
        displayBatch();
    });

// Display a batch of organisms
function displayBatch() {
    const nextBatch = organisms.slice(displayedCount, displayedCount + batchSize);
    nextBatch.forEach(organism => {
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
        organismGrid.appendChild(card);
    });
    displayedCount += nextBatch.length;

    // Hide "Load More" button if all items are displayed
    if (displayedCount >= organisms.length) {
        loadMoreButton.style.display = "none";
    }
}

// Handle search functionality
searchBar.addEventListener("input", () => {
    const query = searchBar.value.toLowerCase();
    const filtered = organisms.filter(organism =>
        Object.values(organism).some(value =>
            value.toString().toLowerCase().includes(query)
        )
    );

    organismGrid.innerHTML = '';
    displayedCount = 0;
    organisms = filtered;
    displayBatch();
});

// Load more button
loadMoreButton.addEventListener("click", displayBatch);
