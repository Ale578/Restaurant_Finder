let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: 40.961613, lng: -5.667607 },
    zoom: 8,
    });

//   const marker = new google.maps.marker.AdvancedMarkerElement({
//     position: myLatlng,
//     map,
//     title: "Click to zoom",
//   });

  map.addListener("click", (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    alert(lat)
    alert(lng)
    });
}
// alert("hey")

initMap();