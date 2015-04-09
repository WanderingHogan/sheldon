

var CSV = 'sheldon-geocodio'

//On change to the text inputs, set the innerDistance and outerDistance
$( "#innerBuffer" ).change(function(e) {
	innerDistance = e.target.value;
});


// map object
var map = L.map('map',{
	scrollWheelZoom: false,
	zoomControl: false
}).setView([51.505, -0.09], 13);

// basemap
L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
		'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="http://mapbox.com">Mapbox</a>',
	id: 'hoganmaps.ikkpodh4'
}).addTo(map);

var greenMarker = { radius: 9, fillColor: "#00b200", color: "#ffffff", weight: 2, opacity: 1, fillOpacity: 0.9 };


//parse the CSV, turn it in to geojson, and put it on the map.
d3.csv('data/' + CSV + '.csv', function(err, inData){
	//borrowed from here http://bl.ocks.org/sumbera/10463358
	console.log(inData);
    var data = [];
    var count = 0;
    inData.map(function (d, i) {
    	if(d.Longitude === undefined){
    		count = count + 1;
    	}
        data.push({
            id: i,
            type: "Feature",
            properties: {
            	name: d.name,
            	status: d.status
            },
            geometry: {
                coordinates: [+d.Longitude, +d.Latitude],
                type: "Point"
            }
        });
    });
    console.log(count);
    geoData = { type: "FeatureCollection", features: data };
    geoJsonLyr = L.geoJson(geoData, {
        	pointToLayer: function (feature, latlng) {
		        return L.circleMarker(latlng, greenMarker);
		    },
		    onEachFeature: function(feature, layer) {
		    	layer.bindPopup(feature.properties.name + '</br>' + feature.properties.status);
		    }
		})
    	.addTo(map);
    map.fitBounds(geoJsonLyr.getBounds());
});