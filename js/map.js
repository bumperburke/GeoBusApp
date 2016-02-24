function getLocations() {
    $.ajax({
        type: "GET",
        url: "https://www.geobus.co.uk/api/v1/getLocation",
        success: function (data) {
            if (data.error == false) {
                //locations = data.data.locations[0].Xpos;
                //returnLocations(data.data.locations);
                loadMap(data.data.locations);
                //console.log(data.data.locations[0].Ypos);
                //console.log(locations[0]);
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

function loadMap(locations) {
    var map = L.map('map'); //.setView([51.505, -0.09], 13);
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var pointList = [];
    for (i = 0; i < locations.length; i++) {
        //console.log(locations[i].Ypos);
        pointList[i] = new L.latLng(locations[i].Xpos, locations[i].Ypos);
        //var polyline = L.polyline([locations[i].Xpos, locations[i].Ypos]).addTo(map);
    }
    
    var polyline = L.polyline(pointList);
    polyline.addTo(map).bindPopup("Route: Dublin->Drogheda->Dundalk");

    var userIcon = L.icon({
        iconUrl: '../images/userMapPin.png',
        iconSize:     [38, 85],
        iconAnchor: [22, 94]
    });
    
    function onLocationFound(e) {
        var radius = e.accuracy;

        L.marker(e.latlng, {icon: userIcon}).addTo(map)
            .bindPopup("You are here").openPop$

        L.circle(e.latlng, radius).addTo(map);
    }

    function onLocationError(e) {
        alert(e.message);
    }

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);

    map.locate({
        setView: true,
        maxZoom: 18
    });
}