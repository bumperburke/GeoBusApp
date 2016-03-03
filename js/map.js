var map;

map = L.map('map');

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var userIcon = L.icon({
    iconUrl: '../images/userMapPin.png',
    iconSize: [38, 85],
    iconAnchor: [22, 94]
});

map.locate({
    setView: true,
    maxZoom: 18,
    enableHighAccuracy: true
});

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

function onLocationFound(e) {
    var radius = e.accuracy / 2;

    L.marker(e.latlng, {
        icon: userIcon
    }).addTo(map)
        .bindPopup("You are within " + radius + " meters of this point.").openPop$
}

function onLocationError(e) {
    alert(e.message);
}

$.ajax({
    type: "GET",
    url: "https://www.geobus.co.uk/api/v1/getLocation",
    success: function (data) {
        if (data.error == false) {
            var locations = data.data.locations;
            var pointList = [];
            for (i = 0; i < locations.length; i++) {
                pointList[i] = new L.latLng(locations[i].Xpos, locations[i].Ypos);
            }

            var polyline = L.polyline(pointList);
            polyline.addTo(map).bindPopup("Route: Dublin->Drogheda->Dundalk");

        } else if (data.error == true) {
            //hideShowAlert($('#failAlert'));
        }
    },
    error: function (data) {
        console.log(data);
    }
});

$.ajax({
    type: "GET",
    url: "https://www.geobus.co.uk/api/v1/getStops",
    success: function (data) {
        if (data.error == false) {
            var stops = data.data.stops;
            var markerList = [];
            for (i = 0; i < stops.length; i++) {
                marker = new L.marker([stops[i].Xpos, stops[i].Ypos]).bindPopup(stops[i].name).addTo(map); //.bindPopup(stops.name[i]);

                //markerList.push(marker);
            }

            //map.addLayer(markerList);

        } else if (data.error == true) {
            //hideShowAlert($('#failAlert'));
        }
    },
    error: function (data) {
        console.log(data);
        //console.log(result.error+"\n"+result.user+"\n"+result.token+"\n"+result.message);
    }
});


    /*$('#submitRoute').click(function(){
        var route = $('#submitRoute').val();
        console.log(route);*/
    /**/

    /*    return false;
    });
    */
    /*L.easyButton('<img src="../images/locateUser.png">', function(btn, map){

    }).addTo(map);*/
//});*/