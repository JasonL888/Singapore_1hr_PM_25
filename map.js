// center of the map
var center = [1.355407, 103.807928];

// Create the map
var map = L.map('map').setView(center, 11);

// Set up the OSM layer
L.tileLayer(
  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18
  }).addTo(map);
