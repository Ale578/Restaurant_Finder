let map;
let lat;
let lng;
let currentMarker = null;
let currentCircle = null;
let service;

let selectedLocation;
let radius = 500;
let previousSelectedLocation;
let previousRadius = 0;

let minimum_rating = 3.5;
let orderBy = 'rating';

let restaurantMarkers = [];

let restaurantResults;
const tableBody = document.querySelector('#results tbody');

async function initMap() {
    const { Map } = await google.maps.importLibrary('maps');
    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
    // const { Circle } = await google.maps.importLibrary('maps')

    map = new Map(document.getElementById('map'), {
        mapId: '608aeffcc45faef9',
        center: { lat: 40.961613, lng: -5.667607 },
        zoom: 14
    });

    service = new google.maps.places.PlacesService(map);

    map.addListener('click', (event) => {

        selectedLocation = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };

        addMarker(selectedLocation, AdvancedMarkerElement )
        addCircle(selectedLocation, radius);
    });
}

let radiusSlider = document.querySelector('#radiusSlider');
let radiusValue = document.querySelector('#radiusValue');

radiusSlider.addEventListener('input', () => {

    radius = parseInt(radiusSlider.value)
    radiusValue.textContent = radius;

    if (currentCircle) {
        currentCircle.setRadius(radius)
    }
});

let search = document.querySelector('#search');

search.addEventListener('click', () => {
    if (currentMarker) {

        if (!previousSelectedLocation) {
            getRestaurants(service, selectedLocation, radius);
            // alert("First serach");
        } else {
            if ((selectedLocation.lat == previousSelectedLocation.lat) 
                && (selectedLocation.lng == previousSelectedLocation.lng)
                && (radius == previousRadius)) {
                alert("You already searched for this");

                // displayResultsTable(results, orderBy)

            } else {
                console.log(radius);
                console.log(previousRadius);
                console.log(previousSelectedLocation);
                getRestaurants(service, selectedLocation, radius);
                // alert("Different search");

            }        
        }
    previousSelectedLocation = selectedLocation;

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

// Order results by specified field
let selectOrderBy = document.querySelectorAll('.order');
selectOrderBy.forEach(button => {
    button.addEventListener('click', event => {
        if (event.target.textContent == 'Rating') {
            orderBy = 'rating';
        } else if (event.target.textContent == 'Distance') {
            orderBy = 'distance';
        } else if (event.target.textContent == 'Number of ratings') {
            orderBy = 'user_ratings_total';
        } else if (event.target.textContent == 'Price level') {
            orderBy = 'price_level';
        }
        displayResultsTable(restaurantResults, orderBy, minimum_rating);
    });    
});

let selectMinimumRating = document.querySelector('#minimumRating');

// Set up filter by minimum rating
document.addEventListener('DOMContentLoaded', () => {

    for (let i = 50; i >= 30; i--) {
        let option = document.createElement('option');
        option.value = (i / 10).toFixed(1);
        option.text = (i / 10).toFixed(1);

        if (option.value === '3.5') {
            option.selected = true;
        }
    
        selectMinimumRating.appendChild(option);
    }
});

selectMinimumRating.addEventListener('change', () => {
    minimum_rating = selectMinimumRating.value;
});


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

            for (let i = 0; i < results.length; i++) {
                const place = results[i];
        
                // console.log(`Processing place: ${place.name}`);
        
                // Get distance from the selected location to the restaurants
                const placeLocation = new google.maps.LatLng(
                    place.geometry.location.lat(),
                    place.geometry.location.lng()
                );
        
                const selectedLatLng = new google.maps.LatLng(
                    selectedLocation.lat,
                    selectedLocation.lng
                );
                
                const distance = google.maps.geometry.spherical.computeDistanceBetween(selectedLatLng, placeLocation);
                place.distance = distance * -1;
        
                // console.log(`${i}. ${place.name} distance: ${place.distance}`);
        
                if (!place.price_level) {
                    place.price_level = 0;
                }   
            };

            restaurantResults = results;

            displayResultsTable(restaurantResults, orderBy, minimum_rating);
            displayResultsMap(restaurantResults, minimum_rating)
            
            // Store value of the previous radius
            previousRadius = radius;

        } else { // Handle if there are no results in the area
            
            // Clear any previous results
            while (tableBody.firstChild) {
                tableBody.removeChild(tableBody.firstChild);
            }

            if (status == 'ZERO_RESULTS') {
                console.error('Places service failed due to: ' + status);
            }
        }
    });
}

function displayResultsTable(results, orderBy, minimum_rating) {

    // Clear any previous results
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    // Order results based on the user's input, orderBy
    results.sort((a, b) => b[orderBy] - a[orderBy]);

    // display the ordered results
    results.forEach((place) => {
        if (place.rating >= minimum_rating) {

            const row = tableBody.insertRow();

            const cellName = row.insertCell(0);
            const cellRating = row.insertCell(1);
            const cellTotalRatings = row.insertCell(2);
            const cellPriceLevel = row.insertCell(3);
            const cellUrl = row.insertCell(4);

            cellName.textContent = place.name;
            cellRating.textContent = place.rating;
            cellTotalRatings.textContent = place.user_ratings_total;

            if (place.price_level == 0) {
                cellPriceLevel.textContent = 'N/A';
            }
            else {
                cellPriceLevel.textContent = place.price_level;
            }

            let placeUrl = `https://www.google.com/maps/place/?q=place_id:${place.place_id}`; 

            cellUrl.innerHTML = `<a href="${placeUrl}" target="_blank">Google Maps</a>`;

        }
    });
}

function displayResultsMap(results, minimum_rating) {

    clearRestaurantMarkers()

    results.forEach((place) => {
        if (place.rating >= minimum_rating) {
            // Add restaurantMarkers
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            const icon = {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: 'rgba(0, 0, 255, 0.2)',
                fillOpacity: 0.4,
                scale: 10, 
                strokeColor: 'blue',
                strokeWeight: 1
            };

            // Add a marker for each restaurant
            const marker = new google.maps.Marker({
                position: { lat: lat, lng: lng },
                map: map,
                title: place.name,
                icon: icon
            });

            // Store marker in markers array
            restaurantMarkers.push(marker);
        }
    });
}

function clearRestaurantMarkers() {
    restaurantMarkers.forEach(marker => {
        marker.setMap(null);
    });
    restaurantMarkers = [];
}

let locateMe = document.querySelector('#locateMe');
locateMe.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            selectedLocation = {
                lat: latitude,
                lng: longitude
            }

            const { AdvancedMarkerElement } = google.maps.importLibrary('marker');

            map.panTo(selectedLocation);
            addMarker(selectedLocation, AdvancedMarkerElement);
            addCircle(selectedLocation, radius);
          },
          (error) => {
            console.error('Error Code = ' + error.code + ' - ' + error.message);
          }
        );
      } 
    else {
        console.error('Geolocation is not supported by this browser.');
    }

});

// Initialize the map on window load
window.onload = initMap;