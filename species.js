fetch('species.json')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('#species-table tbody');
        data.forEach(species => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${species.image_url}" alt="${species.common_name}"></td>
                <td>${species.common_name}</td>
                <td><i>${species.scientific_name}</i></td>
                <td><a href="${species.url}" target="_blank">View Details</a></td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error loading species data:', error));
