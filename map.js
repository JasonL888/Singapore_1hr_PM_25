// center of the map
var center = [1.355407, 103.807928];

// Create the map
var map = L.map('map').setView(center, 11);

// Set up the OSM layer
L.tileLayer(
  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    maxZoom: 18
  }).addTo(map);


L.marker({lat:1.35735,lon:103.7},{title:"West"}).addTo(map).bindPopup("West").openPopup();
L.marker({lat:1.35735,lon:103.94},{title:"East"}).addTo(map).bindPopup("East").openPopup();
L.marker({lat:1.295875,lon:103.82},{title:"South"}).addTo(map).bindPopup("South").openPopup();
L.marker({lat:1.41803,lon:103.82},{title:"North"}).addTo(map).bindPopup("North").openPopup();
L.marker({lat:1.35735,lon:103.82},{title:"Central"}).addTo(map).bindPopup("Central").openPopup();
