# Restaurant Finder

#### Video Demo: https://youtu.be/0o2OPr1JhA4

#### Description:

A website to find the best restaurants within a specific area.

Restaurant Finder is inspired by a [project](https://www.reddit.com/r/webdev/comments/11hmww9/showoff_saturday_i_built_a_website_to_gather_the/) I found on reddit by u/pilklopo. I enjoyed his idea of finding restaurants within a given radius so I decided to expand on it for my CS50x final project.

Restaurant Finder is a website to find restaurants near a location given by the user. The user can select a location in three ways, by clicking anywhere on the map, by typing the coordinates on the latitude and longitude inputs, or by clicking the "Locate me" button which will select the current location of the user's device. The user can click on the search button to get the results or they can customize their search further by decreasing or increasing the search radius, and by selecting a minimum restaurant rating. 

Once all the results have loaded onto the map and table, the user can browse the restaurants and view the restaurant names, ratings, number of ratings, price levels, and addresses. The user can also order the results by restaurant rating, distance from your selected location, restaurant price level, and number of ratings. The map and table are coordinated so if you click on a result on the map, the respective restaurant will be highlighted and vice versa.

My project consists of three main files: index.html, which is the website document; styles.css, which styles it; and map.js, which adds interactivity.

The main sections of the index.html are the map, options and table. I used the map from the Maps Javascript API from Google Maps because it was flexible enough to allow me to remove and add features and it worked well with the other Google Maps APIs. Adding an options panel was important to me so the user could easily customize their searches and organize their results. The Google Maps application is confusing to navigate unless you have invested some time to learn it so I decided to always make each section and feature of Restaurant Finder visible and intuitive. Finally, I made a table that displays the info of the restaurants.

For the styles.css document I wanted my website to have a responsive layout that adapts to the size of the window. One of the biggest challenges I faced was implementing a different layout when the window can't fit both the map and table panels. I decided to put the table panel below the map panel. The table had its own scroll wheel when there were too many results so while the user browsed the results, the map panel stayed visible. This didn't make sense to have for the small screen layout so I removed the table's own scroll function in favour of a layout where you can scroll in the default way. Figuring out how to implement this change was difficult because I didn't have much experience working with css or flexbox so I learned a lot.

In map.js I worked with the Google Maps Places API, Geolocation API and Geocoding API. I made it so whenever the user clicked on the screen, a marker would appear along with a search radius. Once the user searched for a location, it would request the information to the Places API and then it would append said information as a row onto table. Throughout the project, I kept getting new ideas on how to make my website better and I had to decide if they were worth the time. Originally, I didn't have the "order by distance" button but since proximity can influence a person's restaurant choice, I decided to use the Geolocation API to calculate the distance between the selected location and each restaurant result. Another feature I decided to implement was the Locate Me button which sends requests to the Geocoding API. I decided to implement the Locate me button because it can be a hassle to find your own coordinates and typing them into the latitude and longitude inputs.

Going forward, I am hoping to post Restaurant Finder online so people can enjoy a more efficient and enjoyable experience when searching for a place to eat.







