document.addEventListener("DOMContentLoaded", function () {
    const speciesContainer = document.getElementById("speciesContainer");
    const searchInput = document.getElementById("searchInput");
  
    if (!speciesContainer) {
      console.error("speciesContainer element not found.");
      return;
    }
  
    fetch("enriched_species.json")
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        renderSpecies(data);
  
        searchInput.addEventListener("input", function () {
          const searchTerm = searchInput.value.toLowerCase();
          const filteredData = data.filter(item =>
            Object.values(item).some(value =>
              value.toString().toLowerCase().includes(searchTerm)
            )
          );
          renderSpecies(filteredData);
        });
      })
      .catch(error => {
        console.error("Error fetching observations:", error);
        speciesContainer.innerHTML = `<p>Error loading species data: ${error.message}</p>`;
      });
  
    function renderSpecies(speciesList) {
      speciesContainer.innerHTML = "";
  
      if (speciesList.length === 0) {
        speciesContainer.innerHTML = "<p>No species match your search criteria.</p>";
        return;
      }
  
      speciesList.forEach(species => {
        const speciesCard = document.createElement("div");
        speciesCard.className = "species-card";
        speciesCard.innerHTML = `
          <img src="${species.image_url}" alt="${species.common_name}" />
          <div class="species-info">
            <h3>${species.common_name || "Unknown Common Name"}</h3>
            <p><em>${species.scientific_name}</em></p>
            <p><strong>Kingdom:</strong> ${species.kingdom}</p>
            <p><strong>Phylum:</strong> ${species.phylum}</p>
            <p><strong>Class:</strong> ${species.class}</p>
            <p><strong>Order:</strong> ${species.order}</p>
            <p><strong>Family:</strong> ${species.family}</p>
            <p><strong>Genus:</strong> ${species.genus}</p>
            <a href="${species.url}" target="_blank">View Observation</a>
          </div>
        `;
        speciesContainer.appendChild(speciesCard);
      });
    }
  });
  