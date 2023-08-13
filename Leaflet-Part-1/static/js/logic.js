// //Earthquake URL

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

let map = L.map("map", {
    center: [0, -20],
    zoom: 2
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add color based on the depth
function getColor(depth) {
    return depth > 300 ? '#800026' :
           depth > 100 ? '#BD0026' :
           depth > 50 ? '#E31A1C' :
           depth > 20 ? '#FC4E2A' :
                         '#FFEDA0';
}

// GeoJson eartquacke data 
fetch(url)
    .then(response => response.json())
    .then(data => {
        // Iterate through the earthquakes and add markers to the map
        data.features.forEach(feature => {
            let coords = feature.geometry.coordinates;
            let magnitude = feature.properties.mag;
            let depth = coords[2]; 
            

            // Create a marker for each eartquake
            L.circleMarker([coords[1], coords[0]], {
                radius: magnitude * 2,
                color: 'black',
                weight: 1,
                fillColor: getColor(depth),
                fillOpacity: 0.7
            }).bindPopup(`Magnitude: ${magnitude}<br>Depth: ${depth}`).addTo(map);
        });
        
        // Create a legend
        let legend = L.control({ position: 'bottomright' });
        legend.onAdd = function (map) {
            let div = L.DomUtil.create('div', 'info legend');
            let depths = [0, 20, 50, 100, 300];
            for (let i = 0; i < depths.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
                    depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
            }
            return div;
        };
        legend.addTo(map);
    })
    .catch(error => console.error('Error:', error));
