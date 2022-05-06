/* global data */

mapboxgl.accessToken = 'pk.eyJ1IjoibmVidWxhYml1IiwiYSI6ImNsMHIycWhucTJnbXozaW41YzJheTIzNXYifQ.HZkgl4qBDFO6MHqLxF5q6A';

var view1 = {
	center: [-73.93, 40.73],
	zoom: 9,
	bearing: 0,
	pitch: 0,
	speed: 0.5,
	curve: 0.5
  };



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

var countsMap = new mapboxgl.Map({
    container: 'counts',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-73.93, 40.73],
    zoom: 10
});

var equityMap = new mapboxgl.Map({
    container: 'equity',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-73.93, 40.73],
    zoom: 10
});

const container = '.map-container';

const map = new mapboxgl.Compare(countsMap, equityMap, container,{
	//  mousemove: true
});

const yearLevelSelect = document.querySelector('#year-level-select');
const indLevelSelect = document.querySelector('#industry-level-select');
let year = String(yearLevelSelect.value);
let ind = String(indLevelSelect.value);
let var_name = '2019_edu';
let mostVisit_coord = [-73.995019, 40.739868];

//year = '2019';
//ind = 'Education'


function buildMap(data, mapname, legend, dataStyleProp, map_type) {

	var vtMatchProp = "tract_id";
	var dataMatchProp = "tract_id";
	var dataStyleProp = dataStyleProp;

	// First value is the default, used where the is no data
	var stops = [];

	// Calculate color for each state based on the overdose death rate

	var numbers = data.features.map(function(val) {
	return Number(val.properties[dataStyleProp])
	});

	//console.log(numbers);

	var numbersIndex = data.features.map(function(val) {
	var index = val.properties[dataMatchProp] + "|" + val.properties[dataStyleProp];
	return index
	});

	//console.log(numbersIndex);

	//chroma quantile scale
	var limits = chroma.limits(numbers, 'q', 4);

	//chroma color scale
	var colorScale;
	// var colorScale = chroma.scale(['#fafa6e', '#2A4858']).mode('lch').colors(6);

	if(map_type === 'equity'){
		colorScale1 = chroma.scale(['#7fcdbb', '#253494']).mode('lch').colors(4);
	} else{
		colorScale1 = chroma.scale(['#fee090', '#a50026']).mode('lch').colors(4);
	}

	console.log(limits);

	console.log(colorScale1);

	var newData = data.features.map(function(county) {
		var color = "#fafa6e";
		for (var i = 1; i < limits.length; i++) {
			if (county.properties[dataStyleProp] <= limits[i]) {
			color = colorScale1[i-1];
			//console.log(county.properties[dataStyleProp])
			//console.log(color)
			break;
			}
		}

		var id = county.properties[dataMatchProp];
		return [id, color]
	});

	mapname.addSource('counties', {
		'type': 'geojson',
		'data': 'data_2.geojson'
	});

	// Add layer from the vector tile source with data-driven style
	mapname.addLayer({
		"id": "countiesLayer",
		"type": "fill",
		"source": "counties",
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

	// let countsPopup = null;
	// let equityPopup = null;
	mapname.on('click', 'countiesLayer', (e) => {
		const popups = document.getElementsByClassName('mapboxgl-popup');
		for (const p of popups ) {
			p.remove();
		}

		// if (countsPopup !== null) { countsPopup.remove(); }
		// if (equityPopup !== null) { equityPopup.remove(); }

		new mapboxgl.Popup({
			closeButton: false,
			closeOnClick: false
		}
		)
			.setLngLat(e.lngLat)
			.setHTML('Tract ID: ' + e.features[0].properties.tract_id + `<br>${year} ${ind} Visit Count: ` + e.features[0].properties[var_name] + `<br>Poverty Rate: ` + Math.round(e.features[0].properties.pctPoverty*100) + '%')
			.addTo(countsMap);

		new mapboxgl.Popup({
			closeButton: false,
			closeOnClick: false
		})
			.setLngLat(e.lngLat)
			.setHTML('Tract ID: ' + e.features[0].properties.tract_id + `<br>${year} ${ind} Visit Count: ` + e.features[0].properties[var_name] + `<br>Poverty Rate: ` + Math.round(e.features[0].properties.pctPoverty*100) + '%')
			.addTo(equityMap);
	});

        // Change the cursor to a pointer when
        // the mouse is over the states layer.
  mapname.on('mouseenter', 'countiesLayer', () => {
		mapname.getCanvas().style.cursor = 'pointer';

	});

        // Change the cursor back to a pointer
        // when it leaves the states layer.
  mapname.on('mouseleave', 'countiesLayer', () => {
		mapname.getCanvas().style.cursor = '';
		// popup.remove();

	});





	var legend_name;
	if(map_type === 'equity'){
		legend_name = 'equity_legend';
	} else{
		legend_name = 'counts_legend';
	}

	if (legend != null) {
	var div = document.createElement('DIV');
	div.className = 'legend';
	div.id = legend_name;
	/* Add min & max*/
	var labels = []

	var legend_title;
	var legend_subtitle;
	if (map_type === 'equity') {
		legend_title = 'Poverty Ratio Quantile';
		legend_subtitle = '***how poverty ratio is calculated'
	} else {
		legend_title = 'Visit Counts Quantile'
		legend_subtitle = `Year: ${year}, Industry: ${ind}`
	}

	div.innerHTML = `<div><h3 style="font-weight:bolder;font-size:larger;padding:0px;margin-block-start:0em;margin-block-end:0em;">${legend_title}</h3>
	<div><h4 style="font-style:italic;margin-block-start:0em;margin-block-end:0em;">${legend_subtitle}</h4></div>
	<div class="labels"><div class="min" style="font-size:10px;">0%&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;25%&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;50%&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;75%&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;100%</div>`

	for (i = 0; i < colorScale1.length; i++) {
		labels.push('<li style="background-color: ' + colorScale1[i] + '"></li>')
	}

	if(map_type === 'equity'){
		div.innerHTML += '<ul style="list-style-type:none;display:flex;padding-inline-start:0px;margin-block-start:0em;margin-block-end:0em;margin-inline-end:35px;">' + labels.join('') + '</ul>'
		document.getElementById('equity').appendChild(div);
	} else{
		div.innerHTML += '<ul style="list-style-type:none;display:flex;padding-inline-start:0px;margin-block-start:0em;margin-block-end:0em;margin-inline-end:35px;">' + labels.join('') + '</ul>'
		document.getElementById('counts').appendChild(div);
	}

	}

	// var ex = document.getElementById('extrude');
	// ex.addEventListener('click', function() {
	//   if ((mapname.getLayoutProperty('countiesLayer', 'visibility')) === 'visible') {
	// 	mapname.setLayoutProperty(vtMatchProp, 'visibility', 'visible');
	// 	ex.className = 'mapboxgl-ctrl-group active';
	// 	setTimeout(function() {
	// 		mapname.flyTo(view1);
	// 		mapname.setLayoutProperty('countiesLayer', 'visibility', 'none');
	// 	}, 2000);
	//   } else {
	// 	mapname.setLayoutProperty('countiesLayer', 'visibility', 'visible');
	// 	mapname.setLayoutProperty(vtMatchProp, 'visibility', 'none');
	// 	ex.className = 'mapboxgl-ctrl-group';
	// 	mapname.flyTo(view1);
	//   }
	// });

}



// var popup = new mapboxgl.Popup({
// 	closeButton: false,
// 	closeOnClick: false
//   });

//   function identifyFeatures(location, layer, fields) {
// 	var identifiedFeatures = map.queryRenderedFeatures(location.point, layer);
// 	/*console.log(identifiedFeatures);*/
// 	popup.remove();
// 	if (identifiedFeatures != '') {
// 	  var popupText = "";
// 	  for (i = 0; i < fields.length; i++) {
// 		popupText += "<strong>" + fields[i] + ":</strong> " + identifiedFeatures[0].properties[fields[i]] + "<" + "br" + ">"
// 	  };
// 	  popup.setLngLat(location.lngLat)
// 		.setHTML(popupText)
// 		.addTo(map);
// 	}
//   }





equityMap.addControl(new mapboxgl.NavigationControl());

equityMap.on('load', function() {
	equityMap.flyTo(view1);
	var maxValue = 16;
	console.log('json data loaded');
	//console.log(data);
	buildMap(data, equityMap, true,'pctPoverty', 'equity');

	buildMap(data, countsMap, true,'2019_edu', 'counts');

	})

// afterMap.on('click', function(e) {
//   identifyFeatures(e, 'countiesLayer', ['tract_id','borough'])
// });

// afterMap.on('mousemove', function(e) {
//   identifyFeatures(e, 'countiesLayer', ['tract_id','borough'])
// });

function mapUpdate() {
	//equityMap.removeLayer('countiesLayer');
	//equityMap.removeSource('counties');
	countsMap.removeLayer('countiesLayer');
	countsMap.removeSource('counties');
	const year = String(yearLevelSelect.value);
	const ind = String(indLevelSelect.value);
	//buildMap(data, equityMap, true,'pctPoverty', 'equity');
	buildMap(data, countsMap, true, var_name, 'counts');
}



/////////////////////////////////////////////////////

// char initialization
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

// selector
const handleSelectChange = () => {
	yearindUpdate();
	plotUpdate();
	mapUpdate();
};

yearLevelSelect.addEventListener('change', handleSelectChange);
indLevelSelect.addEventListener('change', handleSelectChange);

function yearindUpdate() {
	year = String(yearLevelSelect.value)
	ind = String(indLevelSelect.value)
	if (year === 'Total') {
		var_name = 'tot' + '_' + ind.toLowerCase().slice(0,3);
	} else {
		var_name = year + '_' + ind.toLowerCase().slice(0,3);
	}
	console.log(year)
	console.log(ind)
	console.log(var_name)
}


//console.log(varUpdate())

const BronxData = data.features.filter(element => element.properties['borough'] === 'Bronx')
const BrooklynData = data.features.filter(element => element.properties['borough'] === 'Brooklyn')
const ManhattanData = data.features.filter(element => element.properties['borough'] === 'Manhattan')
const QueensData = data.features.filter(element => element.properties['borough'] === 'Queens')
const StatenIslandData = data.features.filter(element => element.properties['borough'] === 'Staten Island')

function plotUpdate() {
	const year = String(yearLevelSelect.value);
	const ind = String(indLevelSelect.value);
  myChartBar.data.labels = ['Bronx', 'Brooklyn', 'Manhattan', 'Queens', 'Staten Island'];


	const BronxValue = BronxData.reduce((sum, element) => sum + element.properties[var_name], 0)
	const BrooklynValue = BrooklynData.reduce((sum, element) => sum + element.properties[var_name], 0)
	const ManhattanValue = ManhattanData.reduce((sum, element) => sum + element.properties[var_name], 0)
	const QueensValue = QueensData.reduce((sum, element) => sum + element.properties[var_name], 0)
	const StatenIslandValue = StatenIslandData.reduce((sum, element) => sum + element.properties[var_name], 0)
	myChartBar.data.datasets[0].data = [BronxValue, BrooklynValue, ManhattanValue, QueensValue, StatenIslandValue];

  //myChartBar.data.datasets[0].data = [BronxValue, BrooklynValue, ManhattanValue, QueensValue, StatenIslandValue];

	const totalVisit = d3.sum(myChartBar.data.datasets[0].data);
	document.getElementById('visit').innerHTML = new Number(totalVisit);
	const mostVisit = _.max(data.features, feature => parseInt(feature.properties[var_name]));
	document.getElementById('dwell').innerHTML = new String('Tract ID: ' + mostVisit.properties.tract_id + ' <br><br>in ' + mostVisit.properties.borough);
	myChartBar.update();
	mostVisit_coord = mostVisit.geometry.coordinates[0][0]
	console.log(mostVisit_coord)
}



document.getElementById('fly').addEventListener('click', () => {
	equityMap.flyTo({
		center: mostVisit_coord,
		essential: true, // this animation is considered essential with respect to prefers-reduced-motion
		zoom: 13
	})
	const popup1 = new mapboxgl.Popup()
	.setLngLat(mostVisit_coord)
	.setHTML(`<h3>The Most Popular Place<br>in ${year}, ${ind}<h3>`)
	.addTo(countsMap);
	const popup2 = new mapboxgl.Popup()
	.setLngLat(mostVisit_coord)
	.setHTML(`<h3>The Most Popular Place<br>in ${year}, ${ind}<h3>`)
	.addTo(equityMap);
});
