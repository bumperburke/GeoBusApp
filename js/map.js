var map;
var polys = [];
var dunDrogDub, bTown, ifsc, dunDrogDubStops, bTownStops, ifscStops;
var routes = ["Dundalk-Drogheda-Dublin", "Bettystown-Laytown-Dublin", "IFSC"];
var userIcon = L.MakiMarkers.icon({icon: "pitch", color: "#228b22", size: "m"});
var busIcon = L.MakiMarkers.icon({icon: "bus", color: "#29ABE2", size: "m"});
var stopIcon = L.MakiMarkers.icon({icon: "circle", color: "#FF0000", size: "m"});
dunDrogDubStops = L.layerGroup();
bTownStops = L.layerGroup();
//dunDrogDubStops = L.layerGroup();

getRoute(routes[0]);
getRoute(routes[1]);
getRoute(routes[2]);
getStops(routes[0], 0);
getStops(routes[1], 1);
//getStops(routes[2]);

dunDrogDub = L.layerGroup([polys[0]]);
bTown = L.layerGroup([polys[1]]);
ifsc = L.layerGroup([polys[2]]);

var OpenMapSurfer_Roads = L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
    maxZoom: 18,
    attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var osmDefault = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});

map = L.map('map', {zoomControl: false, layers: [osmDefault, dunDrogDub, bTown, ifsc, dunDrogDubStops, bTownStops]});

var baseMaps = {
    "Default": osmDefault,
    "Roads": OpenMapSurfer_Roads
};

var routeLayer = {
    "Routes":{
        "Dundalk-Drogheda-Dublin": dunDrogDub,
            "Bettystown-Laytown-Dublin": bTown,
                "IFSC": ifsc
    },
    "Stops":{
        "Dundalk-Drogheda-Dublin": dunDrogDubStops,
            "Bettystown-Laytown-Dublin": bTownStops
    }
};

var options = {
    exclusiveGroups: ["Routes"]
};

var layerControl = L.control.groupedLayers(baseMaps, routeLayer, {
    collapsed: true
}).addTo(map);

map.removeLayer(dunDrogDub);
map.removeLayer(bTown);
map.removeLayer(ifsc);
map.removeLayer(dunDrogDubStops);
map.removeLayer(bTownStops);

map.locate({
    setView: true,
    maxZoom: 18,
    enableHighAccuracy: true
});

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

function onLocationFound(e) {
    var radius = e.accuracy / 2;

    L.marker(e.latlng,{icon: userIcon}).addTo(map)
        .bindPopup(""+sessionStorage.user).openPop$
}

function onLocationError(e) {
    alert(e.message);
}

function createLayer(data){
    layer.push(data);
}

function getStops(route, id){
    $.ajax({
        type: "GET",
        url: "https://www.geobus.co.uk/api/v1/getStops/"+route,
        async: false,
        success: function (data) {
            if (data.error == false) {
                var stops = data.data.stops;
                var marker;
                var layerToAdd;
                if(id === 0){layerToAdd = dunDrogDubStops;}
                else if(id === 1){layerToAdd = bTownStops;}
                for (i = 0; i < stops.length; i++) {    
                    marker = new L.marker([stops[i].Xpos, stops[i].Ypos], {icon: stopIcon}).bindPopup(stops[i].name).addTo(layerToAdd);
                }

            } else if (data.error == true) {
                //hideShowAlert($('#failAlert'));
            }
        },
        error: function (data) {
            console.log(data);
            //console.log(result.error+"\n"+result.user+"\n"+result.token+"\n"+result.message);
        }
    });
}

function getRoute(route){
    $.ajax({
        type: "GET",
        url: "https://www.geobus.co.uk/api/v1/getRouteMap/"+route,
        async: false,
        success: function (data) {
            if (data.error == false) {
                var locations = data.data.route;
                var pointList = [];
                for (i = 0; i < locations.length; i++) {
                    pointList[i] = new L.latLng(locations[i].Xpos, locations[i].Ypos);
                }

                var polyline = L.polyline(pointList);
                polyline.bindPopup("Route: "+route);
                polys.push(polyline);

            } else if (data.error == true) {
                //hideShowAlert($('#failAlert'));
            }
        },
        error: function (data) {
            console.log(data);
        }
    });
}

function refresh(){
    location.reload();
}

function center(){
    map.locate({setView : true});
}