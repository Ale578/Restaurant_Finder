let map;
let lat;
let lng;
let currentMarker = null;
let currentCircle = null;
let radius = 500;
let service;
let clickedLocation;

async function initMap() {
    const { Map } = await google.maps.importLibrary('maps');
    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
    const { Circle } = await google.maps.importLibrary('maps')

    map = new Map(document.getElementById('map'), {
        mapId: '608aeffcc45faef9',
        center: { lat: 40.961613, lng: -5.667607 },
        zoom: 14
    });

    service = new google.maps.places.PlacesService(map);

    map.addListener('click', (event) => {

        clickedLocation = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };

        addMarker(clickedLocation, AdvancedMarkerElement )
        addCircle(clickedLocation, radius);
    });
}

let search = document.querySelector('#search');

search.addEventListener('click', () => {
    if (currentMarker) {
        addCircle(clickedLocation, radius);
        getRestaurants(service, clickedLocation, radius);
    } else {
        alert('Select a location')
    }
});


function addMarker(location, AdvancedMarkerElement) {

    if (currentMarker) {
        currentMarker.setMap(null);
    }

    currentMarker = new google.maps.marker.AdvancedMarkerElement({
        position: location,
        map: map,
        title: 'Selected Location'
    });
    // markers.push(marker)
}

function addCircle(location, radius) {
    if (currentCircle) {
        currentCircle.setMap(null);
    }

    currentCircle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.1,
        map: map,
        center: location,

        radius: radius
    });
}

function getRestaurants(service, location, radius) {
    // Define the search request
    const request = {
        location: new google.maps.LatLng(location.lat, location.lng),
        radius: radius,
        type: ['restaurant']
    };
    // Use the nearbySearch method to search for restaurants
    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            console.log(results);
            displayResults(results);
        } else {
            console.error('Places service failed due to: ' + status);
        }
    });
}

function displayResults(results) {
    const tableBody = document.querySelector('#results tbody');

    // Clear any previous results
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    results.forEach((place) => {
        if (place.rating >= 3.0) {

            const row = tableBody.insertRow();

            const cellName = row.insertCell(0);
            const cellRating = row.insertCell(1);
            const cellTotalRatings = row.insertCell(2);
            const cellPriceLevel = row.insertCell(3);
            const cellUrl = row.insertCell(4);

            cellName.textContent = place.name;
            cellRating.textContent = place.rating;
            cellTotalRatings.textContent = place.user_ratings_total;
            cellPriceLevel.textContent = place.price_level;
            cellUrl.innerHTML = `https://www.google.com/maps/place/?q=place_id:${place.place_id}`; 

            // <a href="${placeUrl}" target="_blank">Google Maps</a>
            

        }
    });
}

// Initialize the map on window load
window.onload = initMap;