// Create the 'basemap' tile layer that will be the background of our map.
let basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
});
// Create the map object with center and zoom options.
let myMap = L.map("map").setView([40.52, -112.67], 5);
// Then add the 'basemap' tile layer to the map.
basemap.addTo(myMap);

// Make a request that retrieves the earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  // This function returns the style data for each of the earthquakes we plot on
  // the map. Pass the magnitude and depth of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
    return {
        opacity: 1,
        fillOpacity: 0.6,
        fillColor: getColor(feature.properties.mag), // Function to determine color based on magnitude
        color: "#000000", // Outline color
        radius: getRadius(feature.properties.mag), // Function to determine radius based on magnitude
        stroke: true,
        weight: 0.5
    };
}

  // This function determines the color of the marker based on the depth of the earthquake.
  function getColor(magnitude) {
    if (magnitude > 5) {
        return "#ff0000"; // Red for high magnitude
    } else if (magnitude > 4) {
        return "#ff7f00"; // Orange for moderate magnitude
    } else if (magnitude > 3) {
        return "#ffff00"; // Yellow for low magnitude
    } else {
        return "#00ff00"; // Green for very low magnitude
    }
}

  // This function determines the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude) {
    return magnitude * 4; // Adjust the multiplier for desired radius size
}

  // Add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    // Turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, styleInfo(feature)); // Create a circleMarker with the style from styleInfo
  },
    // Set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`Magnitude: ${feature.properties.mag}<br>Location: ${feature.properties.place}`); // Popup with magnitude and location
  }
}).addTo(myMap); // Make sure to add the GeoJSON layer to the map
// Create a legend control object.
let legend = L.control({
  position: "bottomright"
});

// Then add all the details for the legend
legend.onAdd = function () {
  let div = L.DomUtil.create("div", "info legend");

  // Initialize magnitude intervals and colors for the legend
  const magnitudeIntervals = [0, 3, 4, 5, 6]; // Define magnitude intervals
  const colors = [
      "#00ff00", // Green for 0-3
      "#ffff00", // Yellow for 3-4
      "#ff7f00", // Orange for 4-5
      "#ff0000"  // Red for 5+
  ];

  // Loop through our magnitude intervals to generate a label with a colored square for each interval.
  for (let i = 0; i < colors.length; i++) {
      div.innerHTML +=
          '<i style="background:' + colors[i] + '"></i> ' + // Colored square
          magnitudeIntervals[i] + (magnitudeIntervals[i + 1] ? '&ndash;' + magnitudeIntervals[i + 1] + '<br>' : '+');
  }

  return div;
};

// Finally, add the legend to the map.
legend.addTo(myMap);
});