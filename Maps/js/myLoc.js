window.onload = getMyLocation;
var watchId = null;
var options = {enableHighAccuracy: true, maximumAge: 60000};

function watchLocation() {
  watchId = navigator.geolocation.watchPosition
  (displayLocation, displayError, options);
}

function clearWatch() {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}

var ourCoords = {
  latitude: 47.624851,
  longitude: -122.52099
};

function getMyLocation() {
  if (navigator.geolocation) {
    var watchButton = document.getElementById("watch");
    watchButton.onclick = watchLocation;
    var clearWatchButton = document.getElementById("clearWatch");
    clearWatchButton.onclick = clearWatch;
  } else {
    alert("Oops, no geolocation support");
  }
}

function displayLocation(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  var div = document.getElementById("location");

  div.innerHTML = "You are at Latitude: " + latitude + ", Longitude: " + longitude;
  div.innerHTML += " (with " + position.coords.accuracy + " meters accuracy)";

  var km = computeDistance(position.coords, ourCoords);
  distance.innerHTML = "You are " + km + " km from the WickedlySmart HQ";
  
  if (map == null) {
    showMap(position.coords);
  } else {
    scrollMapToPosition(position.coords);
  }
}

function displayError(error) {
  var errorTypes = {
    0: "Unknow error",
    1: "Permission denied by user",
    2: "Position is not available",
    3: "Request timed out"
  };
  var errorMessage = errorTypes[error.code];
  if(error.code == 0 || error.code == 2) {
    errorMessage = errorMessage + " " + error.message;
  }
  var div = document.getElementById("location");
  div.innerHTML = errorMessage;
}

function computeDistance(startCoords, destCoors) {
  var startLatRads = degreesToRadians(startCoords.latitude);
  var startLongRads = degreesToRadians(startCoords.longitude);
  var destLatRads = degreesToRadians(destCoors.latitude);
  var destLongRads = degreesToRadians(destCoors.longitude);

  var Radius = 6371;
  var distance = Math.acos(Math.sin(startLatRads)* Math.sin(destLatRads) + 
          Math.cos(startLatRads) * Math.cos(destLatRads)*
          Math.cos(startLongRads - destLongRads)) * Radius;

          return distance;
}

function degreesToRadians(degrees) {
  var radians = (degrees * Math.PI) /180;
  return radians;
}

//Map Start
var map;

function showMap(coords) {
  var googleLatAndLong = new google.maps.LatLng(coords.latitude, coords.longitude);

  var mapOptions = {
    zoom: 10,
    center: googleLatAndLong,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var mapDiv = document.getElementById("map");
  map = new google.maps.Map(mapDiv, mapOptions);

  	// add the user marker
	var title = "Your Location";
	var content = "You are here: " + coords.latitude + ", " + coords.longitude;
	addMarker(map, googleLatAndLong, title, content);
}
// Map End

//Marker Start

function addMarker(map, latlong, title, content) {

  var markerOptions = {
    position: latlong,
    map: map,
    title: title,
    clickable: true
  };

  var marker = new google.maps.Marker(markerOptions);

  var infoWindowOptions = {
    content: content,
    position: latlong
  };

  var infoWindow = new google.maps.InfoWindow(infoWindowOptions);

  google.maps.event.addListener(marker, "click", function() {
    infoWindow.open(map);
  });

}

// Marker End

// ScrollMap Start

function scrollMapToPosition(coords) {
  var latitude = coords.latitude;
  var longitude = coords.longitude;
  var latlong = new google.maps.LatLng(latitude, longitude);

  map.panTo(latlong);

  addMarker(map, latlong, "Your new location", "You moved to: " + latitude + ", " + longitude);
}

// ScrollMap End
