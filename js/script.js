// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com

mapboxgl.accessToken = 'pk.eyJ1IjoibGluaHBoYWFhbSIsImEiOiJja2Y4c2Z5N3kwOThuMnRtaHczZ3dnbWFmIn0.8ABZB_jFyTWSj7hd_6Gj5w';

var geojson = {
    'type': 'FeatureCollection',
    'features': []
};

//var startAddress = [37.754740, -122.424460];
var startAddress = userLocation;

// dummy location for Martha/Linh working outside of SF
var userLocation = [-122.424460, 37.754740];
//userLocation = [position.coords.longitude, position.coords.latitude]  

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }
  
  function showPosition(position) {

    userLocation = [position.coords.longitude, position.coords.latitude]  
}

getLocation()


d3.csv("../Trees_Lat_Long.csv").then(function(data) {

    data.forEach(function(d) {
        d.latitude = +d.latitude;
        d.longitude = +d.longitude;
        d.image_name = +d.Image_name;
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
    
    // TODO make a loop that keeps getting new random trees until the distance is short enough to walk
    // make variable that tracks distance between user and tree
    // var treeLocation = [randomTree.longitude, randomTree.latitude];
    // my location is userLocation
    // see if mapbox has api for distance, or just use the raw lat long
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

        
        var userLocation = [geolocate._lastKnownPosition.coords.longitude, geolocate._lastKnownPosition.coords.latitude];
        
        // dummy location for Martha/Linh working outside of SF
        //var userLocation = [-122.424460, 37.754740];
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
    //var ImageFileName = TreeNametoImage(tree.Tree);
    var ImageFileName = tree.Image_name;
    console.log(ImageFileName);
    var ThankYou='<div class="thank_you_box"><a href= "https://www.amazon.com/Trees-San-Francisco-Michael-Sullivan/dp/089997743X/ref=sr_1_1?dchild=1&keywords=trees+of+san+francisco&qid=1602093502&sr=8-1"> Tree identified and photographed by Mike Sullivan </a></div>'
    console.log(ImageFileName)
    if(ImageFileName == "default_tree.png"){
        ThankYou='<div class="thank_you_box"><a href= "https://www.amazon.com/Trees-San-Francisco-Michael-Sullivan/dp/089997743X/ref=sr_1_1?dchild=1&keywords=trees+of+san+francisco&qid=1602093502&sr=8-1"> Tree identified by Mike Sullivan </a></div>';
    }
    var popup = new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat([tree.longitude, tree.latitude])
    .setHTML('<div class=“popup”> <h3 class="hover_image">' + tree.Tree + '</h3> <img class ="hover_image" src="./Sullivan_tree_images/' + ImageFileName + '" style="width:200px;height=100"> </div>'
                + ThankYou)
    .addTo(map);  

    });

   


};

// <div class = "thank_you_box">
//<p> Trees located and photographed by Mike Sullivan. <a href= "https://www.amazon.com/Trees-San-Francisco-Michael-Sullivan/dp/089997743X/ref=sr_1_1?dchild=1&keywords=trees+of+san+francisco&qid=1602093502&sr=8-1" </a> </p></div>

function TreeNametoImage(tree_name){
    //return "Acacia_baileyana.JPG"
    if (tree_name.toLowerCase().includes("acacia baileyana")) {
        ImageFileName = "Acacia_baileyana.JPG";
    }

    else if (tree_name.toLowerCase().includes("acacia decurrens")) {
        ImageFileName = "Acacia_decurrens.jpg";
    }

    else if (tree_name.toLowerCase().includes("acacia longifolia")) {
        ImageFileName = "Acacia_longifolia_02.jpg";
    }

    else if (tree_name.toLowerCase().includes("acacia melanoxylon")){
        ImageFileName = "Acacia_melanoxylon_inflorescences.jpg"
    }

    else if (tree_name.toLowerCase().includes("arbutus")){
        ImageFileName = "Arbutus_marina.jpg"
    }

    else if (tree_name.toLowerCase().includes("corymbia")){
        ImageFileName = "Corymbia_ficifolia_(6728155313).jpg"
    }

    else if (tree_name.toLowerCase().includes("cupressus")){
        ImageFileName = "Cupressus_macrocarpa_Carmel.jpg"
    }

    else if (tree_name.toLowerCase().includes("eucalyptus")){
        ImageFileName = "Eucalyptus_globulus_globulus_fruit.jpg"
    }    

    else if (tree_name.toLowerCase().includes("sideroxylon")){
        ImageFileName = "Eucalyptus_sideroxylon_flowers.jpg"
    }      

    else if (tree_name.toLowerCase().includes("geijera")){
        ImageFileName = "Geijera_parviflora.jpg"
    }     

    else if (tree_name.toLowerCase().includes("liquidambar")){
        ImageFileName = "Liquidambar_styraciflua_fruits_in_spring.jpg"
    } 
    
    else if (tree_name.toLowerCase().includes("lophostemon")){
        ImageFileName = "Lophostemon_confertus,_habitus,_Pretoria,_b.jpg"
    }  

    else if (tree_name.toLowerCase().includes("metrosideros")){
        ImageFileName = "Metrosideros_excelsa_'Aurea'_(7442020750).jpg"
    }  

    else if (tree_name.toLowerCase().includes("phoenix")){
        ImageFileName = "Phoenix_canariensis_on_Union_Square_San_Francisco.jpg"
    }    

    else if (tree_name.toLowerCase().includes("pinea")){
        ImageFileName = "Pinus_pinea_Pompeii.jpg"
    }        

    else if (tree_name.toLowerCase().includes("pinus")){
        ImageFileName = "Pinus_Radiata_detail.jpg"
    }    

    else if (tree_name.toLowerCase().includes("pittosporum")){
        ImageFileName = "Pittosporum_undulatum.jpg"
    }  
    
    else if (tree_name.toLowerCase().includes("platanus")){
        ImageFileName = "Platanus_x_hispanica.leaves.jpg"
    }   
    
    else if (tree_name.toLowerCase().includes("prunus")){
        ImageFileName = "Prunus Blireiana.jpg"
    }  

    else if (tree_name.toLowerCase().includes("cupressocyparis")){
        ImageFileName = "X_Cupressocyparis_leylandii2.jpg"
    }  

    else {
        ImageFileName = "noun_Tree_392970.png"
    }
    return ImageFileName
} 




//idk what this does -Martha
// map.addControl(
// new mapboxgl.GeolocateControl({
// positionOptions: {
// enableHighAccuracy: true
// },
// trackUserLocation: true
// })
// );
