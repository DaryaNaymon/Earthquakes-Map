function getColor(d) {
       return d > 90 ? '#800026' :
          d > 70  ? '#BD0026' :
          d > 50  ? '#E31A1C' :
          d > 30  ? '#FC4E2A' :
          d > 10   ? '#FD8D3C' :
          d > -10   ? '#FEB24C' :
          '#FFEDA0';
        }
function createMap(earthquake_markers,centerlat, centerlong) {
    // Create the tile layer that will be the background of our map.
    var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    // Create a baseMaps object to hold the streetmap layer.
    var baseMaps = {
      "Street Map": streetmap
    };
    // Create an overlayMaps object to hold the layer.
    var overlayMaps = {
      "earthquake_markers": earthquake_markers
    };
    // Create the map object with options.
    var map = L.map("map", {
      center: [centerlat, centerlong],
      zoom: 4,
      layers: [streetmap, earthquake_markers]
    });
    var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [ -10, 10, 30, 50, 70, 90],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="float:left; width:18px; height:18px; background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);
    // // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    // L.control.layers(baseMaps, overlayMaps, {
    //   collapsed: false
    // }).addTo(map);
  }
  function createMarkers(response, centerlat, centerlong) {
    // Pull the "earthquake" property from response.data.
    var stations = response.features;
    // Initialize an array
    var earthquake_markers = [];
    // Loop through the stations array.
    for (var index = 0; index < stations.length; index++) {
      var station = stations[index];
      // For each station, create a marker, and bind a popup with the station's name.
      var earthquake_marker= L.circleMarker([station["geometry"]["coordinates"][1], station["geometry"]["coordinates"][0]],{
        radius:station["properties"]["mag"],color:getColor(station["geometry"]["coordinates"][2])})
        .bindPopup("<h3> magnitude" + station["properties"]["mag"] + "</h3><h3>longtitude: " + station["geometry"]["coordinates"][0] 
        +"</h3><h3>latitude: " + station["geometry"]["coordinates"][1]  +"</h3><h3>depth: " + station["geometry"]["coordinates"][2]+"</h3>");
      // Add the marker to the bikeMarkers array.
      earthquake_markers.push(earthquake_marker);
    }
    // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
    createMap(L.layerGroup(earthquake_markers),centerlat, centerlong);
  }
  // Perform an API call to the  API to get the station information. Call createMarkers when it completes.
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data){
  var centerleft = (data["bbox"][4]-data["bbox"][1])/2+data["bbox"][1]
  var centerlong = (data["bbox"][3]-data["bbox"][0])/2+data["bbox"][0]
 createMarkers(data,centerleft,centerlong)
})