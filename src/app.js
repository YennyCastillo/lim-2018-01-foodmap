const mapa = document.getElementById('map');
const places = document.getElementById('places');

let map, infoWindow, service;

function initMap() {
  let pos;


  infoWindow = new google.maps.InfoWindow();
  console.log(infoWindow)
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

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
  console.log(results)
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (place of results) {
      createMarker(place);
      paintData(place)
    }
  }
}

function createMarker(place) {
  console.log(place)
  // let placeLoc = place.geometry.location;
  let marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function () {
    infoWindow.setContent(place.name);
    infoWindow.open(map, this);

  });
}

const paintData = (place) => {
  console.log(place)
  let photos = place.photos;
  if (place.hasOwnProperty('photos')) {
    photo = photos[0].getUrl({
      'maxWidth': 400,
      'maxHeight': 300
    });
  } else {
    photo = place.icon;
  }
  if (place.hasOwnProperty('rating')) {
    rating = place.rating;
  } else {
    rating = ' - ';
  }
  if (place.hasOwnProperty('vicinity')) {
    direction = place.vicinity;
  } else {
    direction = ' - ';
  }
  
  places.innerHTML += `
    <div class="m-2 shadow p-3 mb-5 bg-white rounded" style="width: 450px; height: 200px">
      <a data-toggle="modal"  data-target="#${place.id}"><img class="card-img-top" style="width: 400px; height: 150px" src="${photo}" alt="${place.name}"></a>
      <h5 class=""> ${place.name}</h5>
    </div>
  
    <div class="modal fade" id="${place.id}" tabindex="-1" role="dialog"  aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="${place.id}">${place.name}</h5>
          </div>
          <div class="modal-body">
            <div>
              <img src="${place.plus_code.compound_code}" alt="mapaUbicacion">
            </div>
          </div>
          <div class="">
            <p> Clasificacion: ${place.rating}</p>
            <p> Direccion: ${place.vicinity}</p> 
            <button type="button" class="btn btn-warning ml-auto" data-dismiss="modal">Close</button>   
          </div>
        </div>
      </div>
    </div>


  `;
  
}



