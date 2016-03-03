//alert(sessionStorage.user+", "+sessionStorage.token);
    $('#successAlert').show();
    hideShowAlert($('#successAlert'));

    function hideShowAlert(alertId){
        $(alertId).fadeTo(4000, 500).slideUp(500, function(){
            $(alertId).hide();
        });
    }

/*var map;

function loadMap(){
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
}*/

    
    /*$('#submitRoute').click(function(){
        var selectedRoute = $('#routeSelect').val();
        alert(selectedRoute);
        
        return false;
    });*/