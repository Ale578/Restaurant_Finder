import requests
import json

def get_restaurants_near_coordinates(api_key, coordinates, radius):
    # Define the API endpoint
    url = 'https://places.googleapis.com/v1/places:searchNearby'

    # Specify list of fields to be returned
    headers = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': api_key, 
        'X-Goog-FieldMask': 'places.displayName,places.id,places.googleMapsUri,places.priceLevel,places.rating'
    }

    # Define the data payload for the POST request
    params = {
        "includedTypes": ["restaurant"],
        'min_rating': 4.5,
        "locationRestriction": {
        "circle": {
            "center": {
            "latitude":  coordinates['lat'],
            "longitude": coordinates['lng']
            },
            "radius": radius
        }
    }
    #    'priceLevels': 'PRICE_LEVEL_INEXPENSIVE'
    }
    

    # Make the POST request
    response = requests.post(url, headers=headers, data=json.dumps(params))

    # Check if the request was successful
    if response.status_code == 200:
        # Process the response
        response.json()    
    else:
        print(f'Error: {response.status_code}, {response.text}')
    return json.loads(response.text)


coordinates = {
    'lat': 40.961613,
    'lng': -5.667607
}

radius = 500.0

restaurants = get_restaurants_near_coordinates('AIzaSyAVIU2bh_pZL9s8ghkSSTeKnSpj_Ih5T3w', coordinates, radius)['places']

i = 0
for restaurant in restaurants:
    i += 1
    print(f'{i}. {restaurant}')
