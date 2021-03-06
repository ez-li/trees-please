// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com

mapboxgl.accessToken = 'pk.eyJ1IjoibGluaHBoYWFhbSIsImEiOiJja2Y4c2Z5N3kwOThuMnRtaHczZ3dnbWFmIn0.8ABZB_jFyTWSj7hd_6Gj5w';

var geojson = {
    'type': 'FeatureCollection',
    'features': []
};

var startAddress = [37.754740, -122.424460];

d3.csv("../Trees_Lat_Long.csv").then(function(data) {

    data.forEach(function(d) {
        d.latitude = +d.latitude;
        d.longitude = +d.longitude;
        feature = {};
        feature['type'] = 'Feature'
        feature['properties'] = {
            'name': d.Tree,
            'iconSize': [30, 30]
        },
        feature['geometry'] = {
            'type': 'Point',
            'coordinates': [d.longitude, d.latitude]
        }
        geojson['features'].push(feature)

        })


    geojson.features.forEach(function (marker) {
        // create a DOM element for the marker
        var el = document.createElement('div');
        el.className = 'marker';

        var tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        el.appendChild(tooltip);

        var tooltiptext = document.createElement('span');
        tooltiptext.className = 'tooltiptext';
        tooltip.appendChild(tooltiptext);

        tooltiptext.innerHTML = marker.properties.name;
        
        el.style.width = marker.properties.iconSize[0] + 'px';
        el.style.height = marker.properties.iconSize[1] + 'px';
    
        // el.addEventListener('click', function () {
        //     window.alert(marker.properties.message);
        //     });
    
        new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map);
    
    });

    var randomTree = data[Math.floor(Math.random() * data.length)];

    getDirections(randomTree);


});

var map = new mapboxgl.Map({
    container: 'map',
    // style: 'mapbox://styles/mapbox/streets-v11', 
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-122.3837697, 37.7441324],
    zoom: 12
    });

var start = [-122.3837697, 37.7441324];

// map.addControl(
//     new MapboxDirections({
//         accessToken: mapboxgl.accessToken
//     }),
//     'top-left'
// );

var geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
});

map.addControl(geolocate);

console.log(map);

function getDirections(tree) {
    console.log("outerping");
    geolocate.on('geolocate', function() {

        
        // var userLocation = [geolocate._lastKnownPosition.coords.longitude, geolocate._lastKnownPosition.coords.latitude];
        
        // dummy location for Martha/Linh working outside of SF
        var userLocation = [-122.424460, 37.754740];
        var treeLocation = [tree.longitude, tree.latitude];

        console.log("ping");
        var directions = new MapboxDirections({
            accessToken: mapboxgl.accessToken,
            profile: 'mapbox/walking',
            controls: {
                inputs: false
                // instructions: false
            }
        });

        map.addControl(directions, 'top-left');
    
        directions.setOrigin(userLocation);
        directions.setDestination(treeLocation); 

        console.log(directions);

    // HERE IS THE TREE POPUP
    var popup = new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat([tree.longitude, tree.latitude])
    .setHTML('<div class=“popup”> <h3>' + tree.Tree + '</h3> <img src="./Trees-Please_Images/Acacia_baileyana.JPG" style="width:200px;height=100"> </div>')
    .addTo(map);  

    });

};

//idk what this does -Martha
// map.addControl(
// new mapboxgl.GeolocateControl({
// positionOptions: {
// enableHighAccuracy: true
// },
// trackUserLocation: true
// })
// );
