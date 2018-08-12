const mapa = document.getElementById("map")

let map, infoWindow, service;

function initMap() {
  let pos;
  // let pyrmont;

  infoWindow = new google.maps.InfoWindow();
  console.log(infoWindow)
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      // pyrmont = new google.maps.LatLng(pos);
      // console.log(pyrmont)
      map = new google.maps.Map(mapa, {
        center: pos,
        zoom: 15
      });
      console.log(map)
      let request = {
        location: pos,
        radius: '500',
        type: ['restaurant']
      };
      console.log(request)

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      infoWindow.open(map);
      map.setCenter(pos);

      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, callback);
    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });

  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }



}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: el servicio de geolocalización falló.' :
    'Error: su navegador no admite la geolocalización.');
  infoWindow.open(mapa);
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  let placeLoc = place.geometry.location;
  let marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function () {
    infoWindow.setContent(place.name);
    infoWindow.open(map, this);
  });
}



