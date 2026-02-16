const btnSearch = document.getElementById('btnSearch');
const btnReset = document.getElementById('btnReset');

function searchCondition() {
    const input = document.getElementById('conditionInput').value.toLowerCase();
    const resultDiv = document.getElementById('result-presentation');
    resultDiv.innerHTML = '';

    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            // Check if user is searching for a country or specific city
            const country = data.countries.find(item => item.name.toLowerCase() === input);
            if (country) {
                displayResults(country.cities);
            } else if (input.includes('beach')) {
                displayResults(data.beaches);
            } else if (input.includes('temple')) {
                displayResults(data.temples);
            } else {
                resultDiv.innerHTML = '<p style="color: white; padding: 20px;">Keyword not found. Please try "beach", "temple", or a country name.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            resultDiv.innerHTML = 'An error occurred while fetching data.';
        });
}

function displayResults(results) {
    const resultDiv = document.getElementById('result-presentation');
    
    results.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('result-card');

        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <button class="visit-btn">Visit</button>
        `;
        resultDiv.appendChild(card);
    });
}

function clearSearch() {
    document.getElementById('conditionInput').value = '';
    document.getElementById('result-presentation').innerHTML = '';
}

btnSearch.addEventListener('click', searchCondition);
btnReset.addEventListener('click', clearSearch);