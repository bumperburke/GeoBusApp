$('#tableSelectError').hide();

$("#selectTimetable").click(function(){
    if($("#routeSelect").val() === "Choose a Route"){
        $('#tableSelectError').html("<center>Please Select a Route!</center>");
        hideShowAlert('#tableSelectError');
        return false;
    }else{
        sessionStorage.selectedTimetable = $("#routeSelect").val();
        $.ajax({
            type: "GET",
            url: "https://www.geobus.co.uk/api/v1/getTimetable/"+sessionStorage.selectedTimetable,
            success: function (data) {
                if (data.error === false) {
                    var directions = ["dundalk->dublin", "dublin->dundalk", "bettystown->laytown->dublin", "dublin->laytown->bettystown"];
                    var monFriResults = data.data.timetable.monFri;
                    var satResults = data.data.timetable.sat;
                    var sunResults = data.data.timetable.sun;
                    var message = [];

                    var firstInStop = null;
                    var firstOutStop = null;
                    var inboundStops = [];
                    var outboundStops = [];
                    var count = 0;
                    var inNumCols = new Object();
                    var outNumCols = new Object();
                    var inbound = new Object();
                    var outbound = new Object();
                    var firstDirection = monFriResults[0].direction;

                    if(monFriResults !== null){
                        var res1 = inboundOutbound(monFriResults, firstDirection);
                        inbound["monFri"] = res1["inbound"];
                        outbound["monFri"] = res1["outbound"];
                    }else{message.push("No Timetable For Midweek");}

                    if(satResults !== null){
                        var res2 = inboundOutbound(satResults, firstDirection);
                        inbound["sat"] = res2["inbound"];
                        outbound["sat"] = res2["outbound"];
                    }else{message.push("No Timetable For Saturday");}

                    if(sunResults !== null){
                        var res3 = inboundOutbound(sunResults, firstDirection);
                        inbound["sun"] = res3["inbound"];
                        outbound["sun"] = res3["outbound"];
                    }else{message.push("No Timetable For Sunday/Bank Holiday");}


                    firstInStop = inbound["monFri"][0].name;
                    inboundStops.push(firstInStop);
                    //For loop to get the stop names
                    for(i = 0; i < inbound["monFri"].length; i++){
                        if(inbound["monFri"][i].name !== inboundStops[count]){
                            inboundStops.push(inbound["monFri"][i].name);
                            count++;
                        }
                        else if(inboundStops[count] === inbound["monFri"][i].name){

                        }
                    }

                    count = 0;
                    firstOutStop = outbound["monFri"][0].name;
                    outboundStops.push(firstOutStop);
                    //For loop to get the stop names
                    for(i = 0; i < outbound["monFri"].length; i++){
                        if(outbound["monFri"][i].name !== outboundStops[count]){
                            outboundStops.push(outbound["monFri"][i].name);
                            count++;
                        }
                        else if(outboundStops[count] === outbound["monFri"][i].name){

                        }
                    }

                    inNumCols["monFri"] = getCols(inbound["monFri"])/inboundStops.length;
                    outNumCols["monFri"] = getCols(outbound["monFri"])/outboundStops.length;
                    inNumCols["sat"] = getCols(inbound["sat"])/inboundStops.length;
                    outNumCols["sat"] = getCols(outbound["sat"])/outboundStops.length;

                    $.mobile.changePage('#displayTimetable');

                    $('#header1').append("<b>"+inbound["monFri"][0].direction+"</b>");
                    if(inbound["monFri"][0].direction === directions[0]){
                        inNumCols["sun"] = getCols(inbound["sun"])/inboundStops.length;
                        generateTables("Monday to Friday", '#inbound', inbound["monFri"], inboundStops, inNumCols["monFri"]);
                        generateTables("Saturday", '#inbound', inbound["sat"], inboundStops, inNumCols["sat"]);
                        generateTables("Sunday/Bank Holidays", '#inbound', inbound["sun"], inboundStops, inNumCols["sun"]);
                    }else if(inbound["monFri"][0].direction === directions[2]){
                        generateTables("Monday to Friday", '#inbound', inbound["monFri"], inboundStops, inNumCols["monFri"]);
                        generateTables("Saturday, Sunday & Bank Holiday", '#inbound', inbound["sat"], inboundStops, inNumCols["sat"]);
                    }
                    
                    
                    $('#header2').append("<b>"+outbound["monFri"][0].direction+"</b>");
                    if(outbound["monFri"][0].direction === directions[1]){
                        outNumCols["sun"] = getCols(outbound["sun"])/outboundStops.length;
                        generateTables("Monday to Friday", '#outbound', outbound["monFri"], outboundStops, outNumCols["monFri"]);
                        generateTables("Saturday", '#outbound', outbound["sat"], outboundStops, outNumCols["sat"]);
                        generateTables("Sunday/Bank Holidays", '#outbound', outbound["sun"], outboundStops, outNumCols["sun"]);
                    }else if(outbound["monFri"][0].direction === directions[3]){
                        generateTables("Monday to Friday", '#outbound', outbound["monFri"], outboundStops, outNumCols["monFri"]);
                        generateTables("Saturday, Sunday & Bank Holiday", '#outbound', outbound["sat"], outboundStops, outNumCols["sat"]);
                    }

                } else if (data.error === true) {

                }
            },
            error: function (data) {
                $('#tableSelectError').html("<center>Whoops! Something has gone wrong. Check Internet Connection and Try Again!</center>");
                hideShowAlert('#tableSelectError');
            }
        });

        return false;
    }
});
    

function getCols(obj){
    var count = 0;
    for(i = 0; i < obj.length; i++){
        count++;
    }
    return count;
}
    
function inboundOutbound(results, firstDirection){
    var inbound = [];
    var outbound = [];
    var returns = new Object();
    
    //For loop to differentiate between journey direction
    for(j = 0; j < results.length; j++){
        if(results[j].direction === firstDirection){
            inbound.push(results[j]);
        }
        else{
            outbound.push(results[j]);
        }
    }
    
    returns["inbound"] = inbound;
    returns["outbound"] = outbound;
    return returns;
}

function generateTables(capt, divId, trips, stops, numCols){
    var html = '<table data-role="table" class="ui-responsive">';
    html += '<caption><b>'+capt+'</b></caption>';
    var count = 0;
    var multiplier = 2;
    var colsHolder = numCols;
    
    for (i = 0; i < stops.length; i++) {
        html += '<tr><th id="stops">' + stops[i] + '</th>';
        
        for (; count < colsHolder; count++) {
            if(trips[count].time === null){
                html += '<td id="times"><center><b><font color="red">No Service</font></b></center></td>';
            }else{
                html += '<td id="times"><b>' + trips[count].time.slice(0, 5) + '</b></td>';
            }
        }
        html += '</tr>';
        colsHolder = numCols*multiplier;
        multiplier++;
    }

        html += '</table>';
    
    $(divId).append(html);
}

function hideShowAlert(alertId){
    $(alertId).fadeTo(4000, 500).slideUp(500, function(){
        $(alertId).hide();
    });
}