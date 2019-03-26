mapboxgl.accessToken =
	"pk.eyJ1Ijoic2FtZiIsImEiOiJjamRxY2MyZXExeHc0MnFvNGtha2tzd2YxIn0.F3QF4PYMrrpI-gtqumIkYg";

// set up filter group for filtering of items by year
var filterGroup = document.getElementById("filter-group");
var map = new mapboxgl.Map({
	container: "map", // container id
	style: "mapbox://styles/samf/cjoqivx4v1eae2snu8xfbf5jg", // stylesheet location
	center: [-99.782286, 38.408858], // starting position
  zoom: 3.6 // starting zoom
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
							 "#9D433D",
							 3,
							 "#9D433D"
					 ],
					 "circle-radius": [
							 "step",
							 ["get", "point_count"],
							 8,
							 1,
							 13,
							 5,
							 25
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
			"text-font": [
        "bdplakatt Regular",
        "Arial Unicode MS Bold"
      ],
			"text-size": 32
		},
		paint: {
			"text-color": "#FFFFFF"
		}
	});

	map.addLayer({
		id: "unclustered-point",
		type: "symbol",
		source: "sounds",
		filter: ["!has", "point_count"],
    layout: {
	    "icon-image": "blue-music-15",
      "icon-padding": 0,
      "icon-size": 1.25,
      "icon-rotate": 12,
      "icon-allow-overlap":true,
      "text-field": "",
      "text-font": [
        "bdplakatt Regular",
        "Arial Unicode MS Bold"
      ]
		}
	});
});

map.on('click', 'unclustered-point', function(e) {
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

map.on('mouseenter', 'unclustered-point', function() {
  map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'unclustered-point', function() {
  map.getCanvas().style.cursor = '';
});
