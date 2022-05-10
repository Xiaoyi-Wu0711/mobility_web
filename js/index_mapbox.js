/* global data */
/* global chroma */
/* global d3 */

// set initial view
var view1 = {
  center: [-73.93, 40.73],
  zoom: 9,
  bearing: 0,
  pitch: 0,
  speed: 0.5,
  curve: 0.5
};

// set style
var style = {
  "version": 8,
  "name": "blank",
  "sources": {
    "openmaptiles": {
      "type": "vector",
      "url": ""
    },
  },
  "layers": [{
    "id": "background",
    "type": "background",
    "paint": {
      "background-color": "#1d1f20"
    }
  }]
};

mapboxgl.accessToken = 'pk.eyJ1IjoibmVidWxhYml1IiwiYSI6ImNsMHIycWhucTJnbXozaW41YzJheTIzNXYifQ.HZkgl4qBDFO6MHqLxF5q6A';

// visit counts map
let countsMap = new mapboxgl.Map({
  container: 'counts',
  style: 'mapbox://styles/mapbox/light-v10',
  center: [-73.93, 40.73],
  zoom: 10
});

// poverty rate map
let equityMap = new mapboxgl.Map({
  container: 'equity',
  style: 'mapbox://styles/mapbox/light-v10',
  center: [-73.93, 40.73],
  zoom: 10
});

// create map slider
const container = '.map-container';
const map = new mapboxgl.Compare(countsMap, equityMap, container, {});

// selector
const yearLevelSelect = document.querySelector('#year-level-select');
const indLevelSelect = document.querySelector('#industry-level-select');
let year = String(yearLevelSelect.value);
let ind = String(indLevelSelect.value);

// initial year and industry
let var_name = '2019_edu';
// most popular place in 2019 edu
let mostVisit_coord = [-73.995019, 40.739868];

// create a function for setting up each map in the slider
function buildMap(data, mapname, legend, dataStyleProp, map_type) {
  // getting values from properties
  var vtMatchProp = "tract_id";
  var dataMatchProp = "tract_id";

  var numbers = data.features.map((val) => {
    return Number(val.properties[dataStyleProp]);
  });

  var numbersIndex = data.features.map((val) => {
    var index = `${val.properties[dataMatchProp]}|${val.properties[dataStyleProp]}`;
    return index;
  });

  // for legend creation
  var legend_name;
  var labels = [];
  var legend_title;
  var legend_subtitle;
  var div;

  var limits = chroma.limits(numbers, 'q', 4);

  var colorScale;

  if (map_type === 'equity') {
    colorScale = chroma.scale(['#7fcdbb', '#253494']).mode('lch').colors(4);
  } else {
    colorScale = chroma.scale(['#fee090', '#a50026']).mode('lch').colors(4);
  }

  let newData = data.features.map((county) => {
    var id = county.properties[dataMatchProp];
    var color = "#fafa6e";
    for (let i = 1; i < limits.length; i++) {
      if (county.properties[dataStyleProp] <= limits[i]) {
        color = colorScale[i - 1];
        break;
      }
    }
    return [id, color];
  });

  // data source from the geojson file specified
  mapname.addSource('tracts', {
    'type': 'geojson',
    'data': 'data/data_2.geojson'
  });

  // add layer from the source
  mapname.addLayer({
    "id": "tractsLayer",
    "type": "fill",
    "source": "tracts",
    "paint": {
      "fill-color": {
        "property": vtMatchProp,
        "type": "categorical",
        "stops": newData
      },
      "fill-opacity": 0.7,
      "fill-outline-color": "hsla(11,0%,75%,1)"
    }
  });

  // define popup windows
  mapname.on('click', 'tractsLayer', (e) => {
    const pop = document.getElementsByClassName('mapboxgl-popup-content');
    if (typeof pop !== 'undefined') {
      for (let i = 0; i < pop.length; i++) {
        pop[i].remove();
      }
    }
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(`Tract ID: ${e.features[0].properties.tract_id}<br>${year} ${ind} Visit Count: ${e.features[0].properties[var_name]}<br>Poverty Rate: ${Math.round(e.features[0].properties.pctPoverty * 100)}%`)
      .addTo(countsMap);
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(`Tract ID: ${e.features[0].properties.tract_id}<br>${year} ${ind} Visit Count: ${e.features[0].properties[var_name]}<br>Poverty Rate: ${Math.round(e.features[0].properties.pctPoverty * 100)}%`)
      .addTo(equityMap);
    const closeButton = document.getElementsByClassName('mapboxgl-popup-close-button');
    const pop2 = document.getElementsByClassName('mapboxgl-popup-content');
    const pop3 = document.getElementsByClassName('mapboxgl-popup mapboxgl-popup-anchor-bottom');
    function removePop23() {
      for (let i = 0; i < pop2.length; i++) {
        pop2[i].remove();
        pop3[i].remove();
      }
    }
    for (let i = 0; i < closeButton.length; i++) {
      closeButton[i].addEventListener('click', removePop23);
    }
  });

  // Change the cursor to a pointer when hovering
  mapname.on('mouseenter', 'tractsLayer', () => {
    const mn1 = mapname;
    mn1.getCanvas().style.cursor = 'pointer';
  });
  mapname.on('mouseleave', 'tractsLayer', () => {
    const mn2 = mapname;
    mn2.getCanvas().style.cursor = '';
  });

  // legend creation
  if (map_type === 'equity') {
    legend_name = 'equity_legend';
  } else {
    legend_name = 'counts_legend';
  }

  if (legend != null) {
    div = document.createElement('DIV');
    div.className = 'legend';
    div.id = legend_name;
    /* Add min & max */

    if (map_type === 'equity') {
      legend_title = 'Poverty Ratio Quantile';
      legend_subtitle = '***how poverty ratio is calculated';
    } else {
      legend_title = 'Visit Counts Quantile';
      legend_subtitle = `Year: ${year}, Industry: ${ind}`;
    }

    div.innerHTML = `<div><h3 style="font-weight:bolder;font-size:larger;padding:0px;margin-block-start:0em;margin-block-end:0em;">${legend_title}</h3>
      <div><h4 style="font-style:italic;margin-block-start:0em;margin-block-end:0em;">${legend_subtitle}</h4></div>
      <div class="labels"><div class="min" style="font-size:10px;">0%&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;25%&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;50%&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;75%&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;100%</div>`;

    for (let i = 0; i < colorScale.length; i++) {
      labels.push(`<li style="background-color: ${colorScale[i]}"></li>`);
    }

    if (map_type === 'equity') {
      div.innerHTML += `<ul style="list-style-type:none;display:flex;padding-inline-start:0px;margin-block-start:0em;margin-block-end:0em;margin-inline-end:35px;">${labels.join('')}</ul>`;
      document.getElementById('equity').appendChild(div);
    } else {
      div.innerHTML += `<ul style="list-style-type:none;display:flex;padding-inline-start:0px;margin-block-start:0em;margin-block-end:0em;margin-inline-end:35px;">${labels.join('')}</ul>`;
      document.getElementById('counts').appendChild(div);
    }
  }
}

// initialize both maps in the slider
equityMap.addControl(new mapboxgl.NavigationControl());

equityMap.on('load', () => {
  var maxValue = 16;
  equityMap.flyTo(view1);
  buildMap(data, equityMap, true, 'pctPoverty', 'equity');
  buildMap(data, countsMap, true, '2019_edu', 'counts');
});

// update maps
function mapUpdate() {
  document.getElementById('counts_legend').remove();
  countsMap.removeLayer('tractsLayer');
  countsMap.removeSource('tracts');
  year = String(yearLevelSelect.value);
  ind = String(indLevelSelect.value);
  buildMap(data, countsMap, true, var_name, 'counts');
}

// initialize the chart
Chart.defaults.color = 'white';
const variable = document.getElementById('myChartBar');
const myChartBar = new Chart(variable, {
  type: 'bar',
  data: {
    labels: ['Bronx', 'Brooklyn', 'Manhattan', 'Queens', 'Staten Dislands'],
    datasets: [{
      color: 'white',
      data: [6402, 9076, 314491, 97, 243],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    plugins: {
      legend: false,
      title: {
        display: true,
        text: 'Visit counts to different boroughs'
      },
      scales: {
        y: {
          beginAtZero: true,
        }
      }
    }
  }
});

// update year and industry
function yearindUpdate() {
  year = String(yearLevelSelect.value);
  ind = String(indLevelSelect.value);
  if (year === 'Total') {
    var_name = `tot_${ind.toLowerCase().slice(0, 3)}`;
  } else {
    var_name = `${year}_${ind.toLowerCase().slice(0, 3)}`;
  }
  console.log(year);
  console.log(ind);
  console.log(var_name);
}

// get data for each borough
const BronxData = data.features.filter(element => element.properties.borough === 'Bronx');
const BrooklynData = data.features.filter(element => element.properties.borough === 'Brooklyn');
const ManhattanData = data.features.filter(element => element.properties.borough === 'Manhattan');
const QueensData = data.features.filter(element => element.properties.borough === 'Queens');
const StatenIslandData = data.features.filter(element => element.properties.borough === 'Staten Island');

// define a function for updating the chart
function plotUpdate() {
  myChartBar.data.labels = ['Bronx', 'Brooklyn', 'Manhattan', 'Queens', 'Staten Island'];
  // get the sum
  const BronxValue = BronxData
    .reduce((sum, element) => sum + element.properties[var_name], 0);
  const BrooklynValue = BrooklynData
    .reduce((sum, element) => sum + element.properties[var_name], 0);
  const ManhattanValue = ManhattanData
    .reduce((sum, element) => sum + element.properties[var_name], 0);
  const QueensValue = QueensData
    .reduce((sum, element) => sum + element.properties[var_name], 0);
  const StatenIslandValue = StatenIslandData
    .reduce((sum, element) => sum + element.properties[var_name], 0);
  myChartBar.data.datasets[0].data = [
    BronxValue, BrooklynValue, ManhattanValue, QueensValue, StatenIslandValue
  ];

  const totalVisit = d3.sum(myChartBar.data.datasets[0].data);
  document.getElementById('visit').innerHTML = Number(totalVisit);
  const mostVisit = _.max(data.features, feature => parseInt(feature.properties[var_name], 10));
  document.getElementById('dwell').innerHTML = String(`Tract ID: ${mostVisit.properties.tract_id} <br><br>in ${mostVisit.properties.borough}`);
  myChartBar.update();
  const lng = mostVisit.geometry.coordinates[0][0][0];
  const lat = mostVisit.geometry.coordinates[0][0][1];
  mostVisit_coord = [lng, lat];
  console.log(mostVisit_coord);
}

// update elements on the page based on input from dropdown lists
const handleSelectChange = () => {
  yearindUpdate();
  plotUpdate();
  mapUpdate();
};

yearLevelSelect.addEventListener('change', handleSelectChange);
indLevelSelect.addEventListener('change', handleSelectChange);

// fly to the most popular tract
document.getElementById('fly').addEventListener('click', () => {
  equityMap.flyTo({
    center: mostVisit_coord,
    essential: true,
    zoom: 13
  });
  const popup1 = new mapboxgl.Popup()
    .setLngLat(mostVisit_coord)
    .setHTML(`<h3>The Most Popular Place<br>in ${year}, ${ind}<h3>`)
    .addTo(countsMap);
  const popup2 = new mapboxgl.Popup()
    .setLngLat(mostVisit_coord)
    .setHTML(`<h3>The Most Popular Place<br>in ${year}, ${ind}<h3>`)
    .addTo(equityMap);
});
