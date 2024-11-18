// Create the map and set the initial view
var map = L.map('map').setView([20, 0], 2);

// Add the OpenStreetMap tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch the GeoJSON data
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson')
  .then(response => response.json())
  .then(data => {
    // Function to get the color based on depth
    function getColor(depth) {
        if (depth <= 70) return 'green';
        else if (depth <= 300) return 'orange';
        else return 'red';
    }

    // Function to get the size based on magnitude
    function getSize(magnitude) {
        return magnitude * 3;  
    }

    // Loop through the earthquake data and markers
    data.features.forEach(function(feature) {
        var lat = feature.geometry.coordinates[1];
        var lon = feature.geometry.coordinates[0];
        var depth = feature.geometry.coordinates[2];
        var magnitude = feature.properties.mag;
        var title = feature.properties.title;

        // Get the color based on magnitude
        var color = getColor(depth);
        var size = getSize(magnitude);

        // Add a circle marker for each earthquake
        L.circleMarker([lat, lon], {
            radius: size,
            color: color,
            weight: 1,
            fillColor: color,
            fillOpacity: 0.6
        })
        .bindPopup(`<b>Title:</b> ${title}<br><b>Magnitude:</b> ${magnitude}<br><b>Depth:</b> ${depth} km`)
        .addTo(map);
    });

    // Add a legend for color coding
    var legend = L.control({position: 'bottomleft'});
    legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = '<b>Depth Legend</b><br>';
        div.innerHTML += '<i style="background:green;"></i> <= 70 km<br>';
        div.innerHTML += '<i style="background:orange;"></i> 70-300 km<br>';
        div.innerHTML += '<i style="background:red;"></i> > 300 km';
        return div;
    };
    legend.addTo(map);
  })
  .catch(error => console.log('Error fetching data:', error));
