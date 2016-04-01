/*
*   Summary: This is the map.js file that is called on login. It initializes all of the map data and functionality
*/

//Method that is called everytime the home page is opened
$("#home").on("pageshow",function(event, ui) {
    map.invalidateSize(); //This resizes the map on page show.
    
    //Method to check if the busToTrack variable is a number. This means it has been set and user wants to track bus.
    if(!isNaN(sessionStorage.busToTrack)){
        trackBus(sessionStorage.busToTrack); //call track bus method
    }
});

//Variable initializations
var map; //map variable
var inteval; //variable to hold the interval of the track bus ajax request
var polys = []; //array to hold polylines
var dunDrogDub, bTown, ifsc, dunDrogDubStops, bTownStops, ifscStops; //variables that will be stop layers
var routes = ["Dundalk-Drogheda-Dublin", "Bettystown-Laytown-Dublin", "IFSC"]; //available routes
var locateFlag = true; //flag to check if user wants to be tracked or not

//Custom marker initializations
var userIcon = L.MakiMarkers.icon({icon: "pitch", color: "#228b22", size: "m"});
var busIcon = L.MakiMarkers.icon({icon: "bus", color: "#29ABE2", size: "m"});
var stopIcon = L.MakiMarkers.icon({icon: "circle", color: "#FF0000", size: "m"});
var userMarker, busMarker;

//Layer group initializations
dunDrogDubStops = L.layerGroup();
bTownStops = L.layerGroup();
ifscStops = L.layerGroup();

//Custom Map buttons initialization and specification
//Refresh Button
var refreshControl =  L.Control.extend({
    options: {
        position: 'topleft' //position button top left of map
    },
    onAdd: function (map) { //on the button being added run this function passing in the map variable
        var container = L.DomUtil.create('button'); //create a button in the DOM
        container.id="mapButton"; //Assign id to button
        container.innerHTML = '<i class="fa fa-refresh"></i>'; //insert a font awesome icon onto button
        
        //method to handle button clicks
        container.onclick = function(){
            location.reload(); //reload current page
        }
     
        return container; //return container
    }
});

//Locate user button
var locateControl =  L.Control.extend({
    options: {
        position: 'topleft' //position button top left of map
    },
    onAdd: function (map) { //on the button being added run this function passing in the map variable
        var container = L.DomUtil.create('button'); //create a button in the DOM
        container.id="mapButton"; //Assign id to button
        container.innerHTML = '<i id="locateButton" class="fa fa-crosshairs"></i>'; //insert a font awesome icon onto button

        //method to handle button clicks
        container.onclick = function(){
            if(locateFlag === true){ //if locateFlag is true
                map.locate({setView: false, enableHighAccuracy: true, watch: true, maxZoom: 18}); //relocate user calling leaflet locate method
                locateFlag = false; //set the flag to false
                $("#locateButton").css("color", "green"); //change button colour
            }
            else if(locateFlag === false){ //if locateFlag is false
                map.stopLocate(); //stop tracking user
                locateFlag = true; //set flag to true
                $("#locateButton").css("color", "black"); //set button colour
            }
            
        }

        return container; //return container
    }
});

//Track button
var trackControl =  L.Control.extend({
    options: {
        position: 'topleft' //position button top left of map
    },
    onAdd: function (map) { //on the button being added run this function passing in the map variable
        var container = L.DomUtil.create('button'); //create a button in the DOM
        container.id="mapButton"; //Assign id to button
        container.innerHTML = '<i id="busTrackBtn" class="fa fa-bus"></i>'; //insert a font awesome icon onto button

        //method to handle button clicks
        container.onclick = function(){
            if(sessionStorage.busToTrack === "false"){ //if busToTrack is false then the button has a default action
                $.mobile.changePage('#track'); //redirect to the track page
            }else{ // else busToTrack is set then a bus is being tracked
                sessionStorage.busToTrack = false; //set busToTrack to false 
                clearInterval(inteval); //clear the timer interval on the ajax request for updating bus location
                $("#busTrackBtn").css("color", "black"); //change the button colour back to black
                map.removeLayer(busMarker); //remove the bus marker
            }
        }

        return container; //return container
    }
});

//Get all routes and stops by calling getRoute and getStops methods
getRoute(routes[0]);
getRoute(routes[1]);
getRoute(routes[2]);
getStops(routes[0], 0);
getStops(routes[1], 1);
getStops(routes[2], 2);

//Create the layer groups and assign them to variables
dunDrogDub = L.layerGroup([polys[0]]);
bTown = L.layerGroup([polys[1]]);
ifsc = L.layerGroup([polys[2]]);

//Tile layer initializations for OSM Roads layer and OSM default
var OpenMapSurfer_Roads = L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
    maxZoom: 18, //set max map zoom
    minZoom: 5, //set min map zoom
    attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var osmDefault = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18, //set max map zoom
    minZoom: 5, //set min map zoom
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});

//Map initialization. Passing in the layers which we want to select from and disabling the zoom buttons as we can pinch
map = L.map('map', {zoomControl: false, layers: [osmDefault, dunDrogDub, bTown, ifsc, dunDrogDubStops, bTownStops, ifscStops]});
//Add the custom controls to the map
map.addControl(new refreshControl());
map.addControl(new locateControl());
map.addControl(new trackControl());

//Two arrays to group layers together. One group for map types and another for Routes and Stops.
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
            "Bettystown-Laytown-Dublin": bTownStops,
                "IFSC": ifscStops
    }
};

//This uses a leaflet plugin called GroupLayers so the above arrays will be recognised by leaflet
var layerControl = L.control.groupedLayers(baseMaps, routeLayer, {
    collapsed: true //always set the map layer to be collapsed as it is a mobile application
}).addTo(map); //add layer group to the map

//Remove the layers from the map so the map opens with no layers on it
map.removeLayer(dunDrogDub);
map.removeLayer(bTown);
map.removeLayer(ifsc);
map.removeLayer(dunDrogDubStops);
map.removeLayer(bTownStops);
map.removeLayer(ifscStops);

//Leaflet method to locate user
map.locate({
    setView: true,
    maxZoom: 18, //max map zoom
    enableHighAccuracy: true, //enable high GPS accuracy
});

map.on('locationfound', onLocationFound); //leaflet method for finding location
map.on('locationerror', onLocationError); //leaflet method if there is an error finding location

/*
*   Summary: Leaflet function which is called anytime a location changes. Called by map.on('locationfound', onLocationFound);
*   Parameters: e - a browser parameter that contains data such as latitude, longitude, heading etc.
*/
function onLocationFound(e) {
    console.log("Tracking");
    if(userMarker === undefined){ //if userMarker is not already on map when method called
        userMarker = L.marker(e.latlng,{icon: userIcon}).addTo(map).bindPopup(""+sessionStorage.user); //create marker and add to map
    }else{ //else if marker is on map when this is called
        map.removeLayer(userMarker); //remove the marker
        userMarker = L.marker(e.latlng,{icon: userIcon}).addTo(map).bindPopup(""+sessionStorage.user); //then add the new updated marker
    }
}

/*
*   Summary: Leaflet function that is called if gelocation cannot be found
*   Parameters: e - a browser parameter that contains data such as latitude, longitude, heading etc.
*/
function onLocationError(e) {
    alert("Error Finding Location. Reload Page or Try Again Later"); //print alert with error message
    map.stopLocate(); //stop locating user
}

/*
*   Summary: Function to retrieve all stops from the server
*   Parameters: route - takes in a route name, id - route id whci differentiates which layer to add data to
*/
function getStops(route, id){
    $.ajax({ //start ajax request
        type: "GET", //it is a get request
        url: "https://www.geobus.co.uk/api/v1/getStops/"+route, //server URL
        beforeSend: function(request){ //before send option to add custom header to request
            request.setRequestHeader("Auth", sessionStorage.token); //add token to header request
        },
        async: false, //set asynchronous to false because I want request to complete before continuing 
        success: function (data) { //on request success
            if (data.error == false) { //if data recieved from server is not flagged as false by my server code
                var stops = data.data.stops; //assign the retrieved stops to variable
                var marker; //create marker variable
                var layerToAdd; //create layer to add variable
                if(id === 0){layerToAdd = dunDrogDubStops;} //if the passed id is 0 the layerToAdd will be dundalk, drogheda, dunblin stops
                else if(id === 1){layerToAdd = bTownStops;} //else if the passed id is 1 the layerToAdd will be bettystown, laytown, dunblin stops
                else if(id === 2){layerToAdd = ifscStops;} //else if the passed id is 2 the layerToAdd will be IFSC stops
                for (i = 0; i < stops.length; i++) {    //for loop to iterate through all the receieved stops
                    //create a new marker for every stop retrieved and add it to the specified layerToAdd variable
                    marker = new L.marker([stops[i].Xpos, stops[i].Ypos], {icon: stopIcon}).bindPopup(stops[i].name).addTo(layerToAdd);
                }

                } else if (data == "invalid/expired token") { //else if there is an error passed back
                    //console.log(data); //log the data to console
                    window.location.assign("index.html#loginPage"); //redirect to login page because user is not logged in or token has expired or is invalid
                }
        },
        error: function (data) {
            //console.log(data); //if error with ajax request log the data to console
            
        }
    });
}

/*
*   Summary: Function to retrieve all routes from the server
*   Parameters: route - takes in a route name
*/
function getRoute(route){
    $.ajax({
        type: "GET", //it is a get request
        url: "https://www.geobus.co.uk/api/v1/getRouteMap/"+route, //server url
        beforeSend: function(request){ //before send function to add custom headers
            request.setRequestHeader("Auth", sessionStorage.token); //add token to header
        },
        async: false, //set asynchronous to false because I want request to complete before continuing
        success: function (data) { //on ajax request success
            if (data.error == false) { //if data recieved from server is not flagged as false by my server code
                var locations = data.data.route; //assign retrieved data to variable
                var pointList = []; //array to hold the points
                for (i = 0; i < locations.length; i++) { //for loop to iterate through the points
                    pointList[i] = new L.latLng(locations[i].Xpos, locations[i].Ypos); //add lat and long to pointList as a single latlng pair
                }

                var polyline = L.polyline(pointList); //create a leaflet polyline with the point list
                polyline.bindPopup("Route: "+route); //bind the route name to the polyline
                polys.push(polyline); //push the polyline to the polys array

            } else if (data == "invalid/expired token") { //else if there is an error passed back
                //console.log(data); //log the data to console
                window.location.assign("index.html#loginPage"); //redirect to login page because user is not logged in or token has expired or is invalid
            }
        },
        error: function (data) {
        //console.log(data); //if error with ajax request log the data to console
        }
    });
}

/*
*   Summary: This function puts the bus on the map intiality then starts a timer to call an ajax request every minute
*   Parameters: devID - takes in device id to track
*/
function trackBus(devID){
    trackCall(devID); //call trackCall method to put bus on map
    inteval = setInterval(function() { //set an interval of 1 minute
        map.removeLayer(busMarker); //remove the bus marker
        trackCall(devID); //call trackCall
    }, 1000 * 30); //30 seconds
}

/*
*   Summary: Function to retrieve the location of the selected bus from the server
*   Parameters: devID - takes in the device id to track
*/
function trackCall(devID){    
    $.ajax({
        type: "GET", //it is a get reqeust
        url: "https://www.geobus.co.uk/api/v1/getLocation/"+devID, //server URL
        beforeSend: function(request){ //before send function to add custom headers
            request.setRequestHeader("Auth", sessionStorage.token); //add token to header
        },
        async: false, //set asynchronous to false
        success: function (data) { //on ajax request success
            if (data.error == false) { //if data recieved from server is not flagged as false by my server code
            var lat = data.data[0].Xpos; //assign retrieved latitude to variable
            var lng = data.data[0].Ypos; //assign retrieved longititude to variable

            busMarker = L.marker([lat, lng],{icon: busIcon}).addTo(map).bindPopup(""+data.data[0].timestamp); //create bus marker and add to map
            } else if (data == "invalid/expired token") { //else if there is an error passed back
            //console.log(data); //log the data to console
            window.location.assign("index.html#loginPage"); //redirect to login page because user is not logged in or token has expired or is invalid
            }
        },
        error: function (data) { //if problem with ajax request
            //console.log(data); //if error with ajax request log the data to console
            sessionStorage.busToTrack = false; //set busToTrack to false 
            clearInterval(inteval); //clear the timer interval on the ajax request for updating bus location
            $("#busTrackBtn").css("color", "black"); //change the button colour back to black
            map.removeLayer(busMarker); //remove the bus marker
            $.mobile.changePage('#track'); //change page to track page
            //Set error on track page and the call hideShowAlert to display and dismiss the alert
            $('#trackRouteSelectError').html("<center>An Error Has Occured. Please Check Internet Connection & Try Again.</center>");
            hideShowAlert($('#trackRouteSelectError'));
        }
    });
}

/*
*   Summary: hideShowAlert is used to show a popup alert on screen and then automatically close it after a few seconds
*   Parameters: alertId - the ID of the alert so it knows which alert to show.
*/
function hideShowAlert(alertId) {
    $(alertId).show('slow', function () {
        $(alertId).fadeTo(4000, 500).slideUp(500, function () {
            $(alertId).hide();
        });
    });
}