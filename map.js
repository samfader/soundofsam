mapboxgl.accessToken =
	"pk.eyJ1Ijoic2FtZiIsImEiOiJjamRxY2MyZXExeHc0MnFvNGtha2tzd2YxIn0.F3QF4PYMrrpI-gtqumIkYg";

// set up filter group for filtering of items by year
var filterGroup = document.getElementById("filter-group");
var map = new mapboxgl.Map({
	container: "map", // container id
	style: "mapbox://styles/samf/cjoqivx4v1eae2snu8xfbf5jg", // stylesheet location
	center: [-99.782286, 38.408858], // starting position
	zoom: 4.3 // starting zoom
});

// Build list for sidebar
function buildYearList(data) {
	for (i = 0; i < data.features.length; i++) {
		var currentFeature = data.features[i];
		var prop = currentFeatures.properties;
	}
}

map.on("load", function() {
	map.addSource("sounds", {
		type: "geojson",
		data: "./features.geojson",
		cluster: true,
		clusterMaxZoom: 14,
		clusterRadius: 50
	});

	// // FILTERING ----
	// // TO DO: this should be the data in sounds somehow
	// var sounds = {
	//   "features": [
	//     {
	//       "type": "Feature",
	//       "properties": {
	//         "title": "Pacific Ocean at Cascade Head",
	//         "recording_device": "Portable Zoom iPhone",
	//         "html": "<p><audio width='300' height='32' src='https://dl.dropboxusercontent.com/s/tps1xqh28o1mqad/mp3Pacific%20Ocean%20At%20Cascade%20Head.mp3?' controls='controls'><br />Your browser does not support the audio element.<br /></audio></p>"
	//       },
	//       "geometry": {
	//         "coordinates": [
	//           -124.009127,
	//           45.05322
	//         ],
	//         "type": "Point"
	//       },
	//       "id": "8d41e04b65554ad2ee1781b9a6640b83"
	//     },
	//     {
	//       "type": "Feature",
	//       "properties": {
	//         "title": "Bridge on Clackamas River Trail Near Indian Henry Campground",
	//         "description": "",
	//         "recording_device": "Portable Zoom iPhone",
	//         "html": "<p><audio width='300' height='32' src='https://dl.dropboxusercontent.com/s/8xxkmw4wdru23j3/Bridge%20On%20Clackamas%20River%20Trail%20Near%20Indian%20Henry%20Campground%20%281%29.mp3?' controls='controls'><br />Your browser does not support the audio element.<br /></audio></p>"
	//       },
	//       "geometry": {
	//         "coordinates": [
	//           -122.079219,
	//           45.124683
	//         ],
	//         "type": "Point"
	//       },
	//       "id": "ef95770ed9337c2f4b71b71379231c0b"
	//     }
	//   ],
	//   "type": "FeatureCollection"
	// }

	// // filtering
	// sounds.features.forEach(function(feature) {
	// 	// TO DO: add error handling in here in case year does not exist
	// 	var year = feature.properties['year'];
	// 	var layerID = 'year-' + year;

	// 	// add layer for the year if it hasn't been
	// 	if (!map.getLayer(layerID)) {
	// 		map.addLayer({
	// 			id: layerID,
	// 			type: 'circle',
	// 			source: 'sounds',
	// 			// TO DO: fix this, this filter is causing the points not to show up
	// 			// filter: ['all', ['has', 'point_count'], ['==', 'year', year]],
	// 	    paint: {
	// 	    	'circle-color': '#000000',
	// 	    }
	// 		});
	// 	}

	// 	var input = document.createElement('input');
	// 	input.type = 'checkbox';
	// 	input.id = layerID;
	// 	input.checked = true;
	// 	filterGroup.appendChild(input);

	// 	var label = document.createElement('label');
	// 	label.setAttribute('for', layerID);
	// 	label.textContent = year;
	// 	filterGroup.appendChild(label);

	// 	// When the checkbox changes, update layer visibility
	// 	input.addEventListener('change', function(e) {
	// 		console.log(e.target.checked);
	// 		map.setLayoutProperty(layerID, 'visibility', e.target.checked ? 'visible' : 'none');
	// 		console.log(map.getLayoutProperty(layerID, 'visibility'));
	// 	});

	// 	// TO DO: make sure this is working
	// 	map.on('mouseenter', layerID, function() {
	// 		map.getCanvas().style.cursor = 'pointer';
	// 	});

	// 	map.on('mouseleave', layerID, function() {
	// 		map.getCanvas().style.cursor = '';
	// 	});
	// });

	// add clustering
	// TO DO: fix this, think it needs to be changed to circle as well?

	map.addLayer({
			 id: "clusters",
			 type: "circle",
			 source: "sounds",
			 filter: ["has", "point_count"],
			 paint: {
					 // Use step expressions (https://www.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
					 // with three steps to implement three types of circles:
					 //   * Blue, 20px circles when point count is less than 100
					 //   * Yellow, 30px circles when point count is between 100 and 750
					 //   * Pink, 40px circles when point count is greater than or equal to 750
					 "circle-color": [
							 "step",
							 ["get", "point_count"],
							 "#f1f075",
							 3,
							 "#f1f075"
					 ],
					 "circle-radius": [
							 "step",
							 ["get", "point_count"],
							 20,
							 2,
							 30,
							 5,
							 40
					 ]
			 }
	 });

	map.addLayer({
		id: "cluster-count",
		type: "symbol",
		source: "sounds",
		filter: ["has", "point_count"],
		layout: {
			"text-field": "{point_count_abbreviated}",
			"text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
			"text-size": 20
		},
		paint: {
			"text-color": "#7166c4"
		}
	});

	map.addLayer({
		id: "unclustered-point",
		type: "symbol",
		source: "sounds",
		filter: ["!has", "point_count"],
    layout: {
	    "icon-image": "music-11",
	    "icon-padding": 0,
	    "icon-allow-overlap":true
		}
	});
});

map.on("click", function(e) {
	var features = map.queryRenderedFeatures(e.point, {});

	if (!features.length) {
		return;
	}

	var feature = features[0];

	// fly to point when clicked

	map.flyTo({ center: feature.geometry.coordinates });

	// popup with mp3 and info
	var popup = new mapboxgl.Popup({ offset: [0, -15] })
		.setLngLat(feature.geometry.coordinates)
		.setHTML(
			"<h3>" +
				feature.properties.title +
				" - " +
				feature.properties.year +
				"</h3>" +
				feature.properties.html
		)
		.setLngLat(feature.geometry.coordinates)
		.addTo(map);
});
