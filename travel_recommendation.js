// Get references to the HTML elements
const btnSearch = document.getElementById('btnSearch');
const btnReset = document.getElementById('btnReset');

/**
 * Timezone mapping based on your JSON locations.
 * This maps the "name" property in your JSON to a valid IANA timezone string.
 */
const timeZones = {
    "Sydney, Australia": "Australia/Sydney",
    "Melbourne, Australia": "Australia/Melbourne",
    "Tokyo, Japan": "Asia/Tokyo",
    "Kyoto, Japan": "Asia/Tokyo",
    "Rio de Janeiro, Brazil": "America/Sao_Paulo",
    "São Paulo, Brazil": "America/Sao_Paulo",
    "Angkor Wat, Cambodia": "Asia/Phnom_Penh",
    "Taj Mahal, India": "Asia/Kolkata",
    "Bora Bora, French Polynesia": "Pacific/Tahiti",
    "Copacabana Beach, Brazil": "America/Sao_Paulo"
};

/**
 * Main search function triggered by the Search button.
 * Fetches the JSON data and filters based on the user input.
 */
function searchCondition() {
    const input = document.getElementById('conditionInput').value.toLowerCase().trim();
    const resultDiv = document.getElementById('result-presentation');
    
    // Clear previous results
    resultDiv.innerHTML = '';

    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            console.log("Data fetched successfully:", data); // Verification console log

            // Search Logic
            // 1. Check if input matches a country name (e.g., "japan")
            const country = data.countries.find(item => item.name.toLowerCase() === input);
            
            if (country) {
                displayResults(country.cities);
            } 
            // 2. Check for keywords "beach" or "beaches"
            else if (input.includes('beach')) {
                displayResults(data.beaches);
            } 
            // 3. Check for keywords "temple" or "temples"
            else if (input.includes('temple')) {
                displayResults(data.temples);
            } 
            // 4. Handle invalid inputs
            else {
                resultDiv.innerHTML = `
                    <div class="error-msg">
                        <p>Keyword not found. Please try "beach", "temple", or a country name like "Japan" or "Australia".</p>
                    </div>`;
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            resultDiv.innerHTML = '<p class="error-msg">An error occurred while fetching data. Check console for details.</p>';
        });
}

/**
 * Function to render the results on the screen.
 * @param {Array} results - Array of destination objects (cities, temples, or beaches).
 */
function displayResults(results) {
    const resultDiv = document.getElementById('result-presentation');
    
    results.forEach(item => {
        // Calculate Local Time
        const tz = timeZones[item.name] || 'UTC';
        const options = { 
            timeZone: tz, 
            hour12: true, 
            hour: 'numeric', 
            minute: 'numeric', 
            second: 'numeric' 
        };
        const localTime = new Date().toLocaleTimeString('en-US', options);

        // Create the card element
        const card = document.createElement('div');
        card.classList.add('result-card');

        // Use structured HTML for clear CSS targeting
        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}">
            <div class="card-content">
                <h3 class="card-title">${item.name}</h3>
                <p class="local-time"><strong>Local Time:</strong> ${localTime}</p>
                <p class="description">${item.description}</p>
                <button class="visit-btn">Visit</button>
            </div>
        `;
        resultDiv.appendChild(card);
    });
}

/**
 * Resets the search input and clears result cards.
 */
function clearSearch() {
    document.getElementById('conditionInput').value = '';
    document.getElementById('result-presentation').innerHTML = '';
    console.log("Search cleared.");
}

// Event Listeners
btnSearch.addEventListener('click', searchCondition);
btnReset.addEventListener('click', clearSearch);