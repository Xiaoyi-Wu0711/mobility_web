/* global trans */
var map = L.map('map').setView([51.505, -0.09], 13);

const token = 'pk.eyJ1IjoibmVidWxhYml1IiwiYSI6ImNsMHIycWhucTJnbXozaW41YzJheTIzNXYifQ.HZkgl4qBDFO6MHqLxF5q6A';


var censusLayer=L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${token}`, {
  id: 'mapbox/light-v9',
  tileSize: 512,
  zoomOffset: -1,
}).addTo(map);


var mobilityLayer=L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${token}`, {
  id: 'mapbox/light-v9',
  tileSize: 512,
  zoomOffset: -1,
}).addTo(map);

L.geoJson(trans).addTo(map);




// get color depends on the visit count
function getColor(d) {
  return d > 5000 ? '#800026'
    : d > 1000 ? '#BD0026'
    : d > 500 ? '#E31A1C'
    : d > 100 ? '#FC4E2A'
    : d > 50 ? '#FD8D3C'
    : d > 20 ? '#FEB24C'
    : d > 10 ? '#FED976'
    : '#FFEDA0';
}

function style(features) {
  const year = 2019;
  return {
    fillColor: getColor(features.properties[year]),
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
  }
};





