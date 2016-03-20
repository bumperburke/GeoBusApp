$('#track').on("pageshow", function(event, ui){
    $('#availableBuses').empty();
});

$('#trackRouteSelectError').hide();

$("#selectTrackTimetable").click(function(){
    var timetable;
    $('#availableBuses').empty();

    if($('#routeTrackSelect').val() === "Choose a Route"){
        $('#trackRouteSelectError').html("<center>Please Select a Route!</center>");
        hideShowAlert('#trackRouteSelectError');
        return false;
    }else{
        timetable = $('#routeTrackSelect').val();
        
        $.ajax({
            type: "GET",
            url: "https://www.geobus.co.uk/api/v1/getLocation/"+timetable,
            success: function (data) {
                if (data.error === false) {
                    if(data.data == "No Data Available"){
                        var html = '<br/><center><font color="red"><h5>Sorry, No Times Available For: '+timetable;
                        html += '<br/>Please Try Again Later or Select Another Service</h5></font></center>';
                        $('#availableBuses').append(html);
                    }else{
                        var timetstamp = data.data[0].timestamp;
                        timetstamp = timetstamp.split(" ");
                        var html = '<center><h3>Available Viehcles:<h3></center>';
                        html += '<center><h4>'+timetable+'</h4>';
                        html += '<label>'+timetstamp[1]+'</label>';
                        html += '<a href="#home" onclick="setBusToTrack('+data.data[0].deviceID+')"><i id="busIcon" class="fa fa-bus"></i></a></center>';
                        $('#availableBuses').append(html);
                    }

                } else if (data.error === true) {
                    $('#failAlert').html("<center>Invalid Login Credentials!</center>");
                    hideShowAlert($('#failAlert'));
                    return false;
                }
            },
            error: function (data) {
                $('#trackRouteSelectError').html("<center>Whoops Something Has Gone Wrong! Check Internet Connection & Try Again.</center>");
                hideShowAlert($('#trackRouteSelectError'));
            }
        });

        return false;
    }
    return false;
});

function setBusToTrack(devID){
    sessionStorage.busToTrack = devID;
    $("#busTrackBtn").css("color", "green");
}

function hideShowAlert(alertId){
    $(alertId).fadeTo(4000, 500).slideUp(500, function(){
        $(alertId).hide();
    });
}