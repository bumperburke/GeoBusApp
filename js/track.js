/**
*   Summary: This class is used by the track page in order to retrieve available buses for tracking from server
*/

//JQuery on page show function that clears previous selected data from display
$('#track').on("pageshow", function(event, ui){
    $('#availableBuses').empty();
});

//Hide the error popup bar until needed
$('#trackRouteSelectError').hide();

//Onclick function when a user clicks the select button on track page
$("#trackRoute").click(function(){
    var route; //variable to hold selected timetable
    $('#availableBuses').empty(); //clear the heading when button is clicked to eliminate duplicate headings

    //If the selected route value is "choose a route"
    if($('#routeTrackSelect').val() === "Choose a Route"){
        $('#trackRouteSelectError').html("<center>Please Select a Route!</center>"); //Set the text of the error popup bar
        hideShowAlert('#trackRouteSelectError'); //call hideShowAlert method passing in the ID on error popup bar
        return false; //return false to the onclick function so the page does not redirect
    }else{
        route = $('#routeTrackSelect').val(); //else store the selected route in variable
        
        $.ajax({ //begin ajax request
            type: "GET", //it is a get request
            beforeSend: function(request){ //before send ajax method to add custom headers
                request.setRequestHeader("Auth", sessionStorage.token); //set the Auth header with user token
            },
            url: "https://www.geobus.co.uk/api/v1/getLocation/"+route, //Server URL
            success: function (data) { //on ajax request success
                if (data.error === false) { //if the server does not send an error flag back
                    if(data.data == "No Data Available"){ //if there is no data available
                        //Create a variable to hold html code to notify user that there is no available data and append to div on track page
                        var html = '<br/><center><font color="red"><h5>Sorry, No Times Available For: '+route;
                        html += '<br/>Please Try Again Later or Select Another Service</h5></font></center>';
                        $('#availableBuses').append(html);
                    }else{ //else if there is data
                        console.log(data);
                        var html = '<center><h3>Available Viehcles:<h3></center>'; //create variable to hole html code with heading
                        html += '<center><h4>'+route+'</h4>'; //add the route to the html
                        for(i = 0; i < data.data.length; i++){
                            var timestamp = data.data[i].timestamp; //retrieve the timestamp of available bus
                            timestamp = timestamp.split(" "); //split the timestamp on space
                            html += '<label>'+timestamp[1]+'</label>'; //add timestamp label to differentiate available buses
                            //create a hyperlink icon so a user can click on it. This will call setBusToTrack and redirect to home page to begin tracking
                            html += '<a href="#home" onclick="setBusToTrack('+data.data[i].deviceID+')"><i id="busIcon" class="fa fa-bus"></i></a>';
                        }
                        html += '</center>'; //close center html brackets
                        $('#availableBuses').append(html); //append html to div on track page
                    }

                } else if (data.error === true) { //else if there is an error flag passed back by server
                    //Set the popup error text and call hideShowAlert
                    $('#trackRouteSelectError').html("<center>Whoops Something Has Gone Wrong On Our End! We Apologize, Please Try Again Later.</center>");
                    hideShowAlert($('#trackRouteSelectError'));
                    return false; //return false to onclick function so page does not redirect
                }
            },
            error: function (data) { //if the ajax function fails
                //set the popup error text and call hideShowAlert
                $('#trackRouteSelectError').html("<center>Whoops Something Has Gone Wrong! Check Internet Connection & Try Again.</center>");
                hideShowAlert($('#trackRouteSelectError'));
            }
        });

        return false; //return false so page does not redirect
    }
    return false; //return false so page does not redirect
});

/*
*   Summary: setBusToTrack is called when a user clicks on an icon hyperling to begin tracking a bus
*   Parameters: devID - the ID of the device on the bus, which is passed back by the server
*/
function setBusToTrack(devID){
    //set the sessionStorage variable busToTrack to the device ID retrieved
    sessionStorage.busToTrack = devID;
    $("#busTrackBtn").css("color", "green"); //set the map button to green to indicate that a bus is being tracked
}

/*
*   Summary: hideShowAlert is used to show a popup alert on screen and then automatically close it after a few seconds
*   Parameters: alertId - the ID of the alert so it knows which alert to show.
*/
function hideShowAlert(alertId){
    $(alertId).fadeTo(4000, 500).slideUp(500, function(){
        $(alertId).hide();
    });
}